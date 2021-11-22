const path = require('path')
const express = require('express')
const app = express()

const PORT = process.env.PORT || 5000

app.use(express.static(__dirname + '/public'))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')))
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))

app.listen(PORT, () => console.log('server is running @ http://127.0.0.1:5000'))
