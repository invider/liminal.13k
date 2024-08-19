const fs = require('fs')
const htmlMinifier = require('html-minifier-terser')
const { minify_sync } = require("terser")

const env = {
    src: './src2',
    tar: './dist/src2',
    tarJS: 'game.js',
}

function parseArgs() {
    if (process.argv[2]) env.src = process.argv[2]
    if (process.argv[3]) env.tar = process.argv[3]
}

function log(msg) {
    console.log(msg)
}

function fileName(path) {
    const lastSlash = path.lastIndexOf('/')
    if (lastSlash >= 0) return path.substring(lastSlash + 1)
    return path
}

function addPath(base, path) {
    base = base || ''
    path = path || ''

    if (base.endsWith('/') || path.startsWith('/')) return base + path
    return base + '/' + path
}

function fileType(path) {
    if (path.endsWith('.html')) return 'html'
    if (path.endsWith('.css')) return 'css'
    if (path.endsWith('.js')) return 'js'
}

function loadDir(code, path) {
    fs.readdirSync(path).forEach(fileName => {
        loadFile(code, addPath(path, fileName))
    })
}

function loadFile(code, path) {
    const stats = fs.statSync(path)

    if (stats.isDirectory()) {
        loadDir(code, path)
    } else if (stats.isFile()) {
        const type = fileType(path)
        if (type) {
            const content = fs.readFileSync(path, 'utf-8')
            log(` * loaded [${path}]:\t${stats.size}b`)

            const name = fileName(path)
            code[type][name] = content
            code.stat.bytes += stats.size
            code.stat.chars += content.length
        } else {
            log(`* ignoring [${path}]`)
        }
    } else {
        log(`* ignoring [${path}]`)
    }
}

function load(path) {
    const code = {
        html: {},
        css: {},
        js: {},
        glsl: {},  // TODO investigate if shaders also can be minimized

        stat: {
            bytes: 0,
            chars: 0,
        },
    }

    log(`=== Loading [${path}] ===`)
    loadFile(code, path)

    log('-------------------------------------------')
    log(`   Total : ${code.stat.bytes}b`)
    log('-------------------------------------------')

    return code
}

function save(content, dirPath, filePath) {
    if (!fs.existsSync(dirPath)) {
        log(`! creating dir: [${dirPath}]`)
        fs.mkdirSync(dirPath, { recursive: true })
    }

    const path = addPath(dirPath, filePath)
    log(` * saving [${path}]`)
    fs.writeFileSync(path, content, {
        encoding: 'utf-8',
    })
}

function minify(code) {
    const opt = {
        toplevel: true,
        sourceMap: true,
    }

    const result = minify_sync(code.js, opt)
    //console.dir(result)
    //console.log(result.code)
    //console.log(result.map)
    
    return result
}

parseArgs()

const code = load(env.src)
const result = minify(code)
save(result.code, env.tar, env.tarJS)

log('\n=== Minified Stats ===')
const out = load(env.tar)

