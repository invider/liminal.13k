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
    src: './dist/stage/**/*.js',
    css:  './dist/stage/style.css',
    html: './dist/stage/index.html',
    target: './dist/targetY/',
    /*
    scripts: [
        "glMatrix-0.9.5.min.js",
        "util.js",
        "texture.js",
        "init.js",
        "shaders.js",
        "sfx.js",
        "keyboard.js",
        "Mesh.js",
        "Actor.js",
        "Drone.js",
        "Laser.js",
        "Pod.js",
        "Grid.js",
        "level.js",
        "scene.js",
        ],
    */
};

var compilerOptions={
    //compilerPath: 'tools/compiler.jar',
    fileName: 'zap.js',
    compilerFlags: {
        //closure_entry_point: 'proc.start',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        // define: [
        //     "goog.DEBUG=false"
        // ],
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

gulp.task('default', function(next){
    return merge(
        gulp.src(path.src)
            .pipe(concat('zap.js'))
            .pipe(uglify())
            .pipe(gulp.dest(path.target)),
        //gulp.src(path.src)
            //.pipe(concat("zap.js"))
            //.pipe(closureCompiler(compilerOptions))
            //.pipe(gulp.dest(path.target));

        gulp.src(path.html)
            .pipe(htmlclean())
            .pipe(gulp.dest(path.target)),

        gulp.src(path.css)
            .pipe(cleanCSS())
            .pipe(gulp.dest(path.target))
    )
})

