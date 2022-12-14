// DB Models
const User = require(`../models/User`);

// utils
const errorHandler = require(`../utils/errorHandler`);
const responser = require('../utils/responser');

// Mails
const signUpMail = require('../utils/emails/messages/signup');
const resetMail = require('../utils/emails/messages/mail');
const sendMail = require('../utils/emails/mailSender');
// NPM
const bcrypt = require(`bcrypt`);
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const emailExistsResult = await User.findOne({ where: { email } });
    if (emailExistsResult)
      return errorHandler(next, null, 'User already exists.', 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const emailToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      process.env.EMAIL_TOKEN,
      { expiresIn: `1h` }
    );

    // Send or log the mail
    if (process.env.NODE_ENV == 'production')
      sendMail(email, emailToken, 'Account verfication', signUpMail);
    else console.log(`${process.env.localURI}/confirm/${emailToken}`);

    responser(res, 201, 'User created succesfully.', {
      user: { name: user.name, id: user.id, isAdmin: user.isAdmin },
    });
  } catch (err) {
    errorHandler(next, err, 'Error while registering.');
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } }, { logging: true });
    if (!user) return errorHandler(next, null, 'User not found.', 400);

    if (!user.active)
      return errorHandler(next, null, 'User is not active.', 400);
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch)
      return errorHandler(next, null, 'Password incorrect.', 400);

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      process.env.TOKEN,
      { expiresIn: `7d` }
    );

    responser(res, 200, 'User signed in succesfully.', {
      user: { name: user.name, id: user.id, isAdmin: user.isAdmin },
      token: `Bearer ${token}`,
    });
  } catch (err) {
    errorHandler(next, err, 'Error while signing in.');
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const { token } = req.params;
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.EMAIL_TOKEN);
    } catch {
      errorHandler(next, null, 'Error while verifying your token.');
    }
    const user = await User.findByPk(decodedToken.id);
    if (!user) return errorHandler(next, null, 'User not found.', 400);

    if (user.active)
      return errorHandler(
        next,
        null,
        'User already activated his account.',
        400
      );
    user.active = true;
    await user.save();

    responser(res, 200, 'User confirmed succesfully.', {
      user: { name: user.name, id: user.id, isAdmin: user.isAdmin },
    });
  } catch (err) {
    errorHandler(next, err, 'Error while signing in.');
  }
};

exports.sendReset = async (req, res, next) => {
  try {
    const id = req.user.id;
    let user = await User.findByPk(id);
    if (!user) errorHandler(next, null, 'User not found.', 400);

    const emailToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      process.env.EMAIL_TOKEN,
      { expiresIn: `1h` }
    );

    // Send or log the mail
    if (process.env.NODE_ENV == 'production')
      sendMail(user.email, emailToken, 'Change Password', resetMail);
    else console.log(`${process.env.localURI}/reset/${emailToken}`);

    responser(res, 201, 'Reset message sent to the email.', {
      user: { name: user.name, id: user.id },
    });
  } catch (err) {
    errorHandler(next, err, 'Error');
  }
};

exports.getReset = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { oldPassword, newPassword } = req.body;
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.EMAIL_TOKEN);
    } catch {
      errorHandler(next, null, 'Error while verifying your token.');
    }
    const user = await User.findByPk(decodedToken.id);
    if (!user) return errorHandler(next, null, 'User not found.', 400);

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch)
      return errorHandler(next, null, 'Password incorrect.', 400);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    responser(res, 200, 'Password changed succesfully.', {
      user: { name: user.name, id: user.id, isAdmin: user.isAdmin },
    });
  } catch (err) {
    errorHandler(next, err, 'Error while signing in.');
  }
};
