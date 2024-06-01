// import Alpaca from "@alpacahq/alpaca-trade-api";
//
// class DataStream {
//     constructor({ apiKey, secretKey, feed }) {
//         this.alpaca = new Alpaca({
//             keyId: process.env.ALPACA_API_KEY,
//             secretKey: process.env.ALPACA_SECRET_KEY,
//             paper: true,
//             feed: feed
//
//         });
//
//         const socket = this.alpaca.data_stream_v2;
//
//         socket.onConnect(function () {
//             console.log("Connected");
//             socket.subscribeForDailyBars(["AAPL"]);
//             // socket.subscribeForTrades(["FB"]);
//             //socket.subscribeForBars( ["AAPL"]);
//             // socket.subscribeForStatuses(["*"]);
//             // socket.subscribeForStatuses(["*"]);
//         });
//
//         socket.onError((err) => {
//             console.log(err);
//         });
//
//         socket.onStockTrade((trade) => {
//             console.log("Trade")
//             console.log(trade);
//         });
//
//         socket.onStockQuote((quote) => {
//             console.log("Quote");
//             console.log(quote);
//         });
//
//         socket.onStockBar((bar) => {
//             console.log("Bar");
//         });
//
//         socket.onStockDailyBar((bar) => {
//             console.log(bar);
//         });
//
//         socket.onStatuses((s) => {
//             console.log(s);
//         });
//
//
//
//         socket.onStateChange((state) => {
//             console.log(state);
//         });
//
//
//         socket.onDisconnect(() => {
//             console.log("Disconnected");
//         });
//
//         socket.connect();
//
//         // unsubscribe from FB after a second
//         // setTimeout(() => {
//         //     socket.unsubscribeFromBars(["SPY"]);
//         //     //socket.disconnect();
//         // }, 1000);
//     }
// }
//
// export default DataStream;

import {WebSocket} from 'ws'
class DataStream {
    constructor({ apiKey, secretKey, feed }) {
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

// Connection opened -> Subscribe
        socket.addEventListener('open', function (event) {
            socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
            socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
            socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
        });

// Listen for messages
        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
        });

// Unsubscribe
        var unsubscribe = function(symbol) {
            socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
        }

    }
}

export default DataStream;