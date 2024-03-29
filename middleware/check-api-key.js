function checkApiKey(req, res, next) {
    const apiKey = req.get('X-API-KEY')
    if (apiKey === process.env.API_KEY) {
        next()
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
}

module.exports = checkApiKey
