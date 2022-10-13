'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KeywordRanking extends Model {
    static associate({ Listing, KeywordRankingRecord }) {
      this.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
      this.hasMany(KeywordRankingRecord, {
        as: 'records',
        foreignKey: 'keywordId',
      });
    }
  }
  KeywordRanking.init(
    {
      keywordId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      listingId: {
        type: DataTypes.BIGINT,
        foreignKey: true,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      keywordText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'keywordRankings',
      modelName: 'KeywordRanking',
    }
  );

  KeywordRanking.beforeCreate(async (keyword, options) => {
    try {
      const { models } = sequelize;
      const { accountId } = keyword;

      const exist = await models.KeywordRanking.findOne({
        where: {
          accountId,
        },
        raw: true,
      });

      // If first keyword record for this accountId, run keywords queue
      if (!exist) {
        const jobId = `${accountId}-keywords`;

        const RequestKeywordsQueue = require('../queues/keywords/request');

        await RequestKeywordsQueue.add(
          { accountId },
          {
            jobId,
            repeat: { cron: '0 7 * * *' },
          }
        );
        console.log(
          `accountId: ${accountId} first record run cron queue for keyword. jobId: ${jobId}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  });

  return KeywordRanking;
};
