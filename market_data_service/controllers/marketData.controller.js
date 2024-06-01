import DataStream from "../marketDataAPI/getMarketDataWS.js";


const getMarketData = async (req, res) => {

    let stream = new DataStream({
        feed: "iex",
        paper: true
    });
    res.send("Market data is here")
}

export default getMarketData;