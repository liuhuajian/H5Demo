var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin'); 
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var minifycss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');
var stripDebug = require('gulp-strip-debug');
var babel = require('gulp-babel');

var yargs = require('yargs')
    .options({
        'w': {
            alias: 'watch',
            type: 'boolean'
        },
        's': {
            alias: 'server',
            type: 'boolean'
        },
        'p': {
            alias: 'port',
            type: 'number'
        }
    }).argv;

//var dist = __dirname + '/dist';
 
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
    // .pipe(notify({ message: 'html task ok' }));
});

gulp.task('html', function() {
    return gulp.src('src/html/*.html')
      .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
      .pipe(gulp.dest('dist/html'))
      .pipe(browserSync.reload({stream: true}));
      // .pipe(notify({ message: 'html task ok' }));
  });

gulp.task('vendor', function() {
    return gulp.src(['src/vendor/**', '!src/vendor/js/app.min.js'])
    .pipe(gulp.dest('dist/vendor/'))
    .pipe(browserSync.reload({stream: true}));
});

// vendor js
gulp.task('vendorjs', function() {
  return gulp.src('src/vendor/js/app.min.js')
    //.pipe(concat('all.js'))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('dist/vendor/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
  return gulp.src('src/img/*')
    // .pipe(imagemin({
    //     progressive: true,
    //     svgoPlugins: [{removeViewBox: false}],
    //     use: [pngcrush()]
    // }))
    .pipe(gulp.dest('dist/img/'))
    .pipe(browserSync.reload({stream: true}));
    // .pipe(notify({ message: 'img task ok' }));
});
 
gulp.task('css', function() {
  return gulp.src('src/css/*.css')
    .pipe(concat('style.css'))
    //.pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}));
    // .pipe(notify({ message: 'css task ok' }));
});
 
gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint({"evil":true}))
    .pipe(jshint.reporter('default'));
    // .pipe(notify({ message: 'lint task ok' }));
});
 
gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(rename({ suffix: '.min' }))
    //.pipe(stripDebug())
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    pipe(browserSync.reload({stream: true}));
    // .pipe(notify({ message: 'js task ok' }));
});
 
gulp.task('watch', function () {
    gulp.watch('src/css/**/*', ['css']);
    gulp.watch('src/js/**/*.js', ['lint', 'js', 'html']);
    gulp.watch('src/img/*', ['img']);
    gulp.watch('src/**/*.html', ['html']);
});

gulp.task('server', function () {
    yargs.p = yargs.p || 8199;
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        startPath: '/index.html'
    });
});

// 默认任务
// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', function () {
    // gulp.run('vendor', 'vendorjs', 'img', 'css', 'lint', 'js', 'html');
    gulp.run('vendor', 'vendorjs', 'img', 'css', 'js', 'html');
    //gulp.run('html');
    //gulp.run('vendorjs');

//    if (yargs.s) {
        gulp.start('server');
//    }

//    if (yargs.w) {
        gulp.start('watch');
//    }

});
