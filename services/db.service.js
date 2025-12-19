import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

export const dbService = {
  getCollection
};

async function getCollection(collectionName) {
  const db = client.db(process.env.DB_NAME);
  return db.collection(collectionName);
}
