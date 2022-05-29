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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden access" });
        }
        req.decoded = decoded;
        next();
    });
}


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
        //get product data
        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        //get one item data
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);

            res.send(result);
        });

        //booking post
        app.post("/booking", async (req, res) => {
            const newProduct = req.body;
            const result = await bookingCollection.insertOne(newProduct);
            res.send(result);
        });

        //delete specific booking items
        app.delete("/booking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        });

        //get all booking result
        app.get("/bookings", async (req, res) => {
            const booking = await bookingCollection.find().toArray();
            res.send(booking);
        });

      
    } finally {
    }
}
run().catch(console.dir);
