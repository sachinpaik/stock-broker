import Alpaca from "@alpacahq/alpaca-trade-api";


const alpaca = new Alpaca({
    keyId: process.env.ALPACA_API_KEY,
    secretKey: process.env.ALPACA_SECRET_KEY,
    paper: true,
})


export const getOrders = async (req, res) => {
    alpaca.getOrders({
        status: 'all'
    }).then((orders) => {
        res.status(200).send(orders)
    }).catch((err) => {
        console.log(err)
        res.status(500).send(err);
    })
}


export const placeOrder = async (req, res) => {
        const order = {
        symbol: req.body.symbol,
        qty: Number(req.body.qty),
        side: req.body.side,
        type: "market",
        time_in_force: "day"
    }
    alpaca.createOrder(order).then((order) => {
        res.status(200).send(order)
    }).catch((err) => {
        console.log(err)
        res.status(500).send(err);
    })
}


export const cancelOrder = async (req, res) => {
    const orderId  = req.params.orderId;
    console.log(orderId)
    alpaca.cancelOrder(orderId).then((order) => {
        res.status(200).send({"message":`Order ${orderId} Cancelled Successfully `})
    }).catch((err) => {
        //console.log(err)
        res.status(500).send(err);
    })
}