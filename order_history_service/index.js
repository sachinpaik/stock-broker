import {graphql, buildSchema} from "graphql";
import {mockCompanyInfo, mockHistoricalData, mockStockPrices, mockUserPortfolios} from "./mockData.js";
import express from "express";
import {  createHandler} from 'graphql-http/lib/use/express';
import {ruruHTML} from "ruru/server";
import cors from "cors";
const schema = buildSchema(`
    type StockPrice {
      symbol: String!,
      price: Float!,
      timestamp: String!
      }
    type HistoricalData {
        date: String!,
        open: Float!,
        high: Float!,
        low: Float!,
        close: Float!,
        volume: Int!
    }
    type CompanyInfo {
        name: String!,
        sector: String!,
        CEO: String!,
        headquarters: String!,
        description: String!
    }
    type Holdings {
        symbol: String!,
        quantity: Int!,
        averagePrice: Float!
    }
    type UserPortfolio {
        holdings: [Holdings]!,
        cashBalance: Float!,
        totalValue: Float!
    }
    type Query {
        stockPrice(symbol: String!): StockPrice
        historicalData(symbol: String!,startDate: String!,endDate:String!): [HistoricalData!]!
        companyInfo(symbol: String!): CompanyInfo
        userPortfolio(userId: String!): UserPortfolio
    }
`);

// Define the resolvers

const root = {
    stockPrice: ({symbol}) => mockStockPrices[symbol],
    historicalData: ({
                         symbol,
                         startDate,
                         endDate
                     }) => mockHistoricalData[symbol].filter(entry => entry.date >= startDate && entry.date <= endDate),
    companyInfo: ({symbol}) => {
        console.log(symbol);
        return mockCompanyInfo[symbol]
    },
    userPortfolio: ({userId}) => mockUserPortfolios[userId]
};

const app = express();
app.use(cors({origin: "*", credentials: true, allowedHeaders: "*"}));
app.all('/graphql', createHandler({
    schema: schema,
    rootValue: root,

}));
app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
})


const port = 4001;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});