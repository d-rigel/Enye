const express = require("express");
const axios = require("axios");
const cors = require("cors");

//creates an express server
const app = express();
//allows cross site origin request
app.use(cors());
//Parses request body as json
app.use(express.json());
//port that this app would be running on
const port = process.env.PORT || 4500;

//endpoint to get the current exchange rate of a currency against other currencies
app.get("/", async (req, res) => {
  //sends a success response
  return res
    .status(200)
    .json({ success: true, message: "Welcome to Rates API" });
});

//endpoint to get the current exchange rate of a currency against other currencies
app.get("/api/rates", async (req, res) => {
  try {
    const { base, currency } = req.query;

    //Validates that base is sent as query param
    if (!base) {
      return res
        .status(400)
        .json(json({ success: false, error: "Base query param is required" }));
    }

    //Validates that currency is sent as query param
    if (!currency) {
      return res
        .status(400)
        .json(
          json({ success: false, error: "Currency query param is required" })
        );
    }

    //makes a request to exchange rate api to get current exchange rates
    const response = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${base.toUpperCase()}&symbols=${currency.toUpperCase()}`
    );

    //checks if rates exist and sends an error message if not
    if (!response.data) {
      return res
        .status(404)
        .json({ success: false, message: "Data Not Found", results: {} });
    }

    //Restructure data gotten from the exchange rate api call
    const data = {
      results: {
        base: response.data.base,
        date: response.data.date,
        rates: response.data.rates,
      },
    };

    //sends a success response
    return res.status(200).json({ success: true, message: "Success", data });
  } catch (err) {
    //gets(destructure) the error message and status from the err object
    const { error } = err.response.data;
    const { status } = err.response;
    return res.status(status).json({ success: false, error, results: {} });
  }
});

app.listen(port, () => {
  return console.log(`App running on port ${port}`);
});
