const logger = (req, res, next) => {
  const start = Date.now();
  
  // This runs when the response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next(); // Tell Express to move to the next function
};

module.exports = logger;