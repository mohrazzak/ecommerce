module.exports = (error, req, res, next) => {
  // console.error(`Error: ${error.message}`);
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message, error: error.err });
};
