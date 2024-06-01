import mongoose, {Schema} from "mongoose";


const WatchListSchema = new Schema({
   title: {
       type: String,
       unique: true
   },
    stocks: [
        {
            type: String
        }
    ]
});

const WatchListModel = mongoose.model('watchlist',WatchListSchema);
export default WatchListModel;