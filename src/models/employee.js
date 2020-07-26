/*
* @author Nasreddine LATRECHE
* 26-07-2020
*/

// Chargement de la dépendance mongoose -> voir documentation sur https://mongoosejs.com/docs/api.html
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//Utilisation des fonctions fournies par le middleware
const employeeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        // Assurer l'unicité du champ email afin d'éviter les problèmes lors de l'utilisation du login(token) 
        unique: true,
        required: true,
        trim: true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Format email invalid !!')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('pass')){
                throw new Error('Veuillez choisir un mot de passe fiable!!')
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value < 0)
            {
                throw new Error('Age ne peut pas être négatif !!')
            }
        }
    },
    // Ce champs, est une liste qui stocke les tokens afin de tracer les session utilisateurs
    tokens : [{
        token : {
            type: String,
            required: true
        }
    }]
})

// méthodes statiques
employeeSchema.statics.findByCredentials = async (email, password) => {
    const employee = await Employee.findOne({email})
    if(!employee)
    {
        throw new Error('Impossible de se connecter !!')
    }

    const isMatch = await bcrypt.compare(password, employee.password)
    if(!isMatch)
    {
        throw new Error('Impossible de se connecter')
    }
    return employee
}

// Appliquer un override sur la fonction toJSON afin de virer les champs critique de l'affichage (password, tokens)
employeeSchema.methods.toJSON = function () {
    const employee = this
    const employeeObject = employee.toObject()
    delete employeeObject.password
    delete employeeObject.tokens
    return employeeObject
}

// Méthodes d'instance spécifique à l'insatnce employee
employeeSchema.methods.generateAuthToken = async function () {
    const employee = this
    // générer le token
    const token = jwt.sign({_id: employee._id.toString()}, 'nasreddinelatreche')
    //Ajouter le token dans la liste des tokens valides
    employee.tokens = employee.tokens.concat({token})
    await employee.save()
    return token
}

// La syntaxe ES6 fonctionne pas, car elle ne permet pas le 'Binding', donc il faut passer par (function)
// Pre est une fonction dans le builtin mongoose qui renvoie une promise et qui permet de faire des vérifications avant la fonction('save, update ...')  
employeeSchema.pre('save', async function(next){
    const employee = this

    if(employee.isModified('password')) {
        employee.password = await bcrypt.hash(employee.password, 8)
    }
    // Libérer la fonction en utilisant next() sinon ça sera une boucle infinie et le handler ne démarrera jamais
    next()
})

// Création du modèle Employee en se basant sur le schèma crée avant
const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee