const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Log based on status code
    if (res.statusCode >= 400) {
      console.error('❌ Request Error:', logData);
    } else if (res.statusCode >= 300) {
      console.warn('⚠️  Request Redirect:', logData);
    } else {
      console.log('✅ Request Success:', logData);
    }
  });
  
  next();
};

module.exports = { requestLogger };
