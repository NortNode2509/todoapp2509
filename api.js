import express from "express"
import {addTodo, getTodos} from "./model/model.js"

export const api = express.Router()

api.get('/todo', async (req, res) => {
    res.json(await getTodos())
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


//TODO loo get.delete abil endpoint kustutamiseks id parameetri kasutamiseks  kasuta :id parameetrit
