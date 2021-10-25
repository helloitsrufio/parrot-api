const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const cors = require('cors')

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Parrot'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology : true})
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))//lets you use files in your public folder
app.use(express.urlencoded({ extended : true}))//method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
app.use(express.json())//method inbuilt in express to recognize the incoming Request Object as a JSON Object.

app.get('/', (request, response) => {
    db.collection('Parrot').find().toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addParrot', (req,res) =>{
    db.collection('parrots').insertOne({parrotImage: req.body.parrotImage, parrotName: req.body.parrotName, parrotColor: req.body.parrotColor, naturalHabitat: req.body.naturalHabitat, definingCharacteristic: req.body.definingCharacteristic})
    .then(res => {
        console.log('Parrot Added')
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

// let cockatiel = {
//     'colors' : 'white and gray, yellow, white, and gray, white',
//     'natural habitat' : 'Australia',
//     'defining characteristics' : 'crest on top of head, orange circles on cheeks',
// }



// app.get('/:id', (request, response)=>{
//     buttonClick; 
// })

const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})