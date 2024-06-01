import serverless from 'serverless-http';
import express from 'express';
import dotenv from 'dotenv';
import {Client} from '@opensearch-project/opensearch';

dotenv.config();
const app = express();

const client = new Client({
    node: process.env.STOCK_SEARCH_URL,
});
let index_name = "all_stocks"

app.get('/search', async (req, res) => {
        try {
            console.log("Searching for stocks")
            const searchTerm = req.query.q || '';
            let query = {
                query: {
                    match: {
                        name: {
                            query: req.query.q,
                            fuzziness: "AUTO",
                        },
                    },
                },
            };
            let response = await client.search({
                index: index_name,
                body: query,
            });
            console.log(response.body.hits.hits)
            res.status(200).json(response.body.hits.hits);
        } catch (err) {
            console.log(err)
            res.status(500).json("Failed to search stocks")
        }


    }
);

app.get('/', async (req, res) => {
    res.json({message: "Lambda Search Service"});
});


export const handler = serverless(app);
