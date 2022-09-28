'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
          UPDATE 
            "advCampaignRecords" 
          SET 
            "sales" = "attributedSales30d", 
            "orders" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedSales30d" > 0  AND "sales" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "orders" = 0
              )
            ) 
            AND "advCampaignId" in (
              SELECT 
                "advCampaignId" 
              FROM 
                "advCampaigns" 
              WHERE 
                "campaignType" in (
                  'sponsoredProducts', 'sponsoredDisplay'
                )
            );        
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE
            "advCampaignRecords" 
          SET 
            "sales" = "attributedSales14d", 
            "orders" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedSales14d" > 0 AND "sales" = 0
              ) 
              OR (
                "unitsSold14d" > 0 AND "orders" = 0
              )
            ) 
            AND "advCampaignId" in (
              SELECT 
                "advCampaignId" 
              FROM 
                "advCampaigns" 
              WHERE 
                "campaignType" in ('sponsoredBrands')
            );        
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advAdGroupRecords" 
          SET 
            "sales" = "attributedSales30d",
            "orders" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedSales30d" > 0  AND "sales" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "orders" = 0
              )
            ) 
            AND "advAdGroupId" in (
              SELECT 
                "advAdGroupId" FROM "advAdGroups" 
                            WHERE "advCampaignId" in
                              (
                                SELECT "advCampaignId" 
                                  FROM "advCampaigns"
                                  WHERE "campaignType" in ('sponsoredProducts', 'sponsoredDisplay')
                              )
                        );
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advAdGroupRecords" 
          SET 
            "sales" = "attributedSales14d",
            "orders" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedSales14d" > 0  AND "sales" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "orders" = 0
              )
            ) 
            AND "advAdGroupId" in (
              SELECT 
                "advAdGroupId" FROM "advAdGroups" 
                WHERE "advCampaignId" in
                (
                  SELECT "advCampaignId" 
                    FROM "advCampaigns"
                    WHERE "campaignType" in ('sponsoredBrands')
                )
              );
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advKeywordRecords" 
          SET 
          "sales" = "attributedSales30d",
          "orders" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedSales30d" > 0  AND "sales" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "orders" = 0
              )
            )
            AND "advKeywordId" in (
              SELECT 
                "advKeywordId" 
              FROM 
                "advKeywords" 
              where 
                "advAdGroupId" IN (
                  SELECT 
                    "advAdGroupId" FROM "advAdGroups" 
                                  WHERE "advCampaignId" in
                                    (
                                      SELECT "advCampaignId" FROM "advCampaigns"
                                      WHERE "campaignType" in ('sponsoredProducts', 'sponsoredDisplay')
                                    )
                              )
                        ); 
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advKeywordRecords" 
          SET 
          "sales" = "attributedSales14d",
          "orders" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedSales14d" > 0  AND "sales" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "orders" = 0
              )
            )
            AND "advKeywordId" in (
              SELECT 
                "advKeywordId" 
              FROM 
                "advKeywords" 
              where 
                "advAdGroupId" IN (
                  SELECT 
                    "advAdGroupId" FROM "advAdGroups" 
                                  WHERE "advCampaignId" in
                                  (
                                    SELECT "advCampaignId" FROM "advCampaigns"
                                      WHERE "campaignType" in ('sponsoredBrands')
                                  )
                              )
                        );        
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advTargetRecords" 
          SET 
          "sales" = "attributedSales30d",
          "orders" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedSales30d" > 0  AND "sales" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "orders" = 0
              )
            )
            AND "advTargetId" in (
              SELECT 
                "advTargetId" 
              FROM 
                "advTargets" 
              where 
                "advAdGroupId" IN (
                  SELECT 
                    "advAdGroupId" FROM "advAdGroups" 
                                  WHERE "advCampaignId" in
                                    (
                                      SELECT "advCampaignId" FROM "advCampaigns"
                                      WHERE "campaignType" in ('sponsoredProducts', 'sponsoredDisplay')
                                    )
                              )
                        ); 
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advTargetRecords" 
          SET 
          "sales" = "attributedSales14d",
          "orders" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedSales14d" > 0  AND "sales" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "orders" = 0
              )
            )
            AND "advTargetId" in (
              SELECT 
                "advTargetId" 
              FROM 
                "advTargets" 
              where 
                "advAdGroupId" IN (
                  SELECT 
                    "advAdGroupId" FROM "advAdGroups" 
                                  WHERE "advCampaignId" in
                                    (
                                      SELECT "advCampaignId" FROM "advCampaigns"
                                        WHERE "campaignType" in ('sponsoredBrands')
                                    )
                              )
                        );        
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advProductAdRecords" 
          SET 
          "sales" = "attributedSales30d",
          "orders" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedSales30d" > 0  AND "sales" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "orders" = 0
              )
            )
            AND "advProductAdId" in (
              SELECT 
                "advProductAdId" 
              FROM 
                "advProductAds" 
              where 
                "advAdGroupId" IN (
                  SELECT 
                    "advAdGroupId" FROM "advAdGroups" 
                                  WHERE "advCampaignId" in
                                    (
                                      SELECT "advCampaignId" FROM "advCampaigns"
                                      WHERE "campaignType" in ('sponsoredProducts', 'sponsoredDisplay')
                                    )
                              )
                        );    
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advProductAdRecords" 
          SET 
          "sales" = "attributedSales14d",
          "orders" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedSales14d" > 0  AND "sales" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "orders" = 0
              )
            )
            AND "advProductAdId" in (
              SELECT 
                "advProductAdId" 
              FROM 
                "advProductAds" 
              where 
                "advAdGroupId" IN (
                  SELECT 
                    "advAdGroupId" FROM "advAdGroups" 
                                  WHERE "advCampaignId" in
                                  (
                                    SELECT "advCampaignId" FROM "advCampaigns"
                                      WHERE "campaignType" in ('sponsoredBrands')
                                  )
                              )
                        );       
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advSearchTermRecords" 
          SET 
            "sales" = "attributedSales30d", 
            "orders" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedSales30d" > 0  AND "sales" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "orders" = 0
              )
            ) 
            AND "advSearchTermId" in (
              SELECT 
                "advSearchTermId" FROM "advSearchTerms" 
                            WHERE "advCampaignId" in
                              (
                                SELECT "advCampaignId" FROM "advCampaigns"
                                  WHERE "campaignType" in ('sponsoredProducts', 'sponsoredDisplay')
                              )
                        );
          `,
          { transaction }
        ),

        queryInterface.sequelize.query(
          `
          UPDATE 
            "advSearchTermRecords" 
          SET 
            "sales" = "attributedSales14d",
            "orders" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedSales14d" > 0  AND "sales" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "orders" = 0
              )
            ) 
            AND "advSearchTermId" in (
              SELECT 
                "advSearchTermId" FROM "advSearchTerms" 
                            WHERE "advCampaignId" in
                              (
                                SELECT "advCampaignId" FROM "advCampaigns"
                                  WHERE "campaignType" in ('sponsoredBrands')
                              )
                        );
          `,
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkUpdate(
          'advCampaignRecords',
          { sales: 0, orders: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advAdGroupRecords',
          { sales: 0, orders: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advKeywordRecords',
          { sales: 0, orders: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advTargetRecords',
          { sales: 0, orders: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advProductAdRecords',
          { sales: 0, orders: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advSearchTermRecords',
          { sales: 0, orders: 0 },
          {},
          { transaction }
        ),
      ]);
    });
  },
};
