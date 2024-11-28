const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://davidxvaz:UzJsu7NF3X3hntYU@clusterchat.ufour.mongodb.net/weatherApp?retryWrites=true&w=majority";

async function connect() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Connected successfully to MongoDB");
        await client.close();
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

connect();
