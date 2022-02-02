const ARIMA = require('arima')

class ArimaModel {

    constructor(){

    }

    predict(pastPrices){
        const arima = new ARIMA({
            p:2,
            d:1,
            q:2,
            verbose: false
        }).train(pastPrices)

        const [prediction] = arima.predict(5)

        return prediction
    }
}

module.exports = ArimaModel