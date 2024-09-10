require('harmonize')()
const gulp = require('gulp')
const closureCompiler = require('gulp-closure-compiler')
//const htmltidy = require('gulp-htmltidy')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const htmlclean = require('gulp-htmlclean')
const cleanCSS = require('gulp-clean-css')
const merge = require('gulp-merge')

const path = {
    stage:   './dist/stage/',
    src:     './dist/stage/**/*.js',
    css:     './dist/stage/style.css',
    html:    './dist/stage/index.html',
    jsz:     'zap.js',
    targetY: './dist/targetY/',
    targetZ: './dist/targetZ/',
};

var compilerOptions={
    //compilerPath: 'tools/compiler.jar',
    fileName: 'outputari.js',
    compilerFlags: {
        //closure_entry_point: 'proc.start',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        define: [
             "goog.DEBUG=false"
        ],
        // externs: [
        //     'bower_components/este-library/externs/react.js'
        // ],
        //extra_annotation_name: 'jsx',
        //only_closure_dependencies: true,
        // .call is super important, otherwise Closure Library will not work in strict mode.
        //output_wrapper: '(function(){%output%}).call(window);',
        warning_level: 'VERBOSE',
        //warning_level: 'QUIET'
    }
}

function buildY(next) {
    return merge(
        gulp.src(path.src)
            .pipe(concat(path.jsz))
            .pipe(uglify())
            .pipe(gulp.dest(path.targetY)),

        gulp.src(path.html)
            .pipe(htmlclean())
            .pipe(gulp.dest(path.targetY)),

        gulp.src(path.css)
            .pipe(cleanCSS())
            .pipe(gulp.dest(path.targetY))
    )
}

function buildZ(next) {

    return merge(
            /*
            .pipe(closureCompiler({
                compilerPath: './node_modules/google-closure-compiler-java/compiler.jar',
                fileName: 'build.js',
                  compilerFlags: {
                      compilation_level: 'ADVANCED_OPTIMIZATIONS',
                      define: [
                        "goog.DEBUG=false"
                      ],
                      warning_level: 'VERBOSE',
                  },
            }))
            */
            //.pipe(gulp.dest('dist/')),
            //.pipe(concat("zapper.js"))
            //.pipe(gulp.dest(path.stage))
            //.pipe(closureCompiler(compilerOptions))
            //.pipe(concat(path.jsz))
            //.pipe(gulp.dest(path.targetZ)),
        //gulp.src(path.src)
        //    .pipe(concat('path.jsz'))
        //    .pipe(uglify())
        //    .pipe(gulp.dest(path.targetZ)),
        gulp.src(path.src)
            .pipe(concat('prezap.js'))
            .pipe(gulp.dest(path.stage)),
        gulp.src(path.html)
            .pipe(htmlclean())
            .pipe(gulp.dest(path.targetZ)),
        gulp.src(path.css)
            .pipe(cleanCSS())
            .pipe(gulp.dest(path.targetZ))
    )

    next()
}

exports.buildY = buildY
exports.buildZ = buildZ
exports.default = buildY

