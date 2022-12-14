module.exports = (next, err, msg = 'Error occurred', code = 500) => {
  const error = new Error(msg);
  err && (error.err = err);
  error.statusCode = code;
  return next(error);
};
