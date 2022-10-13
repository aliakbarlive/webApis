const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');

// @desc     Drop all database tables
// @route    DELETE /api/v1/postgres
// @access   PRIVATE
exports.deletePostgres = asyncHandler(async (req, res, next) => {
  await sequelize.query(`DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
    EXECUTE 'DROP TABLE ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;`);

  res.status(200).json({
    success: true,
    code: 200,
    data: 'Successfuly dropped database tables.',
  });
});
