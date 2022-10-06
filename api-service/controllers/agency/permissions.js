const asyncHandler = require('../../middleware/async');
const { Permission, RolePermission } = require('../../models');

const { Op } = require('sequelize');
const _ = require('lodash');

// const {
//   createTerminationReport,
// } = require('../../services/termination.service');

// @desc     Get Permissions
// @route    GET /api/v1/agency/permissions
// @access   PUBLIC
exports.getPermissions = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let data = await Permission.findAll({
    attributes: ['permissionId', 'feature', 'access', 'description'],
    order: [
      ['feature', 'ASC'],
      ['permissionId', 'ASC'],
    ],
  });

  data = _.chain(data).groupBy('feature');

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Create Permissions
// @route    POST /api/v1/agency/permissions
// @access   PUBLIC
exports.addPermissions = asyncHandler(async (req, res, next) => {
  const data = await Permission.create(req.body);
  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Get RolePermissions
// @route    GET /api/v1/agency/permissions/rolePermissions
// @access   PUBLIC
exports.getRolePermissions = asyncHandler(async (req, res, next) => {
  const { roleId, permissionId } = req.query;

  let data = await RolePermission.findAll({
    attributes: ['roleId', 'permissionId'],
    where: { roleId, permissionId },
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Get RolePermissions
// @route    GET /api/v1/agency/permissions/featureRoles
// @access   PUBLIC
exports.getFeatureRoles = asyncHandler(async (req, res, next) => {
  const { roleId, feature } = req.query;

  let data = await Permission.findAll({
    attributes: ['feature', 'permissionId'],
    where: {
      feature,
    },
    include: {
      model: RolePermission,
      attributes: [],
      where: {
        roleId,
      },
    },
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Update RolePermissions
// @route    POST /api/v1/agency/permissions/featureRoles
// @access   PUBLIC
exports.updateRolePermissions = asyncHandler(async (req, res, next) => {
  const { roleId, permissionId, toggle } = req.body;
  let p = await Permission.findByPk(permissionId);

  if (toggle) {
    await RolePermission.upsert({ roleId, permissionId });
  } else {
    await RolePermission.destroy({ where: { roleId, permissionId } });
  }

  res.status(200).json({
    success: true,
    result: { description: p.description ?? p.access },
    action: toggle ? 'Added' : 'Removed',
  });
});
