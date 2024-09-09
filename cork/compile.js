const fs = require('fs')
const screwUp = require('../mod/dev/screw/screwUp.js')

const SRC = './mod/screw/stage.up'
const TARGET = './mod/stage/slib.js'

console.log('Compiling screw source: ')
const src = fs.readFileSync(SRC, 'utf-8')

console.log('======================================')
console.log(src)
console.log('--------------------------------------')
const enops = screwUp(src)
console.log(enops)
console.log('======================================')

console.log(`Saving to [${TARGET}]`)
fs.writeFileSync(TARGET, "function zapScrewLib(){geo(`" + enops + "`)}")

