const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = codes.UNAUTHORIZED;
    return next(error);
    // return next();
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN);
  } catch (err) {
    const error = new Error("Can't verify your token.");
    error.statusCode = 401;
    error.err = err;
    return next(error);
  }
  if (!decodedToken) {
    const error = new Error('Not authorized.');
    error.statusCode = 401;
    return next(error);
  }
  let user = {
    id: decodedToken.id,
    isAdmin: decodedToken.isAdmin,
  };
  req.user = user;
  next();
};
