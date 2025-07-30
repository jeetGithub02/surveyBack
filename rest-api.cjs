require('dotenv').config(); // Loads variables from .env file

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const conString = process.env.MONGODB_URI; // Atlas URI from .env file
const PORT = process.env.PORT || 4040;     // Use PORT from env or default to 4040

// 🟢 GET: Fetch all participators
app.get("/get-participators", (req, res) => {
    MongoClient.connect(conString)
        .then(clientObj => {
            const database = clientObj.db("FirstAge");
            return database.collection("participators").find({}).toArray();
        })
        .then(documents => {
            res.send(documents);
        })
        .catch(err => {
            console.error("MongoDB Error:", err);
            res.status(500).send("Error connecting to database.");
        });
});
app.get("/", (req, res) => {
     res.send("<h1>Hello World, Welcome to home Rout</h1>");
    // MongoClient.connect(conString)
    //     .then(()=> {
    //         res.send("<h1>Hello World, Welcome to home Rout</h1>");
    //     })
    //     .catch(err => {
    //         console.error("MongoDB Error:", err);
    //         res.status(500).send("Error connecting to database.");
    //     });
});

// 🔵 POST: Add a participator
app.post("/add-participator", (req, res) => {
    const body = req.body;
    const date = new Date();

    const participator = {
        Name: body.Name,
        FirstAge: parseInt(body.FirstAge),
        Gender: body.Gender,
        IsMarried: body.IsMarried === true || body.IsMarried === "true",
        IsSexed: body.IsSexed === true || body.IsSexed === "true",
        IsConsent: body.IsConsent === true || body.IsConsent === "true",
        ConsentOpinion: body.ConsentOpinion,
        Date: date
    };

    MongoClient.connect(conString)
        .then(clientObj => {
            const database = clientObj.db("FirstAge");
            return database.collection("participators").insertOne(participator);
        })
        .then(() => {
            console.log("Data has been saved");
            res.send("Yass, You did");
        })
        .catch(err => {
            console.error("MongoDB Error:", err);
            res.status(500).send("Error saving data.");
        });
});

// 🔴 Server Listen
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
