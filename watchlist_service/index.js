import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import router from "./routes/watchlist.routes.js";
const app = express();
dotenv.config();
app.use(cors({origin: "*", credentials: true, allowedHeaders: "*"}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Watchlist Service is up and running");
})

app.use("/watchlists", router);

const port = process.env.PORT || 4001;
console.log("port", port);
app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is running at http://localhost:${port}`);
});