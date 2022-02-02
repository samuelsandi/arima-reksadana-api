const priceRequester = require('./PriceRequester.js')
const arimaPrediction = require('./ArimaPrediction.js')

module.exports = async (req, res) => {
  try {

    // Request Price Data from Bibit
    const pr = new priceRequester(req.query.rd)
    const bibitPrices = await pr.getPrices()

    //PredStrat
    var lastDate
    var prices = []
    var pricesAndDates = []
    var predictionAndDates = []

    for(var i = 0; i < bibitPrices.chart.length; i++) {
        prices.push(bibitPrices.chart[i].value)
        pricesAndDates.push({
            price:bibitPrices.chart[i].value, 
            date:bibitPrices.chart[i].formated_date})
        if (i==bibitPrices.chart.length-1){
            lastDate = new Date(bibitPrices.chart[i].formated_date)
            }
    }
    
    const ap = new arimaPrediction()
    const pred = ap.predict(prices)

    for(var i = 0; i < pred.length; i++) {
        var nextDate = new Date(lastDate)
        nextDate.setDate(lastDate.getDate() + 1)
        predictionAndDates.push({price:pred[i], date:nextDate.toISOString().slice(0,10)})
        lastDate = nextDate
    }

    retVal = {pastPrices:pricesAndDates, predictionPrices:predictionAndDates}

    return res.json(retVal)
    
  } catch (error) {
    const status = error.name === 'ValidationError' ? 422 : 500

    return res.status(status).json({ error: error.message })
  }
}