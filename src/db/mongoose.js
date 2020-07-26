/*
* @author Nasreddine LATRECHE
* 26-07-2020
*/

// Chargement de la dépendance mongoose -> voir documentation sur https://mongoosejs.com/docs/api.html
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/employee-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    // A rajouter afin d'ignorer le message de "Deprecated server ..."
    useFindAndModify: false,
    // A rajouter afin d'ignorer le message de "Deprecated server ..."
    useUnifiedTopology:true
})