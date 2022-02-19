const ARIMA = require('arima')

class ArimaPrediction {
    predict(pastPrices, days){
        const arima = new ARIMA({
            d:1,
            verbose: false
        }).train(pastPrices)

        const [prediction] = arima.predict(days)

        return prediction
    }
}

module.exports = ArimaPrediction