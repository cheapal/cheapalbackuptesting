export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
  
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate key error',
        key: err.keyValue
      });
    }
  
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  };