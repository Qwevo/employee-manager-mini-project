// Chargement des dépendances
const express = require('express')
const Employee = require('../models/employee')
const auth = require('../middleware/auth')
const router = new express.Router()

// Créer un nouveau profil
router.post('/employees', async (req, res) => {
    const employee = new Employee(req.body)
    try {
        await employee.save()
        const token = await employee.generateAuthToken()
        // Code 201 === Created (http response)
        res.status(201).send({employee, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// Appel login qui renvoi le token d'authentification
router.post('/employees/login', async (req, res) => {
    try {
        const employee = await Employee.findByCredentials(req.body.email, req.body.password)
        const token = await employee.generateAuthToken()
        res.send(token)
    } catch(e) {
        res.status(400).send(e)
    }
})

// Lister tous les employées
router.get('/employees', auth, async (req, res) => {
    try {
        const employees = await Employee.find({})
        res.send(employees)
    } catch(e) {
        res.status(500).send()
    }
})

// lister un employée par son id
router.get('/employees/:id', auth, async (req, res) => {
    const _id = req.params.id 
    try {
        const employee = await Employee.findById(_id)
        if(!employee) {
            return res.status(404).send()
        }
        res.send(employee)
    } catch(e) {
        res.status(500).send()
    }
})

// Mise à jour profil par id
router.patch('/employees/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    // les champs à mettre à jour
    const allowedUpdates = ['name', 'email', 'password', 'age']
    // 1 false -> return false
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error : 'Mise à jour invalide!'})
    }
    try {
        const employee = await Employee.findById(req.params.id)
        updates.forEach((update) => employee[update] = req.body[update])
        await employee.save()

        if(!employee) {
            return res.status(404).send()
        }
        res.send(employee)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Supprimer un profil par id
router.delete('/employees/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id)
        if(!employee)
        {
            return res.status(404).send()
        }
        res.send(employee)
    } catch (e) {
        res.status(500).send()

    }
})

module.exports = router