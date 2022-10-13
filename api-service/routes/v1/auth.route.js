const express = require('express');
const validate = require('../../middleware/validate');
const { protect, account } = require('../../middleware/auth.js');
const authValidation = require('../../validations/auth');
const authController = require('../../controllers/auth');

const router = express.Router();

// Refactored
router.post(
  '/login',
  validate(authValidation.loginWithEmailAndPassword),
  authController.loginWithEmailAndPassword
);
router.post(
  '/register',
  validate(authValidation.registerWithEmailAndPassword),
  authController.registerWithEmailAndPassword
);

router.post(
  '/register/:inviteToken',
  validate(authValidation.registerWithInviteToken),
  authController.registerWithInviteToken
);

router.get(
  '/verify-email',
  protect,
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

// Unrefactored
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.put(
  '/reset-password/:resetToken',
  validate(authValidation.resetPassword),
  authController.resetPassword
);
router.post('/register/prefill', authController.getRegistrationInvite);
router.get('/me', protect, authController.getMe);
router.put('/me', protect, authController.updateProfile);
router.put('/me/password', protect, authController.changePassword);
router.patch('/you/password', protect, authController.changeUserPassword);
router.get(
  '/me/agency-subscription',
  protect,
  authController.getMyAgencySubscription
);
router.post(
  '/me/agency-subscription',
  protect,
  authController.hasAgencySubscription
);
router.get('/me/roles', protect, authController.getRoles);

router.get(
  '/verify-email/resend',
  protect,
  authController.resendEmailVerification
);
router.post(
  '/selling-partner-api/callback',
  protect,
  account,
  authController.authorizeSPAPI
);
router.post(
  '/advertising-api/callback',
  protect,
  account,
  authController.authorizeAdvAPI
);

module.exports = router;
