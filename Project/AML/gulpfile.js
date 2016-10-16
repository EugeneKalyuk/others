'use strict';

var gulp          = require("gulp"),
    jade          = require("gulp-jade"),
    rename        = require("gulp-rename"),
    htmlmin       = require("gulp-htmlmin"),
    livereload    = require("gulp-livereload"),
    connect       = require("gulp-connect"),
    stylus        = require("gulp-stylus"),
    autoprefixer  = require("gulp-autoprefixer"),
    sourcemaps    = require("gulp-sourcemaps"),
    gulpIf        = require("gulp-if"),
    plumber       = require("gulp-plumber"),
    notify        = require("gulp-notify"),
    uglify        = require("gulp-uglify"),
    concat        = require("gulp-concat"),
    csso          = require("gulp-csso"),
    defaulltTasks = ['html', 'css', 'js', 'watch'],
    isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

if(isDevelopment){
    defaulltTasks.unshift('connect');
}

gulp.task("connect", function () {
    connect.server({
        root: 'application',
        livereload: true
    });
});

gulp.task("html", function () {
    return gulp.src('application/components/layout.jade')
        .pipe(plumber({errorHandler: notify.onError(function (error) {
            return "Message to the notifier: " + error.message;
        })}))
        .pipe(jade())
        .pipe(rename('index.html'))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('application/public/'))
        .pipe(connect.reload());
});

gulp.task("css", function () {
    return gulp.src('application/components/layout.styl')
        .pipe(plumber({errorHandler: notify.onError(function (error) {
            return "Message to the notifier: " + error.message;
        })}))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(stylus())
        .pipe(rename('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions','>1%', 'ie 9'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('application/public'))
        .pipe(connect.reload());
});

gulp.task("js", function () {
    return gulp.src('application/components/**/*.js')
        .pipe(uglify().on('error', notify.onError({
            message: "Error: <%= error.message %>"
        })))
        .pipe(concat('action.js'))
        .pipe(gulp.dest('application/public'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('application/components/**/*.jade', ['html']);
    gulp.watch('application/components/**/*.styl', ['css']);
    gulp.watch('application/components/**/*.js', ['js'])
});

gulp.task("default", defaulltTasks);