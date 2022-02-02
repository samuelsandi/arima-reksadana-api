const ARIMA = require('arima')
const PR = require('./PriceRequester.js')

module.exports = async (req, res) => {
  try {
    const pr = new PR(req.query.rd)
    const decryptedPrices = await pr.getData()
    

    var prices = []
    var pricesAndDates = []
    var predictionAndDates = []
    var lastDate

    for(var i = 0; i < decryptedPrices.chart.length; i++) {
      prices.push(decryptedPrices.chart[i].value)
      pricesAndDates.push({price:decryptedPrices.chart[i].value, date:decryptedPrices.chart[i].formated_date})
      if (i==decryptedPrices.chart.length-1){
        lastDate = new Date(decryptedPrices.chart[i].formated_date)
      }
    }
    
    const arima = new ARIMA({
      p:2,
      d:1,
      q:2,
      verbose: false
    }).train(prices)

    const [pred,errors] = arima.predict(5)

    for(var i = 0; i < pred.length; i++) {
      var nextDate = new Date(lastDate)
      nextDate.setDate(lastDate.getDate() + 1)
      predictionAndDates.push({price:pred[i], date:nextDate.toISOString().slice(0,10)})
      lastDate = nextDate
    }

    return res.json({pastPrices:pricesAndDates,predictionPrices:predictionAndDates})
  } catch (error) {
    const status = error.name === 'ValidationError' ? 422 : 500

    return res.status(status).json({ error: error.message })
  }
}