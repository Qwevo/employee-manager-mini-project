const jwt = require('jsonwebtoken')
const Employee = require('../models/employee')

// création de la fonction auth
const auth  = async (req, res, next) => {
    try {
        // Extraction du token, j'enléve aussi les vides
        const token = req.header('Authorization').replace(' ','')
        // Décoder le token afin d'extraire l'id 
        const decoded = jwt.verify(token, 'nasreddinelatreche')
        // Recherche dans la BD par id et token(dans le liste des tokens)
        const employee = await Employee.findOne({_id: decoded._id, 'tokens.token':token})
        if(!employee) {
            throw new Error()
        }
        // Donner la possibilité au handler de renvoyer les champs token et employee
        req.token = token
        req.employee = employee
        // Déclencher le handler
        next()
    } catch(e) {
        res.status(401).send({error:'Veuillez s\'authentifier'})
    }
}
module.exports = auth