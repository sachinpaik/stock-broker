import Alpaca from "@alpacahq/alpaca-trade-api";


const alpaca = new Alpaca({
    keyId: process.env.ALPACA_API_KEY,
    secretKey: process.env.ALPACA_SECRET_KEY,
    paper: true,
})


export const getFunds = async (req, res) => {
    //get the available fund information from the alpaca api
    // the response will look like this
    // {
    //     "account_blocked": false,
    //     "account_number": "010203ABCD",
    //     "buying_power": "262113.632",
    //     "cash": "-23140.2",
    //     "created_at": "2019-06-12T22:47:07.99658Z",
    //     "currency": "USD",
    //     "crypto_status": "ACTIVE",
    //     "non_marginable_buying_power": "7386.56",
    //     "accrued_fees": "0",
    //     "pending_transfer_in": "0",
    //     "pending_transfer_out": "0",
    //     "daytrade_count": "0",
    //     "daytrading_buying_power": "262113.632",
    //     "equity": "103820.56",
    //     "id": "e6fe16f3-64a4-4921-8928-cadf02f92f98",
    //     "initial_margin": "63480.38",
    //     "last_equity": "103529.24",
    //     "last_maintenance_margin": "38000.832",
    //     "long_market_value": "126960.76",
    //     "maintenance_margin": "38088.228",
    //     "multiplier": "4",
    //     "pattern_day_trader": false,
    //     "portfolio_value": "103820.56",
    //     "regt_buying_power": "80680.36",
    //     "short_market_value": "0",
    //     "shorting_enabled": true,
    //     "sma": "0",
    //     "status": "ACTIVE",
    //     "trade_suspended_by_user": false,
    //     "trading_blocked": false,
    //     "transfers_blocked": false
    // }
    // only return the fund and margin information that is needed
    alpaca.getAccount().then((account) => {
            res.status(200).send({
                equity: account.equity,
                cash: account.cash,
                buying_power: account.buying_power,
                long_market_value: account.long_market_value,
                short_market_value: account.short_market_value,
                portfolio_value: account.portfolio_value,
                margin: account.initial_margin,
                maintenance_margin: account.maintenance_margin,
                daytrade_buying_power: account.daytrading_buying_power,


            })
        }
    ).catch((err) => {
        console.log(err)
        res.status(500).send(err);
    })
}