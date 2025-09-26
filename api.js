import express from "express"
import {addTodo, getTodos, deleteTodo} from "./model/model.js"

export const api = express.Router()

api.get('/todo', async (req, res) => {
    const todos = await getTodos()
    res.json(todos.map((el) => {
        return {
            id: el.id,
            description: el.description,
            priority: el.priority,
            isDone: el.status
        }
    }))
})

api.post('/todo', async (req, res) => {
    console.log(req.body)
    await addTodo({
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.isDone
    })
    res.status(201).end()
})

api.delete('/todo/:id', async (req, res) => {
    console.log("Kustutame ülesannet id-ga " + req.params.id)
    const deleteSuccessful = await deleteTodo(req.params.id)
    res.status(deleteSuccessful? 200: 406).end()
})