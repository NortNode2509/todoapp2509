import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
dotenv.config()

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const cluster = process.env.DB_CLUSTER
const databaseName = 'todo2509'


const mongoUrl = `mongodb+srv://${user}:${password}@${cluster}`

let client

export async function getDatabaseCollection(collectionName) {
  if (!client) {
    client = new MongoClient(mongoUrl)
    console.log('=>starting to connect: ' + mongoUrl)
    await client.connect()
  }
  console.log('=> getting database')
  const database = client.db(databaseName)
  console.log('=> getting collection')
  return database.collection(collectionName)
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close()
    client = null
  }
}

export async function addTodo({
    description, priority, status
}) {
    console.log(description, priority, status)
    const todoCollection = await getDatabaseCollection('tasks')
    const newObject = await todoCollection.insertOne({description, priority, status})
    console.log(newObject)
}

export async function getTodos() {
     const todoCollection = await getDatabaseCollection('tasks')
     const hikes = await todoCollection.find({}).toArray();
     
     return hikes.map(el => {
      const { _id,  ...todoWithoutId } = el;
      todoWithoutId.id = el._id
      return todoWithoutId;
     })

}

export async function deleteTodo(id) {
  const todoCollection = await getDatabaseCollection('tasks')
  const result = await todoCollection.deleteOne({_id: ObjectId.createFromHexString(id)})
  console.log(result)
  return result.deletedCount > 0
}

export async function updateTodo(id, { description, priority, status }) {
  const todoCollection = await getDatabaseCollection('tasks')
  const updateFields = {}
  if (typeof description !== 'undefined') updateFields.description = description
  if (typeof priority !== 'undefined') updateFields.priority = priority
  if (typeof status !== 'undefined') updateFields.status = status

  if (Object.keys(updateFields).length === 0) {
    return false
  }

  const result = await todoCollection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: updateFields }
  )
  console.log(result)
  return result.matchedCount > 0 && result.modifiedCount >= 0
}