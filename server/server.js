const express = require('express')
const app = express()

app.use(express.json())
app.use('/', require('./route/postsRoute'))
//AAAAAAAAAAAAA
app.use(function (error, req, res, next) {
    if(error.message === 'Post already exists'){
        res.status(409).send(e.message)
    }
    if (e.message === 'Post not found'){
        res.status(404).send(e.message)
    } 
    res.status(500).send(e.message)
})

app.listen(3000)