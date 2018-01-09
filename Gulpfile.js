var gulp = require("gulp");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');
var nunjucksRender = require('gulp-nunjucks-render');
var spritesmith = require('gulp.spritesmith');
const watchSass = require("gulp-watch-sass");


gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('./src/images/*.png') 
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
                imgPath: '../images/sprite.png'
            }));

    spriteData.img.pipe(gulp.dest('./dist/images/')); 
    spriteData.css.pipe(gulp.dest('./src/sass/')); 
});

gulp.task('scripts', function() {
    gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'src/js/**.js'
    ])
    .pipe(concat('app.js'))
    .pipe(minify({
        exclude: ['tasks']
    }))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('html', function () {
    gulp
    .src('./src/templates/**.html')
    .pipe(nunjucksRender({
      path: ['./src/templates/'] // String or Array 
    }))
    .pipe(concat('index.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task("styles", function(){
	gulp
	.src("./src/sass/index.scss")
	.pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(rename("app-min.css"))
    .pipe(gulp.dest("dist/css"));
    
});

gulp.task("sass:watch", () => {
    gulp.watch([
      "./src/sass/*.scss",
      "!./public/libs/**/*"
    ], ["styles"]);
  });


gulp.task("default", ["sprite", "scripts", "html", "styles", "sass:watch"])

