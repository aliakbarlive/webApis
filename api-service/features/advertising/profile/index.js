const profileRoute = require('./profile.route');
const profileService = require('./profile.service');
const profileValidation = require('./profile.validation');
const profileController = require('./profile.controller');
const ProfileRepository = require('./profile.repository');

module.exports = {
  profileRoute,
  profileService,
  profileValidation,
  profileController,
  ProfileRepository,
};
