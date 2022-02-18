const priceRequester = require('./PriceRequester.js')
const predictionStrategy = require('./PredictionStrategy.js')
const arimaPrediction = require('./ArimaPrediction.js')

module.exports = async (req, res) => {
  try {

    // Request Price Data from Bibit
    const pr = new priceRequester(req.query.rd)
    const bibitPrices = await pr.getPrices()

    // Calculate Prediction Values
    const pm = new predictionStrategy()
    pm.model = new arimaPrediction()
    retVal = pm.predict(bibitPrices, req.query.days)

    return res.json(retVal)
    
  } catch (error) {
    const status = error.name === 'ValidationError' ? 422 : 500

    return res.status(status).json({ error: error.message })
  }
}