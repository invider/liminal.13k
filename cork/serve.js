const fs         = require('fs')
const express    = require('express')
const bodyParser = require('body-parser')

const BIND = process.env.BIND || 'localhost'
const PORT = process.env.PORT || 9101
const TARGET_DIR = process.env.TARGET_DIR || './mod/screw'
const EXT = '.up'
const BAK = '.bup'

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
//app.use(bodyParser.json())
app.use(bodyParser.text())

app.post('/backup/:screw', (req, res) => {
    const name = req.params.screw
    const data = req.body;

    const time = new Date().toISOString().slice(0, 19)
    const path = TARGET_DIR + '/.' + name + '.' + time + BAK

    console.log(`[!] backing up script: [${name}] to [${path}]`)

    fs.writeFileSync(path, data, {
        encoding: "utf8",
    })

    res.send({
        message: `[${name}]: backup successful`,
    })
})

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
app.use('/stage', express.static('./dist/stage'))
app.use('/targetX', express.static('./dist/targetX'))
app.use('/targetY', express.static('./dist/targetY'))
app.use('/targetZ', express.static('./dist/targetZ'))

app.listen(PORT, BIND, () => {
    console.log(`=====   Cork server is running   =====`)
    console.log(` * http://${BIND}:${PORT}`);
    console.log(` * http://${BIND}:${PORT}/debug.html`);
    console.log(` * http://${BIND}:${PORT}/debug.html#boxGeo`);
    console.log(` * http://${BIND}:${PORT}/debug.html#boxScrew`);
    console.log(` * http://${BIND}:${PORT}/debug.html#boxFM`);
    console.log(` * http://${BIND}:${PORT}/debug.html#boxCorkscrew/sample`);
    console.log(` * http://${BIND}:${PORT}/debug.html#boxCorkscrew/simple`);
    console.log(` * http://${BIND}:${PORT}/debug.html#boxCorkscrew/stage`);
    console.log(`===============================================================`);
    console.log(` * http://${BIND}:${PORT}/stage/index.html`);
    console.log(` * http://${BIND}:${PORT}/targetX/index.html`);
    console.log(` * http://${BIND}:${PORT}/targetY/index.html`);
    console.log(` * http://${BIND}:${PORT}/targetZ/index.html`);
})
