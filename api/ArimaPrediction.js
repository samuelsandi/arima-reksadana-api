const ARIMA = require('arima')

class ArimaPrediction {
    predict(pastPrices, days){
        const arima = new ARIMA({
            p:2,
            d:1,
            q:2,
            verbose: false
        }).train(pastPrices)

        const [prediction] = arima.predict(days)

        return prediction
    }
}

module.exports = ArimaPrediction