// api/health.js
// Health check endpoint for Vercel

module.exports = async (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        service: 'Discord Bot Form API',
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL_ENV || 'development'
    });
};
