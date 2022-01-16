const axios = require('axios')
const CryptoJS = require('crypto-js')
const ARIMA = require('arima')

module.exports = async (req, res) => {
  try {
    const data = await getData(req.query)
    
    var prices = []
    var pricesAndDates = []
    var predictionAndDates = []
    var lastDate

    for(var i = 0; i < data.chart.length; i++) {
      prices.push(data.chart[i].value)
      pricesAndDates.push({value:data.chart[i].value, date:data.chart[i].formated_date})
      if (i==data.chart.length-1){
        lastDate = new Date(data.chart[i].formated_date)
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
      var nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);
      predictionAndDates.push({value:prices[i], date:nextDate.toISOString().slice(0,10)})
      lastDate = nextDate
    }

    return res.json({pric:pricesAndDates,pred:predictionAndDates})
  } catch (error) {
    const status = error.name === 'ValidationError' ? 422 : 500

    return res.status(status).json({ error: error.message })
  }
}

const getData = async (params = {}) => {

  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://api.bibit.id/products/RD13/chart?period=1M',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        Origin: 'https://app.bibit.id',
        Referer: 'https://app.bibit.id/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0',
      },
      params: params,
    })

    return decryptData(response.data.data)
  } catch (error) {
    const message = error.response ? error.response.data.message : error.message

    throw new Error(message)
  }
};

const decryptData = data => {
  const iv = CryptoJS.enc.Hex.parse(data.slice(0, 32))
  const encryptedData = data.slice(32, -32)
  const secret = CryptoJS.enc.Utf8.parse(data.slice(-32))

  const bytes = CryptoJS.AES.decrypt(encryptedData, secret, {
    iv,
    mode: CryptoJS.mode.CBC,
    format: CryptoJS.format.Hex,
  });

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}