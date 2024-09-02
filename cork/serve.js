const fs         = require('fs')
const express    = require('express')
const bodyParser = require('body-parser')

const BIND = process.env.BIND || 'localhost'
const PORT = process.env.PORT || 9101
const TARGET_DIR = process.env.TARGET_DIR || './mod/screw'
const EXT = '.up'

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
//app.use(bodyParser.json())
app.use(bodyParser.text())

app.post('/up/:screw', (req, res) => {
    const name = req.params.screw
    const data = req.body;

    const path = TARGET_DIR + '/' + name + EXT

    console.log(`uploading script: [${name}]`)
    console.log(`saving to: [${path}]`)
    console.log(data)
    console.log('----')

    fs.writeFileSync(path, data, {
        encoding: "utf8",
    })

    res.statusCode = 200
    res.send({
        message: `Success. [${name}] is saved.`,
    })
})

// static content
app.use(express.static('mod'))

app.listen(PORT, BIND, () => {
    console.log(`Cork server is running on http://${BIND}:${PORT}`);
    console.log(`            * http://${BIND}:${PORT}/termit.html#boxCorkscrew/simple`);
})
