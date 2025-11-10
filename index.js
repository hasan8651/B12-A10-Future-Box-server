require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbonu5x.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Future-Box server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("StudyPilot");
    const coursesCollection = db.collection("courses");

    app.get("/courses", async (req, res) => {
      const cursor = coursesCollection.find();
      const result = await cursor.toArray();
      // console.log(result)
      res.send(result);
    });

    app.get("/popular-courses", async (req, res) => {
      const result = await coursesCollection
        .find()
        .sort({ price: "asc" })
        .limit(6)
        .toArray();
      // console.log(result)
      res.send(result);
    });

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coursesCollection.findOne(query);
      // console.log(result)
      res.send(result);
    });


       app.post('/courses', async (req, res) => {
      const newCourse = req.body;
      const result = await coursesCollection.insertOne(newCourse);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Future-Box server is running on port: ${port}`);
});
