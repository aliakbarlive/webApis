const asyncHandler = require('@middleware/async');

const { listRoles, createRole, updateRole } = require('./role.service');

// @desc     List role records
// @route    GET /api/v1/roles
// @access   Private
exports.listRoles = asyncHandler(async (req, res, next) => {
  const response = await listRoles(req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Add role records
// @route    POST /api/v1/roles
// @access   Private
exports.createRole = asyncHandler(async (req, res, next) => {
  const response = await createRole(req);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Update role records
// @route    Put /api/v1/roles
// @access   Private
exports.updateRole = asyncHandler(async (req, res, next) => {
  const { roleId } = req.params;
  const response = await updateRole(req, roleId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
