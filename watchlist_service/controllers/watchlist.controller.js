import watchlistModel from "../model/watchlist.model.js";


export const getWatchList = async (req, res) => {
    try {
        const existingWatchList = await watchlistModel.find();
        res.status(200).json(existingWatchList);
    } catch (error) {
        console.log('Error reading watchlist : ', error)
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export const addWatchList = async (req, res) => {
    try {
        const {title} = req.body;
        if (!title) {
            return res.status(400).json({error: "Title is required to create a watchlist"});
        } else {
            const newWatchlist = {
                title: title,
                stocks: []
            };
            const updatedWatchList = await watchlistModel.findOneAndUpdate({title: title}, newWatchlist, {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            })
            res.status(200).json(updatedWatchList);
        }

    } catch (error) {
        console.log('Error adding watchlist : ', error)
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export const updateWatchList = async (req, res) => {
    try {
        const {newTitle,title} = req.body;
        if (!title) {
            return res.status(400).json({error: "Title is required to create a watchlist"});
        } else {
            const currentWatchList = await watchlistModel.findOne({title: title})
            currentWatchList.title = newTitle;
            const updateWatchList = await watchlistModel.findOneAndUpdate({title: title}, {title: newTitle}, {
                upsert: true,
                setDefaultsOnInsert: true
            })
            const updatedWatchList = await watchlistModel.findOne({_id: updateWatchList._id})
            res.status(200).json(updatedWatchList);
        }

    } catch (error) {
        console.log('Error updating watchlist : ', error)
        res.status(500).json({error: 'Internal Server Error'});
    }
}


export const addStockToWatchList = async (req, res) => {
    try {
        const {watchlist, stock} = req.body;
        if (!watchlist) {
            return res.status(400).json({error: "Watchlist is required to add a stock"});
        } else if (!stock) {
            return res.status(400).json({error: "Stock is required to add to the watchlist"});
        } else {

            const existingWatchlist = await watchlistModel.findOne({title: watchlist});
            if (!existingWatchlist) {
                return res.status(404).json({error: "Watchlist not found"});
            } else {
                existingWatchlist.stocks.push(stock);
                const updatedWatchList = await existingWatchlist.save();
                res.status(200).json(updatedWatchList);
            }
        }
    } catch (error) {
        console.log('Error updating watchlist : ', error)
        res.status(500).json({error: 'Internal Server Error'});
    }
}


export const deleteWatchList = async (req, res) => {
    try {
        const {watchlist} = req.body;
        if (!watchlist) {
            return res.status(400).json({error: "Watchlist is required to delete"});
        } else {
            const existingWatchlist = await watchlistModel.findOneAndDelete({title: watchlist});
            if (!existingWatchlist) {
                return res.status(404).json({error: "Watchlist not found"});
            }
            res.status(200).json(existingWatchlist);
        }
    } catch (error) {
        console.log('Error deleting watchlist : ', error)
        res.status(500).json({error: 'Internal Server Error'});
    }
}


export const deleteStockFromWatchList = async (req, res) => {
    try {
        const {watchlist, stock} = req.body;
        if (!watchlist) {
            return res.status(400).json({error: "Watchlist is required to delete a stock"});
        } else if (!stock) {
            return res.status(400).json({error: "Stock is required to delete from the watchlist"});
        } else {
            const existingWatchlist = await watchlistModel.findOne({title: watchlist});
            if (!existingWatchlist) {
                return res.status(404).json({error: "Watchlist not found"});
            }
            existingWatchlist.stocks.pull(stock);
            const updatedWatchList = await existingWatchlist.save();
            res.status(200).json(updatedWatchList);
        }
    } catch (error) {
        console.log('Error updating watchlist : ', error)
        res.status(500).json({error: 'Internal Server Error'});
    }
}