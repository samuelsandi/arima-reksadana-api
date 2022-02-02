const CryptoJS = require('crypto-js')
const axios = require('axios')

class PriceRequester {

    constructor(rdCode){
        this.code = rdCode
    }

    decryptPrices(responsePrices) {
        const key = CryptoJS.enc.Utf8.parse(responsePrices.slice(-32))
        const encryptedPrices = responsePrices.slice(32, -32)
        const iv = CryptoJS.enc.Hex.parse(responsePrices.slice(0, 32))

        const decryptedPrices = CryptoJS.AES.decrypt(encryptedPrices, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            format: CryptoJS.format.Hex,
        }).toString(CryptoJS.enc.Utf8)

        return JSON.parse(decryptedPrices)
    }
    
    async getData() {

        if (this.code.length == 0){
          code = "RD68"
        }
        try {
          const response = await axios.request({
            method: 'GET',
            url: 'https://api.bibit.id/products/'+this.code+'/chart?period=1M',
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            Origin: 'https://app.bibit.id',
            Referer: 'https://app.bibit.id/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0',
            },
            params: {},
          })
          return this.decryptPrices(response.data.data)
        } catch (error) {
          const message = error.response ? error.response.data.message : error.message
          throw new Error(message)
        }
    }
}

module.exports = PriceRequester