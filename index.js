const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6hi0q.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
    res.send("Hello from Server Side");
});

app.listen(port, () => {
    console.log(`Server Side listening on port ${port}`);
});

async function run() {
    try {
        await client.connect();
        const productCollection = client
            .db("database")
            .collection("products");
        const bookingCollection = client.db("database").collection("booking");
        const userCollection = client.db("database").collection("userInfo");
        const reviewCollection = client.db("database").collection("reviews");

        //post product data

        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send({ result, success: true });
        });

      
    } finally {
    }
}
run().catch(console.dir);
