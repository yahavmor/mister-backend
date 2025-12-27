import { MongoClient } from "mongodb";
import { config } from "../config/index.js";
import dotenv from 'dotenv'
dotenv.config()

console.log('DB URL:', config.dbURL)

export const client = new MongoClient(config.dbURL);

export async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to DB:", config.dbURL);
  } catch (err) {
    console.error("DB connection error:", err);
    throw err;
  }
}

export const dbService = {
  getCollection
};

async function getCollection(collectionName) {
  const db = client.db(config.dbName);
  return db.collection(collectionName);
}
