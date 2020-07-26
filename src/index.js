const express = require('express')
require('./db/mongoose')
const employeeRouter = require('./routers/employee')

const app = express()
const port = 3000

// Permet de parser le json
app.use(express.json())
app.use(employeeRouter)

app.listen(port, () => {
    console.log('Server is up on port '+ port)
})