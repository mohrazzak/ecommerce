const express = require(`express`);
const {
  register,
  login,
  confirm,
  sendReset,
  getReset,
} = require(`../controllers/user`);
const isAuth = require('../middlewares/auth/auth');

const router = express.Router();

// Simple Register
router.post(`/register`, register);

// Simple Login
router.post(`/login`, login);

// Confirm by message to your email
router.post(`/confirm/:token`, confirm);

// send email to reset
router.post(`/reset`, isAuth, sendReset);

// handle the reset link
router.post(`/reset/:token`, getReset);

module.exports = router;
