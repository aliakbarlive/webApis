const asyncHandler = require('../../middleware/async');
const {
  User,
  Role,
  Department,
  Squad,
  Pod,
  Cell,
  UserGroup,
  CellClient,
  AgencyClient,
} = require('../../models');
const { Op, fn, literal } = require('sequelize');

const ErrorResponse = require('../../utils/errorResponse');
const validator = require('../../utils/validator');
const inviteService = require('../../services/invite.service');
const agencyEmployee = require('../../services/agencyEmployee.service');

// @desc Get all employees with agency roles
// @route GET /api/v1/agency/employees
// @access Private
exports.getEmployees = asyncHandler(async (req, res, next) => {
  const {
    page,
    pageSize,
    pageOffset,
    sortField,
    sortOrder,
    type,
    roleId,
    cellId,
    podId,
    squadId,
    search,
  } = req.query;
  const isRequired = type || cellId || podId || squadId ? true : false;

  const userAttributes = [
    'userId',
    'firstName',
    'lastName',
    'email',
    'createdAt',
    'updatedAt',
  ];
  const roleAttributes = ['name', 'level', 'department'];
  const squadAttributes = ['memberId.squad.name'];
  const podAttributes = ['memberId.pod.name'];
  const cellAttributes = ['memberId.cell.name'];

  let where = {};
  if (roleId) {
    where = {
      roleId,
    };
  }
  if (search) {
    where[Op.and] = {
      [Op.or]: ['lastName', 'firstName', 'email'].map((attribute) => {
        return {
          [attribute]: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }),
    };
  }

  const squadQuery = {
    attributes: ['squadId', 'name', 'type'],
    model: Squad,
    as: 'squad',
  };

  const podQuery = {
    attributes: ['podId', 'name', 'type'],
    model: Pod,
    as: 'pod',
  };

  const cellQuery = {
    attributes: ['cellId', 'name', 'type'],
    model: Cell,
    as: 'cell',
  };

  if (type) {
    squadQuery.where = { type: type };
    podQuery.where = { type };
    cellQuery.where = { type };
  }

  if (squadId) squadQuery.where = { squadId: squadId };
  if (podId) podQuery.where = { podId: podId };
  if (cellId) cellQuery.where = { cellId: cellId };

  const query = {
    attributes: userAttributes,
    where,
    limit: pageSize,
    offset: pageOffset,
    include: [
      {
        attributes: roleAttributes,
        model: Role,
        as: 'role',
        where: {
          level: 'agency',
        },
      },
      {
        attributes: ['userId'],
        model: UserGroup,
        as: 'memberId',
        required: isRequired,
        include: [squadQuery, podQuery, cellQuery],
      },
    ],
  };

  if (sortField && sortOrder) {
    if (userAttributes.includes(sortField)) {
      query.order = [[sortField, sortOrder]];
    } else if (roleAttributes.includes(sortField)) {
      query.order = [[Role, sortField, sortOrder]];
    } else if (squadAttributes.includes(sortField)) {
      query.order = [
        [
          { model: UserGroup, as: 'memberId' },
          { model: Squad, as: 'squad' },
          'name',
          sortOrder,
        ],
      ];
    } else if (podAttributes.includes(sortField)) {
      query.order = [
        [
          { model: UserGroup, as: 'memberId' },
          { model: Pod, as: 'pod' },
          'name',
          sortOrder,
        ],
      ];
    } else if (cellAttributes.includes(sortField)) {
      query.order = [
        [
          { model: UserGroup, as: 'memberId' },
          { model: Cell, as: 'cell' },
          ,
          'name',
          sortOrder,
        ],
      ];
    }
  }

  const { count, rows } = await User.findAndCountAll(query);

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
    },
  });
});

// @desc Get all employees filtered by role
// @route GET /api/v1/agency/employees/roles/:role
// @access Private
exports.getEmployeesFilteredByRole = asyncHandler(async (req, res, next) => {
  const { role } = req.params;

  const output = await User.findAll({
    attributes: ['userId', 'firstName', 'lastName'],
    include: {
      attributes: [],
      model: Role,
      as: 'role',
      where: {
        level: 'agency',
        name: role,
      },
    },
  });

  res.status(200).json({
    success: true,
    data: output,
  });
});

// @desc Get all clients for specific employee
// @route GET /api/v1/agency/employees/:userId/clients
// @access Private
exports.getEmployeesDetails = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const roleAttributes = ['name', 'level'];

  const { count, rows, page, pageSize, sortField, sortOrder } =
    await agencyEmployee.getEmployeesClients(userId, req.query);

  const employee = await User.findByPk(userId, {
    include: {
      attributes: roleAttributes,
      model: Role,
      as: 'role',
      where: {
        level: 'agency',
      },
    },
  });

  res.status(200).json({
    success: true,
    data: { count, rows, page, pageSize, sortField, sortOrder, employee },
  });
});

// @desc Invite employee with agency roles
// @route POST /api/v1/agency/employees
// @access Private
exports.addEmployee = asyncHandler(async (req, res, next) => {
  const { email, roleId, userGroup } = req.body;
  validator(req.body, {
    email: 'required|email',
    roleId: 'required',
  });

  let errorMessage = '';

  if (userGroup) {
    const { departmentId, squadId, podId, cellId } = userGroup;

    const groupLevel = await Role.findAll();

    const level = groupLevel.find((el) => el.roleId == roleId);
    const sameGroupWhere = {
      departmentId,
    };
    if (level && level.groupLevel === 'squad') sameGroupWhere.squadId = squadId;
    if (level && level.groupLevel === 'pod') {
      sameGroupWhere.squadId = squadId;
      sameGroupWhere.podId = podId;
    }
    if (level && level.groupLevel === 'cell') {
      sameGroupWhere.squadId = squadId;
      sameGroupWhere.podId = podId;
      sameGroupWhere.cellId = cellId;
    }
    const sameGroup = await UserGroup.count({
      where: sameGroupWhere,
      include: {
        model: User,
        where: {
          roleId,
        },
      },
    });

    if (level.groupLevel && level.allowPerGroup) {
      errorMessage = `Role conflict for this ${level ? level.level : ''}!`;
    }

    if (!level || sameGroup < level.allowPerGroup) {
      errorMessage = '';
    }
  }

  if (!errorMessage) {
    // * Create invite
    await inviteService.createInvite(email, roleId, null, null, userGroup);
  }

  res.status(200).json({
    success: errorMessage ? false : true,
    message: errorMessage ? errorMessage : 'Invite Sent',
  });
});

// @desc Update role of the employee
// @route PUT /api/v1/agency/employees/:userId
// @access Private
exports.updateEmployeeRole = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { roleId, userGroup } = req.body;
  if (roleId === undefined) {
    return next(new ErrorResponse('Please provide a new role', 400));
  }

  let errorMessage = '';

  if (userGroup) {
    const { departmentId, squadId, podId, cellId } = userGroup;

    const groupLevel = await Role.findAll();

    const level = groupLevel.find((el) => el.roleId == roleId);
    const sameGroupWhere = {
      departmentId,
    };

    if (level && level.groupLevel === 'squad') sameGroupWhere.squadId = squadId;
    if (level && level.groupLevel === 'pod') {
      sameGroupWhere.squadId = squadId;
      sameGroupWhere.podId = podId;
    }
    if (level && level.groupLevel === 'cell') {
      sameGroupWhere.squadId = squadId;
      sameGroupWhere.podId = podId;
      sameGroupWhere.cellId = cellId;
    }
    const sameGroup = await UserGroup.count({
      where: sameGroupWhere,
      include: {
        model: User,
        where: {
          roleId,
        },
      },
    });
    errorMessage = `Role conflict for this ${level ? level.level : ''}!`;

    if (!level || sameGroup < level.allowPerGroup || !level.groupLevel) {
      await UserGroup.upsert({ userId, departmentId, squadId, podId, cellId });
      errorMessage = '';
    }
  }
  const [data] =
    errorMessage === ''
      ? await User.update({ roleId }, { where: { userId } })
      : [0];

  res.status(200).json({
    success: data === 1 ? true : false,
    message: errorMessage
      ? errorMessage
      : 'Employee role successfully updated!',
  });
});

// @desc Remove employee from the agency app
// @route DELETE /api/v1/agency/employees/:userId
// @access Private
exports.removeEmployee = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const data = await User.destroy({ where: { userId } });

  res.status(200).json({
    success: data === 1 ? true : false,
  });
});

// @desc Get employee role
// @route GET /api/v1/agency/employees/roles
// @access Private
exports.agencyRoles = asyncHandler(async (req, res, next) => {
  const roles = await Role.findAll({
    attributes: [
      ['roleId', 'value'],
      ['name', 'label'],
      'groupLevel',
      'department',
      'allowPerGroup',
    ],
    where: {
      level: 'agency',
    },
    order: [['seniorityLevel', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: roles,
  });
});

// @desc Get all clients for specific employee
// @route GET /api/v1/agency/employees/clients
// @access Private
exports.getEmployeesClients = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;
  const { search } = req.query;
  const clients = await agencyEmployee.getClients(userId, search);

  res.status(200).json({
    success: true,
    data: clients,
  });
});

// @desc     Get Groups
// @route    GET /api/v1/agency/employees/groups/
// @access   Private
exports.getGroups = asyncHandler(async (req, res, next) => {
  const roleAttributes = ['name', 'level', 'roleId', 'seniorityLevel'];
  const userAttributes = ['firstName', 'lastName', 'email'];
  const { type, squadId } = req.query;
  const includeUsers = (groupLevel) => {
    return {
      model: UserGroup,
      attributes: ['userId'],
      include: {
        model: User,
        attributes: userAttributes,
        required: true,
        include: {
          attributes: roleAttributes,
          model: Role,
          as: 'role',
          where: { groupLevel },
        },
      },
    };
  };

  let squadWhere = { type };
  if (squadId) {
    squadWhere = { ...squadWhere, squadId };
  }

  const data = await Department.findAll({
    attributes: ['name', ['departmentId', 'id']],
    order: [
      [Squad, 'name', 'ASC'],
      [Squad, Pod, 'name', 'ASC'],
      [Squad, Pod, Cell, 'name', 'ASC'],
      [literal(`"Squads->UserGroups->User->role"."seniorityLevel"`), 'ASC'],
      [
        literal(`"Squads->Pods->UserGroups->User->role"."seniorityLevel"`),
        'ASC',
      ],
      [
        literal(
          `"Squads->Pods->Cells->UserGroups->User->role"."seniorityLevel"`
        ),
        'ASC',
      ],
      [literal(`"Squads->Pods->Cells->clients"."client"`), 'ASC'],
    ],
    include: [
      {
        model: Squad,
        attributes: ['name', ['squadId', 'id']],
        where: squadWhere,

        include: [
          includeUsers('squad'),
          {
            model: Pod,
            attributes: ['name', ['podId', 'id']],
            where: { type },
            required: false,
            include: [
              includeUsers('pod'),
              {
                model: Cell,
                attributes: ['name', ['cellId', 'id']],
                where: { type },
                required: false,
                include: [
                  includeUsers('cell'),
                  {
                    model: AgencyClient,
                    as: 'clients',
                    attributes: ['agencyClientId', 'client'],
                    through: { attributes: [] },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc Get all groups by Group type
// @route GET /api/v1/agency/employees/groupsBy
// @access Private
exports.getGroupsByLevel = asyncHandler(async (req, res, next) => {
  const { type } = req.query;

  validator(req.query, {
    type: 'required',
  });

  const squad = await Squad.findAll({
    attributes: [['squadId', 'id'], 'name'],
    where: {
      type,
    },
  });

  const pod = await Pod.findAll({
    attributes: [['podId', 'id'], 'name'],
    where: {
      type,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      squad,
      pod,
    },
  });
});

exports.getGroupsById = asyncHandler(async (req, res, next) => {
  const { group, id } = req.params;
  const { isPpc: isPPC } = req.query;
  const isPpc = isPPC === 'true' ? true : false;

  let data = {};

  if (group === 'squad') {
    data = await Squad.findOne({
      attributes: ['squadId', 'name', 'isPpc'],
      where: {
        isPpc,
      },
      include: {
        attributes: ['podId', 'name', 'isPpc'],
        model: Pod,
        where: {
          isPpc,
        },
      },
    });
  } else if (group === 'pod') {
    data = await Pod.findOne({
      attributes: ['podId', 'name', 'isPpc'],
      where: {
        isPpc,
      },
      include: {
        attributes: ['cellId', 'name', 'isPpc'],
        model: Cell,
        where: {
          isPpc,
        },
      },
    });
  } else if (group === 'department') {
    data = await Department.findOne({
      attributes: ['departmentId', 'name'],
      include: {
        attributes: ['squadId', 'name', 'isPpc'],
        model: Squad,
        where: {
          isPpc,
        },
      },
    });
  }

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc Get all groups Options
// @route GET /api/v1/agency/employees/grouups/options
// @access Private
exports.getGroupsOptions = asyncHandler(async (req, res, next) => {
  const squads = await Squad.findAll({
    attributes: ['squadId', 'name', 'type'],
    order: [
      ['type', 'asc'],
      ['name', 'asc'],
    ],
  });
  const pods = await Pod.findAll({
    attributes: ['podId', 'name', 'type', 'squadId'],
  });
  const cells = await Cell.findAll({
    attributes: ['cellId', 'name', 'type', 'podId'],
  });

  res.status(200).json({
    success: true,
    squads,
    pods,
    cells,
  });
});

// @desc     Get Cell Employees
// @route    GET /api/v1/agency/employees/cell/:cellId/employees
// @access   Private
exports.getCellEmployees = asyncHandler(async (req, res, next) => {
  const { cellId } = req.params;

  const output = await agencyEmployee.getCellEmployees(cellId);

  res.status(200).json({
    success: true,
    data: output,
  });
});

// @desc     Get Pod Employees
// @route    GET /api/v1/agency/employees/pod/:podId/employees
// @access   Private
exports.getPodEmployees = asyncHandler(async (req, res, next) => {
  const { podId } = req.params;

  const output = await agencyEmployee.getPodEmployees(podId);

  res.status(200).json({
    success: true,
    data: output,
  });
});

// @desc     Get Squad Employees
// @route    GET /api/v1/agency/employees/squad/:squadId/employees
// @access   Private
exports.getSquadEmployees = asyncHandler(async (req, res, next) => {
  const { squadId } = req.params;

  const output = await agencyEmployee.getSquadEmployees(squadId);

  res.status(200).json({
    success: true,
    data: output,
  });
});

// @desc     Get All Employees By Group Type - operations, ppc, writing, design
// @route    GET /api/v1/agency/employees/all/cell/:cellId
// @access   Private
exports.getEmployeesByType = asyncHandler(async (req, res, next) => {
  const { type } = req.params;

  const output = await agencyEmployee.getEmployeesByType(type);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get All Employees From Cell to Squad, filtered by cellId
// @route    GET /api/v1/agency/employees/all/:type/:cellId
// @access   Private
exports.getEmployeesFromCellToSquad = asyncHandler(async (req, res, next) => {
  const { type, cellId } = req.params;

  const output = await agencyEmployee.getEmployeesFromCellToSquad(type, cellId);

  res.status(200).json({
    success: true,
    output,
  });
});

/**
 * Get user group params.
 *
 * @param {string} level
 * @param {int} id
 * @returns {object}
 */
exports.getUserGroupParams = async (level, id) => {
  let params = {};

  if (level === 'squad') {
    params.squadId = id;
  }

  if (level === 'pod') {
    const pod = await Pod.findOne({ where: { podId: id } });

    params.podId = id;
    params.squadId = pod.squadId;
  }

  if (level === 'cell') {
    const cell = await Cell.findOne({
      where: { cellId: id },
      include: { model: Pod, as: 'pod' },
    });

    params.cellId = id;
    params.podId = cell.podId;
    params.squadId = cell.pod.squadId;
  }

  return params;
};

// @desc     Update groups and its users
// @route    PUT /api/v1/agency/employees/groups/:level
// @access   Private
exports.updateGroups = asyncHandler(async (req, res, next) => {
  const { name, id, type, rolesData, parentId, child } = req.body;
  const { level } = req.body;

  if (level === 'add squad') {
    const squadMaxId = await Squad.max('squadId');
    await Squad.create({
      name,
      type,
      departmentId: 1,
      squadId: squadMaxId + 1,
    });
  } else {
    const roleIds = rolesData.map((r) => r.value);
    const usersGroup = rolesData.filter((role) => role.userId);

    let addChild = child.filter((c) => c.name.trim() !== '');
    console.log('child', child, addChild);
    const oldUsers = await UserGroup.findAll({
      attributes: ['userId'],
      where: {
        [`${level}Id`]: id,
      },
      raw: true,
      include: [
        {
          model: User,
          where: {
            roleId: {
              [Op.in]: roleIds,
            },
          },
          attributes: [],
        },
      ],
    });

    const oldUsersId = oldUsers.map((el) => el.userId);

    await UserGroup.destroy({
      where: {
        userId: {
          [Op.in]: oldUsersId,
        },
      },
    });

    const defaultUserGroupParams = await this.getUserGroupParams(level, id);

    Promise.all(
      usersGroup.map(async (u) => {
        await UserGroup.upsert({
          userId: u.userId,
          departmentId: 1,
          ...defaultUserGroupParams,
        });
      })
    );
    let props = {
      name,
    };

    // Update Group Name
    if (level === 'squad') {
      // handle squad

      await Squad.update(props, {
        where: {
          squadId: id,
        },
      });

      if (addChild.length > 0) {
        const podMaxId = await Pod.max('podId');
        Promise.all(
          addChild.map(async (el, i) => {
            await Pod.create({
              name: el.name,
              squadId: id,
              type,
              podId: podMaxId + 1 + i,
            });
          })
        );
      }
    } else if (level === 'pod') {
      // handle pod

      if (parentId) {
        props.squadId = parentId;
      }
      await Pod.update(props, {
        where: {
          podId: id,
        },
      });
      if (addChild.length > 0) {
        const cellMaxId = await Cell.max('cellId');
        Promise.all(
          addChild.map(async (el, i) => {
            await Cell.create({
              name: el.name,
              podId: id,
              type,
              cellId: cellMaxId + 1 + i,
            });
          })
        );
      }
    } else {
      //handle cell
      if (parentId) {
        props.podId = parentId;
      }
      await Cell.update(props, {
        where: {
          cellId: id,
        },
      });
    }
  }

  res.status(200).json({
    success: true,
  });
});

// @desc Remove groups from the agency app
// @route DELETE /api/v1/agency/employees/groups/:level/:id
// @access Private
exports.deleteGroups = asyncHandler(async (req, res, next) => {
  const { id, level } = req.params;
  // const data = await User.destroy({ where: { userId } });
  let data = 1;

  if (level === 'squad') {
    // list pods
    const pods = await Pod.findAll({
      attributes: ['podId'],
      where: {
        squadId: id,
      },
      raw: true,
    });

    const podIds = pods.map((el) => el.podId);

    const cells = await Cell.findAll({
      where: {
        podId: {
          [Op.in]: podIds,
        },
      },
    });

    const cellIds = cells.map((el) => el.cellId);

    await UserGroup.destroy({
      where: {
        squadId: id,
      },
    });

    await CellClient.destroy({
      where: {
        cellId: {
          [Op.in]: cellIds,
        },
      },
    });

    await Cell.destroy({
      where: {
        podId: {
          [Op.in]: podIds,
        },
      },
    });

    await Pod.destroy({
      where: {
        squadId: id,
      },
    });

    await Squad.destroy({
      where: {
        squadId: id,
      },
    });
  } else if (level === 'pod') {
    await UserGroup.update(
      {
        podId: null,
        cellId: null,
      },
      {
        where: {
          podId: id,
        },
      }
    );

    const cells = await Cell.findAll({
      where: {
        podId: id,
      },
    });
    const cellIds = cells.map((el) => el.cellId);

    await CellClient.destroy({
      where: {
        cellId: {
          [Op.in]: cellIds,
        },
      },
    });

    await Cell.destroy({
      where: {
        podId: id,
      },
    });

    await Pod.destroy({
      where: {
        podId: id,
      },
    });
  } else if (level === 'cell') {
    await UserGroup.update(
      {
        cellId: null,
      },
      {
        where: {
          cellId: id,
        },
      }
    );

    await CellClient.destroy({
      where: {
        cellId: id,
      },
    });

    await Cell.destroy({
      where: {
        cellId: id,
      },
    });
  }

  res.status(200).json({
    success: data === 1 ? true : false,
  });
});
