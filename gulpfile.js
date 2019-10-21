"use strict";

var siteCSS = '</body>',
    siteUrl = 'https://montvell.com/';


var gulp = require('gulp'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
		browserSync = require('browser-sync'),
		cssnano = require('gulp-cssnano');

	

//css inject
gulp.task('css-inject', function () {
    var config = {
      addSourceMaps: true,
      concatCSS: true,
      plugins:{
        cleanCss: {}
      }
    };
    var reload = browserSync.reload;
    return gulp.src('src/scss/common.scss')
    .pipe(plumber({ // plumber - плагин для отловли ошибок.
            errorHandler: notify.onError(function(err) { // nofity - представление ошибок в удобном для вас виде.
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
    // .pipe(sourcemaps.init())
    .pipe(sass()) //Компиляция sass.
    .pipe(prefix('last 2 versions','> 1%', 'ie 9'))
		.pipe(rename('style.css'))
		// .pipe(sourcemaps.write())
		.pipe(cssnano())
    .pipe(gulp.dest('app/assets//css'))
    .pipe(reload({stream:true}));
});


//watch
gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.*', gulp.series('css'));
    gulp.watch('app/*.html', gulp.series('html'));
});

//watch-inject
gulp.task('watch-inject', function () {
    gulp.watch('src/scss/**/*.*', gulp.series('css-inject'));
});

//server
gulp.task('server', function() {
    browserSync({
        proxy: siteUrl,
        middleware: require('serve-static')('./app'),
        rewriteRules: [ 
        {
            match: new RegExp (siteCSS),
            fn: function() {
                return '<link href="' + siteUrl + 'assets/css/style.css" rel="stylesheet" type="text/css" media="all" /></body>';
            }
        }
        ]
    });
});



gulp.task('inject', gulp.parallel('css-inject', 'watch-inject', 'server'));
gulp.task('default', gulp.parallel('css-inject', 'watch-inject', 'server'));
