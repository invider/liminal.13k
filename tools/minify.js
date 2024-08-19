const fs = require('fs')
const htmlMinifier = require('html-minifier-terser')
const { minify_sync } = require("terser")

function fileType(path) {
    if (path.endsWith('.html')) return 'html'
    if (path.endsWith('.css')) return 'css'
    if (path.endsWith('.js')) return 'js'
}

function loadDir(code, path) {
    fs.readdirSync(path).forEach(fileName => {
        load(code, path + '/' + fileName)
    })
}

function load(code, path) {
    const stats = fs.statSync(path)

    if (stats.isDirectory()) {
        loadDir(code, path)
    } else if (stats.isFile()) {
        const type = fileType(path)
        if (type) {
            const content = fs.readFileSync(path, 'utf-8')
            console.log(` * loaded [${path}]: \t\t ${content.length} characters`)

            const name = path
            switch(type) {
                case 'html':
                    code.html[name] = content
                    break
                case 'css':
                    code.css[name] = content
                    break
                case 'js':
                    code.js[name] = content
                    break
            }
        } else {
            console.log(`* ignoring [${path}]`)
        }
    } else {
        console.log(`* ignoring [${path}]`)
    }
}

const code = {
    html: {},
    css: {},
    js: {},
    glsl: {},  // TODO investigate if shaders also can be minimized
}
load(code, './src')


const code2 = {
    "file1.js": "function add(first, second) { return first + second; }",
    "file2.js": "console.log(add(1 + 2, 3 + 4));"
};
const opt = {
    toplevel: true,
    sourceMap: true,
}

const result = minify_sync(code2, opt)
console.dir(result)
//console.log(result.code)
//console.log(result.map)

