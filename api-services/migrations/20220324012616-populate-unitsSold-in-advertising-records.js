'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkUpdate(
          'advCampaignRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advAdGroupRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advKeywordRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advTargetRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advProductAdRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advSearchTermRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),
      ]);
    });

    await queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
          UPDATE 
            "advCampaignRecords" 
          SET 
            "orders" = "attributedConversions30d", 
            "unitsSold" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedConversions30d" > 0  AND "orders" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "unitsSold" = 0
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
            "orders" = "attributedConversions14d", 
            "unitsSold" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedConversions14d" > 0 AND "orders" = 0
              ) 
              OR (
                "unitsSold14d" > 0 AND "unitsSold" = 0
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
            "orders" = "attributedConversions30d",
            "unitsSold" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedConversions30d" > 0  AND "orders" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "unitsSold" = 0
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
            "orders" = "attributedConversions14d",
            "unitsSold" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedConversions14d" > 0  AND "orders" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "unitsSold" = 0
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
          "orders" = "attributedConversions30d",
          "unitsSold" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedConversions30d" > 0  AND "orders" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "unitsSold" = 0
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
          "orders" = "attributedConversions14d",
          "unitsSold" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedConversions14d" > 0  AND "orders" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "unitsSold" = 0
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
          "orders" = "attributedConversions30d",
          "unitsSold" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedConversions30d" > 0  AND "orders" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "unitsSold" = 0
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
          "orders" = "attributedConversions14d",
          "unitsSold" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedConversions14d" > 0  AND "orders" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "unitsSold" = 0
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
          "orders" = "attributedConversions30d",
          "unitsSold" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedConversions30d" > 0  AND "orders" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "unitsSold" = 0
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
          "orders" = "attributedConversions14d",
          "unitsSold" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedConversions14d" > 0  AND "orders" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "unitsSold" = 0
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
            "orders" = "attributedConversions30d", 
            "unitsSold" = "attributedUnitsOrdered30d" 
          WHERE 
            (
              (
                "attributedConversions30d" > 0  AND "orders" = 0
              )
              OR (
                "attributedUnitsOrdered30d" > 0 AND "unitsSold" = 0
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
            "orders" = "attributedConversions14d",
            "unitsSold" = "unitsSold14d" 
          WHERE 
            (
              (
                "attributedConversions14d" > 0  AND "orders" = 0
              )
              OR (
                "unitsSold14d" > 0 AND "unitsSold" = 0
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
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advAdGroupRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advKeywordRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advTargetRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advProductAdRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),

        queryInterface.bulkUpdate(
          'advSearchTermRecords',
          { orders: 0, unitsSold: 0 },
          {},
          { transaction }
        ),
      ]);
    });
  },
};
