const priceRequester = require('./PriceRequester.js')
const predictionModel = require('./PredictionModel.js')
const arimaModel = require('./ArimaModel.js')

module.exports = async (req, res) => {
  try {
    const pr = new priceRequester(req.query.rd)
    const bibitPrices = await pr.getPrices()

    const pm = new predictionModel()
    pm.model = new arimaModel()

    retVal = pm.predict(bibitPrices)

    return res.json(retVal)
  } catch (error) {
    const status = error.name === 'ValidationError' ? 422 : 500

    return res.status(status).json({ error: error.message })
  }
}