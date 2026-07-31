function notFound(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err?.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }

  if (err?.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      details: Object.values(err.errors).map((item) => item.message)
    });
  }

  return res.status(500).json({
    message: 'Internal server error'
  });
}

module.exports = { notFound, errorHandler };
