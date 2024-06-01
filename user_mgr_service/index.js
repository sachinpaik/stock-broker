import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/user.routes.js";
const app = express();
dotenv.config();
app.use(cors({origin: "*", credentials: true, allowedHeaders: "*"}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("User Manager Service is up and running");
})

app.use("/users", router);

const port = process.env.PORT || 4001;
console.log("port", port);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});