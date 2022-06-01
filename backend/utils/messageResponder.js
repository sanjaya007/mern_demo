const errorResponder = (res, error, status = 401) => {
  return res.status(status).json({ success: false, error: error });
};

module.exports = errorResponder;
