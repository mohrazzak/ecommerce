module.exports = async (
  res,
  code = 200,
  message = 'Operation done succesfully.',
  data = null
) => {
  res.status(code).json({
    message,
    data,
  });
};
