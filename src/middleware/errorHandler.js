const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      details: err.details || err.message,
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

module.exports = errorHandler;
