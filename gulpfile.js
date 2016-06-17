/**
 * Created by majing on 2016/5/25.
 */
var gulp = require("gulp"),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    del = require("del"),
    template = require("gulp-template"),
    runSequence = require('run-sequence');

var filepath = {
    build: "./build",
    sass: {
        config: "./config.rb",
        root: "./sass",
        path: "./sass/index.scss"
    },
    css: "./css",
    js: "./js",
    asset: {
        js: [
            "./bower_components/zepto/zepto.min.js",
            "./bower_components/create-js/PreloadJS/lib/preloadjs-0.6.2.min.js",
            "./bower_components/create-js/EaselJS/lib/easeljs-0.8.2.min.js",
            "./bower_components/create-js/SoundJS/lib/soundjs-0.6.2.min.js",
            "./bower_components/tween.js/src/Tween.js"
        ]
    }
}

// 清理文件
gulp.task('clean', function (cb) {
    return del( filepath.build,cb)
});

/* 压缩asset文件 */
gulp.task('build:asset',function () {
    //js
    var js = gulp.src( filepath.asset.js )
        .pipe(concat('base.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest( filepath.build ));
    return js;
});


/* compass */
gulp.task( 'build:compass', function() {
    var sass = gulp.src( filepath.sass.path )
        .pipe(compass({
            config_file: filepath.sass.config,
            css: filepath.css,
            sass: filepath.sass.root
        }));
    var css = gulp.src( filepath.css + "/*" )
        .pipe(gulp.dest( filepath.build ));
    return sass, css;
});

/* 压缩js文件 */
gulp.task('build:js',function () {
    return gulp.src( filepath.js + '/**/*' )
        .pipe(concat('index.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest( filepath.build ));
});

/* watch */
gulp.task( 'watch',function () {
    gulp.watch([
        filepath.sass.root + '/*'
    ], ['build:compass']);
    gulp.watch([
        filepath.js + '/**/*'
    ], ['build:js']);
});

gulp.task('default',function () {
    runSequence( 'clean',
        ['build:asset','build:compass','build:js','watch'],
        function () {
            console.log('打包完成');
            console.log('开发模式');
        });
});