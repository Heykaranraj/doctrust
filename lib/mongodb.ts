import { MongoClient } from "mongodb"
import dataStore from "./data-store"

// DUMMY VALUES - Replace with real values in production
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/docverify"
const MONGODB_DB = process.env.MONGODB_DB || "docverify"

let cachedClient = null
let cachedDb = null

// MongoDB wrapper that falls back to in-memory store if connection fails
export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    // Try to connect to MongoDB
    if (MONGODB_URI && MONGODB_URI !== "mongodb://localhost:27017/docverify") {
      const client = new MongoClient(MONGODB_URI)
      await client.connect()
      const db = client.db(MONGODB_DB)

      cachedClient = client
      cachedDb = db

      console.log("Connected to MongoDB successfully")
      return { client, db }
    } else {
      throw new Error("Using fallback data store")
    }
  } catch (error) {
    console.log("MongoDB connection failed, using in-memory data store:", error.message)

    // Create a MongoDB-like interface that uses our in-memory data store
    const mockDb = {
      collection: (collectionName) => {
        return {
          // Find one document
          findOne: async (query) => {
            if (collectionName === "doctors") {
              if (query.licenseNumber) {
                return await dataStore.getDoctorByLicense(query.licenseNumber)
              } else if (query.id) {
                return await dataStore.getDoctorById(query.id)
              }
            }
            return null
          },

          // Find multiple documents
          find: (query = {}) => {
            return {
              sort: () => {
                return {
                  toArray: async () => {
                    if (collectionName === "doctors") {
                      return await dataStore.getDoctors(query)
                    } else if (collectionName === "reports") {
                      return await dataStore.getReports(query)
                    }
                    return []
                  },
                }
              },
            }
          },

          // Insert a document
          insertOne: async (document) => {
            if (collectionName === "doctors") {
              const newDoc = await dataStore.addDoctor(document)
              return { insertedId: newDoc.id }
            } else if (collectionName === "reports") {
              const newDoc = await dataStore.addReport(document)
              return { insertedId: newDoc.id }
            }
            return { insertedId: null }
          },

          // Update a document
          updateOne: async (query, update) => {
            if (collectionName === "doctors" && query.id) {
              const updatedDoc = await dataStore.updateDoctor(query.id, update.$set || {})
              return { modifiedCount: updatedDoc ? 1 : 0 }
            } else if (collectionName === "reports" && query.id) {
              const updatedDoc = await dataStore.updateReport(query.id, update.$set || {})
              return { modifiedCount: updatedDoc ? 1 : 0 }
            }
            return { modifiedCount: 0 }
          },
        }
      },
    }

    const mockClient = { close: () => {} }

    cachedClient = mockClient
    cachedDb = mockDb

    return { client: mockClient, db: mockDb }
  }
}

