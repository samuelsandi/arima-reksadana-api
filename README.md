# ARIMA Reksadana API

This is the back-end part of the Android app Prediksi-Reksadana-ARIMA, but can also be used for other purposes. The real-time data source is from Bibit API. This API provides decrypted version of the Bibit API data and is able to give prediction of mutual fund prices using ARIMA model (although there is no guarantee about the accuracy nor precision of the prediction value). This API is already running on this endpoint:

https://arima-reksadana-api.vercel.app/api

There are two HTTP get parameters that can be used to customize the output: "rd" and "days". The parameter "rd" can be used to specify which mutual fund product needed (as long as the price data are available on Bibit API), meanwhile the parameter "days" can be used to specify the number of prediction day. For example, the request below will provide price data of mutual fund with the code RD13 and the prediction values for 5 days.

https://arima-reksadana-api.vercel.app/api?rd=RD13&days=5
