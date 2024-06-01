import express from 'express';
import dotenv from "dotenv"
import Alpaca from "@alpacahq/alpaca-trade-api";
import cors from "cors";
import router from "./routes/stock.routes.js";
import marketRouter from "./routes/marketData.route.js";


dotenv.config();
const app = express();
const port = 4000;
app.use(cors({origin: '*'}));

const alpaca = new Alpaca({
    keyId: process.env.ALPACA_API_KEY,
    secretKey: process.env.ALPACA_SECRET_KEY,
    paper: true,
})


app.get('/', async (req, res) => {
    res.json({message: "HHLD Stock Broker Order Executioner Service"});
});

app.use('/stocks',router)
app.use('/marketData', marketRouter)

app.get('/getAccountData', (req, res) => {
    alpaca.getAccount().then((account) => {
        console.log('Current Account:', account);
        res.json({message: account});
    })

});


app.get("/getOHLCData", (req, res) => {
    console.log("Getting OHLC route");
    const symbol = req.query.symbol;
    console.log("Symbol: ", symbol);
    getMarketQuoteOHLC(symbol, (err, data) => {
        if (err) {
            res.status(500).json("failed to get data")
        } else {
            res.status(200).json(data.value)
        }
    });
});


const getMarketQuoteOHLC = (symbol, callback) => {
        const bars = alpaca.getBarsV2(symbol, {
            timeframe: '1Day'
        }).next().then((data) => {
            console.log(data);
            callback(null, data);
        }).catch((err) => {
            console.log(err);
            callback(err, null);
        });
    }
;

app.get("/getHistoricalOHLCData", (req, res) => {
    console.log("Getting Historical OHLC route");
    const symbol = req.query.symbol;
    console.log("Symbol: ", symbol);
    let data = getMarketHistoricOHLC(symbol).then(
        (data) => {
            res.status(200).json(data);
        }
    ).catch((err) => {
        res.status(500).json("failed to get data")
    });
});

const getMarketHistoricOHLC = async (symbol) => {
    try {
        const bars = alpaca.getBarsV2(symbol, {
            timeframe: '1min',
            start: "2024-04-12",
            end: "2024-04-13",
            limit: 1000,
        })
        const data = [];

        for await (let bar of bars) {
            data.push(bar);
        }
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
};






app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
})