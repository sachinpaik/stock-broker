import {Client} from "@opensearch-project/opensearch"
import Alpaca from "@alpacahq/alpaca-trade-api";

export const loadStocksData = async (req, res) => {
    try {
        console.log("Loading stocks data")
        const alpaca = new Alpaca({
            keyId: process.env.ALPACA_API_KEY,
            secretKey: process.env.ALPACA_SECRET_KEY,
            paper: true // or false if you want to use the live API
        });
        const assets = await alpaca.getAssets({
            status: 'active',
            asset_class: 'us_equity'
        });

        const client = new Client({
            node: process.env.OS_URL,
        });
        let index_name = "all_stocks"
        for(let asset of assets) {
            let stock_data ={
                "symbol": asset.symbol,
                "name": asset.name,
                "exchange": asset.exchange,
                "asset_class": asset.asset_class,

            }
            let response = await client.index({
               index: index_name,
                body: stock_data,
                refresh: false,
            });
           console.log(response)
        }
        console.log("Stocks data loaded successfully")
        res.status(200).json("Stocks data loaded successfully");
    }
    catch (err) {
        console.log(err)
        res.status(500).json("Failed to load stocks data")
    }

}

