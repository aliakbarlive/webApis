'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({
      AgencyClient,
      Employee,
      AccountEmployee,
      Alert,
      Member,
      Role,
      UserGroup,
      Cell,
      Pod,
      Squad,
    }) {
      this.hasMany(Member, { foreignKey: 'userId', as: 'memberships' });

      this.hasMany(AccountEmployee, {
        foreignKey: 'userId',
        as: 'employees',
      });

      this.hasMany(Employee, { foreignKey: 'userId' });

      this.hasOne(AgencyClient, {
        as: 'defaultAgency',
        sourceKey: 'userId',
        foreignKey: 'defaultContactId',
      });
      this.hasOne(UserGroup, {
        foreignKey: 'userId',
        as: 'memberId',
      });
      this.hasMany(Alert, { foreignKey: 'userId', as: 'alerts' });

      this.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
      this.belongsToMany(Cell, {
        through: UserGroup,
        foreignKey: 'userId',
      });
      this.belongsToMany(Pod, {
        through: UserGroup,
        foreignKey: 'userId',
      });
      this.belongsToMany(Squad, {
        through: UserGroup,
        foreignKey: 'userId',
      });
    }
    toJSON() {
      return {
        ...this.get(),
        password: undefined,
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined,
        verifyEmailToken: undefined,
        verifyEmailExpire: undefined,
      };
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Email already exists' },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpire: DataTypes.STRING,
      verifyEmailToken: DataTypes.STRING,
      verifyEmailExpire: DataTypes.DATE,
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      displayName: DataTypes.STRING,
      trainingDate: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      tableName: 'users',
      modelName: 'User',
      scopes: {
        withRoles: {
          include: [
            {
              model: sequelize.models.Role,
              as: 'roles',
              through: { attributes: [] },
            },
          ],
        },
        withAccounts: {
          include: [
            {
              model: sequelize.models.Account,
              as: 'accounts',
              attributes: ['accountId', 'name'],
              through: { attributes: [] },
            },
          ],
        },
        withContactAgency: {
          include: [
            {
              model: sequelize.models.AgencyClient,
              as: 'defaultAgency',
            },
          ],
        },
      },
    }
  );

  // Encrypt password using bcrypt
  User.beforeCreate(async (user, options) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Sign JWT and return
  User.prototype.getSignedJwtToken = function () {
    return jwt.sign({ id: this.userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

  // Match user entered password to hashed password in database
  User.prototype.matchPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  // Generate and hash password token
  User.prototype.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set to expire in 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

  User.prototype.generateEmailVerificationToken = function () {
    // email confirmation token
    const verificationToken = crypto.randomBytes(3).toString('hex');

    this.verifyEmailToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Set to expire in 5 minutes
    this.verifyEmailExpire = new Date(Date.now() + 5 * 60 * 1000);

    return verificationToken;
  };

  User.prototype.sendAlert = async function (details) {
    return await this.createAlert(details);
  };

  return User;
};
