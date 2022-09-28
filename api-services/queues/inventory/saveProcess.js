const {
  InventoryItem,
  InventoryDetail,
  Product,
  SyncReport,
  SyncRecord,
  Listing,
  ListingAlertConfiguration,
  sequelize,
} = require('../../models');
const moment = require('moment');
const sleep = require('../../utils/sleep');

const saveProcess = async (job, done) => {
  const { syncReportId, marketplaceId } = job.data;

  try {
    // * Get Selling Partner request details
    const syncReport = await SyncReport.findByPk(syncReportId, {
      include: {
        model: SyncRecord,
        as: 'syncRecord',
      },
    });

    // * Get account information
    const account = await syncReport.syncRecord.getAccount();
    const { accountId } = account;

    // * Initialize SP-API client
    const spApiClient = await account.spApiClient('na');

    let count = 0;
    let nextToken;

    // * Initialize inventory array
    const inventorySummaries = [];

    while (nextToken === undefined || nextToken !== null) {
      sleep(1000);

      count++;

      try {
        // * Make SP-API call
        let response = await spApiClient.callAPI({
          endpoint: 'fbaInventory',
          operation: 'getInventorySummaries',
          query: {
            details: true,
            granularityType: 'Marketplace',
            granularityId: marketplaceId,
            marketplaceIds: marketplaceId,
            nextToken: typeof nextToken == 'string' ? nextToken : '',
          },
        });

        // * Update nextToken value from SP-API response
        nextToken = response.nextToken ? response.nextToken : null;

        // * Push response to inventory array
        inventorySummaries.push(...response.inventorySummaries);
      } catch (error) {
        done(new Error(error.message));
      }
    }

    await sequelize.transaction(async (t1) => {
      try {
        // * Loop through SP-API response
        for (const summary of inventorySummaries) {
          const {
            asin,
            fnSku,
            sellerSku,
            condition,
            lastUpdatedTime,
            productName,
            totalQuantity,
            inventoryDetails,
          } = summary;

          const lut = moment(lastUpdatedTime);

          // * Insert or update product
          await Product.upsert({
            asin,
            accountId,
          });

          // * Check if listing already exists
          const listing = await Listing.findOne({
            where: { asin, marketplaceId },
          });

          if (!listing) {
            // * Create listing
            await Listing.create({
              asin,
              marketplaceId,
              quantity: totalQuantity,
            });
          } else {
            // * Update listing
            await listing.changed('updatedAt', true);
            await listing.update({
              quantity: totalQuantity,
              updatedAt: Date.now(),
            });
          }

          // * Check if inventoryItem exists
          let inventoryItem = await InventoryItem.findOne({
            where: { accountId, marketplaceId, asin, fnSku, sellerSku },
            include: {
              model: InventoryDetail,
              as: 'details',
            },
          });

          const inventoryItemFields = {
            condition,
            lastUpdatedTime: lut.isValid() ? lastUpdatedTime : null,
            productName,
            totalQuantity,
          };

          if (!inventoryItem) {
            // * Create inventory item
            const newInventoryItem = await InventoryItem.create({
              accountId,
              marketplaceId,
              asin,
              fnSku,
              sellerSku,
              ...inventoryItemFields,
            });

            // * Create inventory detail
            await InventoryDetail.create({
              inventoryItemId: newInventoryItem.inventoryItemId,
              ...inventoryDetails,
            });
          } else {
            // * Update inventory item
            await inventoryItem.changed('updatedAt', true);
            await inventoryItem.update(inventoryItemFields);

            const inventoryDetail = await InventoryDetail.findOne({
              where: {
                inventoryItemId: inventoryItem.inventoryItemId,
              },
            });

            // * Check low stock by comparing old and new fulfillableQuantity
            const prevFulfillableQuantity = inventoryDetail.fulfillableQuantity;
            const newFulfillableQuantity = inventoryDetails.fulfillableQuantity;

            if (prevFulfillableQuantity !== newFulfillableQuantity) {
              await sendAlertWhenStockIsLow(
                account,
                inventoryItem,
                inventoryDetail
              );
            }

            // * Update inventory detail
            await inventoryDetail.changed('updatedAt', true);
            await inventoryDetail.update({
              ...inventoryDetails,
              updatedAt: Date.now(),
            });
          }
        }
      } catch (error) {
        done(new Error(error.message));
      }
    });

    done(null, { ...job.data, count });

    // let nextToken = true;
    // let count = 1;

    // while (nextToken) {
    //   const fbaInventory = await spApiClient.callAPI({
    //     endpoint: 'fbaInventory',
    //     operation: 'getInventorySummaries',
    //     query: {
    //       details: true,
    //       granularityType: 'Marketplace',
    //       granularityId: marketplaceId,
    //       marketplaceIds: [marketplaceId],
    //       nextToken: typeof nextToken == 'string' ? nextToken : '',
    //     },
    //   });

    //   const { inventorySummaries } = fbaInventory;

    //   let t;

    //   try {
    //     t = await sequelize.transaction();
    //     inventorySummaries.map(async (summary) => {
    //       const {
    //         asin,
    //         fnSku,
    //         sellerSku,
    //         condition,
    //         lastUpdatedTime,
    //         productName,
    //         totalQuantity,
    //         inventoryDetails,
    //       } = summary;

    //       const lut = moment(lastUpdatedTime);

    //       let inventoryItem = await InventoryItem.findOne(
    //         {
    //           where: { accountId, marketplaceId, asin, fnSku, sellerSku },
    //           include: [InventoryDetail],
    //         },
    //         { transaction: t }
    //       );

    //       await Product.upsert(
    //         {
    //           asin,
    //           accountId,
    //         },
    //         {},
    //         { transaction: t }
    //       );

    //       const listingData = { asin, marketplaceId };
    //       const listing = await Listing.findOne(
    //         {
    //           where: listingData,
    //         },
    //         { transaction: t }
    //       );

    //       if (!listing) {
    //         await Listing.create(
    //           {
    //             ...listingData,
    //             price: 0, // no price from inventory summary endpoint
    //             quantity: totalQuantity,
    //           },
    //           {},
    //           { transaction: t }
    //         );
    //       } else {
    //         await listing.update(
    //           {
    //             price: 0, // no price from inventory summary endpoint
    //             quantity: totalQuantity,
    //           },
    //           {},
    //           { transaction: t }
    //         );
    //       }

    //       const fields = {
    //         condition,
    //         lastUpdatedTime: lut.isValid() ? lastUpdatedTime : null,
    //         productName,
    //         totalQuantity,
    //       };
    //       if (inventoryItem == null) {
    //         await InventoryItem.create(
    //           {
    //             accountId,
    //             marketplaceId,
    //             asin,
    //             fnSku,
    //             sellerSku,
    //             ...fields,
    //             InventoryDetail: inventoryDetails,
    //           },
    //           { include: [InventoryDetail] },
    //           { transaction: t }
    //         );
    //       } else {
    //         const jsonInventoryItem = JSON.parse(
    //           JSON.stringify(inventoryItem, null, 2)
    //         );
    //         if (
    //           jsonInventoryItem.InventoryDetail.inventoryDetailId !== undefined
    //         ) {
    //           const prevFulfillableQuantity =
    //             jsonInventoryItem.InventoryDetail.fulfillableQuantity;

    //           const inventoryDetail = await InventoryDetail.findByPk(
    //             jsonInventoryItem.InventoryDetail.inventoryDetailId
    //           );
    //           const newInventoryDetail = await inventoryDetail.update(
    //             inventoryDetails,
    //             {},
    //             {
    //               transaction: t,
    //             }
    //           );

    //           if (
    //             prevFulfillableQuantity !=
    //             newInventoryDetail.fulfillableQuantity
    //           )
    //             await sendAlertWhenStockIsLow(account, inventoryItem, t);
    //         }
    //       }
    //     });
    //     await t.commit();
    //   } catch (error) {
    //     console.log(error);
    //     if (t) {
    //       await t.rollback();
    //     }
    //   }
    //   nextToken = fbaInventory.nextToken;
    //   if (nextToken) count++;
    // }
  } catch (err) {
    done(new Error(err));
  }
};

const sendAlertWhenStockIsLow = async (
  account,
  inventoryItem,
  inventoryDetail
) => {
  const listing = await inventoryItem.getListing({
    attributes: ['asin', 'marketplaceId', 'listingImages'],
    where: {
      marketplaceId: inventoryItem.marketplaceId,
    },
    include: [
      {
        model: ListingAlertConfiguration,
        as: 'alertConfiguration',
      },
    ],
  });

  if (listing.alertConfiguration) {
    const { fulfillableQuantity } = inventoryDetail;
    const { marketplaceId, asin, alertConfiguration } = listing;
    const { status, lowStock, lowStockThreshold } = alertConfiguration;

    if (status && lowStock && lowStockThreshold > fulfillableQuantity) {
      await account.sendAlertToUsers({
        marketplaceId,
        type: 'lowStock',
        listingId: listing.listingId,
        title: `Your running out of stock for asin ${asin}. Current stock is ${fulfillableQuantity}.`,
        data: {
          alertable: {
            type: 'InventoryItem',
            id: inventoryItem.inventoryItemId,
          },
        },
      });
    }
  }
};

module.exports = saveProcess;
