class PredictionStrategy {

    constructor(){
        this._model = null
    }

    set model(model){
        this._model = model
    }

    get model(){
        return this._model
    }

    predict(bibitPrices){

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
        
        const pred = this._model.predict(prices)

        for(var i = 0; i < pred.length; i++) {
            var nextDate = new Date(lastDate)
            nextDate.setDate(lastDate.getDate() + 1)
            predictionAndDates.push({price:pred[i], date:nextDate.toISOString().slice(0,10)})
            lastDate = nextDate
        }

        return {pastPrices:pricesAndDates, predictionPrices:predictionAndDates}
    }
}

module.exports = PredictionStrategy