const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uhbaknf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// connect with database
const dbConnect = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
  }
};
dbConnect();

// collection
const brandCollection = client.db("usedLaptop").collection("category");
const bookingCollection = client.db("usedLaptop").collection("booking");
const userCollection = client.db("usedLaptop").collection("users");
const productCollection = client.db("usedLaptop").collection("products");
const advertiseCollection = client.db("usedLaptop").collection("advertise");

app.get("/category", async (req, res) => {
  const query = {};
  const category = await brandCollection.find(query).toArray();
  res.send(category);
});

app.get("/category/:id", async (req, res) => {
  const id = req.params.id;
  const query = { brand: { $in: [id] } };
  const category = await brandCollection.find(query).toArray();
  res.send(category);
});

app.post("/category", async (req, res) => {
  const booking = req.body;
  const result = await brandCollection.insertOne(booking);
  res.send(result);
});
app.delete("/category/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = { _id: ObjectId(id) };
  const result = await brandCollection.deleteOne(query);
  res.send(result);
});

app.post("/booking", async (req, res) => {
  const booking = req.body;
  const result = await bookingCollection.insertOne(booking);
  res.send(result);
});
app.get("/users", async (req, res) => {
  try {
    const userEmail = req.query.email;
    const query = { email: userEmail };
    const user = await userCollection.findOne(query);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});
app.post("/users", async (req, res) => {
  const booking = req.body;
  const result = await userCollection.insertOne(booking);
  res.send(result);
});

app.get("/dashboard/all-sellers", async (req, res) => {
  const query = {
    account: "seller",
  };
  const sellers = await userCollection.find(query).toArray();
  res.send(sellers);
});
app.delete("/dashboard/all-sellers/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
});

app.get("/dashboard/all-buyers", async (req, res) => {
  const query = {
    account: { $eq: "buyer" },
  };
  const buyers = await userCollection.find(query).toArray();
  res.send(buyers);
});

app.delete("/dashboard/all-buyers/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
});

app.post("/dashboard/products", async (req, res) => {
  const booking = req.body;
  const result = await productCollection.insertOne(booking);
  res.send(result);
});
app.get("/seller/products", async (req, res) => {
  const email = req.query.email;
  const query = { sellerEmail: email };
  const category = await brandCollection.find(query).toArray();
  res.send(category);
});

app.get("/advertise", async (req, res) => {
  const query = {};
  const advertise = await advertiseCollection.find(query).toArray();
  const productModel = advertise.map((ad) => ad.model);

  const filter = {
    model: { $in: productModel },
  };
  const advertiseProducts = await brandCollection.find(filter).toArray();
  res.send(advertiseProducts);
});
app.post("/advertise", async (req, res) => {
  const booking = req.body;
  const result = await advertiseCollection.insertOne(booking);
  res.send(result);
});

// root api
app.get("/", (req, res) => {
  res.send("Used Laptop Server is Running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
