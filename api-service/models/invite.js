'use strict';
const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    static associate({ Account, Role }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
      });
      this.belongsTo(Role, {
        as: 'userRole',
        sourceKey: 'roleId',
        foreignKey: 'userRoleId',
      });
      this.belongsTo(Role, {
        as: 'accountRole',
        sourceKey: 'roleId',
        foreignKey: 'accountRoleId',
      });
    }
  }
  Invite.init(
    {
      inviteId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      accountId: {
        type: DataTypes.UUID,
        foreignKey: true,
      },
      userRoleId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      accountRoleId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Please enter email' },
          notEmpty: { msg: 'Email field must not be empty' },
        },
      },
      inviteToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      inviteExpire: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isPpc: {
        type: DataTypes.BOOLEAN,
      },
      departmentId: {
        type: DataTypes.INTEGER,
      },
      squadId: {
        type: DataTypes.INTEGER,
      },
      podId: {
        type: DataTypes.INTEGER,
      },
      cellId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      scopes: {
        notExpired: {
          where: {
            inviteEmailExpire: {
              [Op.gt]: Date.now(),
            },
          },
        },
        notApproved: {
          where: {
            status: {
              [Op.not]: 'approved',
            },
          },
        },
      },
      sequelize,
      modelName: 'Invite',
      tableName: 'invites',
    }
  );

  Invite.prototype.send = async function () {
    const queue = require('../queues/ses/sendRawEmail');
    const subject = 'BetterSeller User Invite';
    const message = `please visit this link to continue the registration process: ${process.env.SITE_URL}/register/${this.inviteId}`;

    await queue.add(
      { email: this.email, subject, message, invite: this },
      {
        attempts: 5,
        backoff: 1000 * 60 * 1,
      }
    );
  };

  return Invite;
};
