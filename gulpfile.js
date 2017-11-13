var gulp = require("gulp");
var sass = require("gulp-sass");
var minify = require("gulp-cssmin");
var rename = require("gulp-rename");
var removeCss = require("gulp-uncss");
var miniJs = require("gulp-uglify");
var combineJs = require("gulp-concat");
var browserSync = require("browser-sync").create();
var mini = require("gulp-htmlmin");
var runSequence = require("run-sequence");

/* Test gulp to make sure it is working*/
gulp.task('talk', function(){
	console.log("Gulp is awesome");
});


gulp.task("sassCssMini", function(){
	return gulp.src("src/scss/*.scss")
		.pipe(sass())
		.pipe(minify())
		.pipe(rename({
			suffix: "-min"
		}))
		.pipe(gulp.dest("src/css"));
});


gulp.task("cleanCss", function(){
	return gulp.src("src/css/*-min.css")
		   .pipe(removeCss({
				html: ["src/index.html"] 
			/* checks for all the styles being used within this file */
			}))
		    .pipe(gulp.dest("src/css")) 
});

gulp.task("optjs", function(){
	return gulp.src(["src/js/jquery.js","src/js/bootstrap.js"])
		   .pipe(combineJs('main-min.js'))
		   .pipe(miniJs())
		   .pipe(gulp.dest("src/js"));
});

/* Transfer to dist */
gulp.task('images', function(){
	gulp.src(["src/images/*","!src/images/*.not-needed"])
	.pipe(gulp.dest("dist/images"));
});
gulp.task('fonts', function(){
	gulp.src("src/fonts/**/*")
	.pipe(gulp.dest("dist/fonts"));
});
gulp.task('css', function(){
	gulp.src("src/css/*-min.css")
	.pipe(gulp.dest("dist/css"));
});
gulp.task('js', function(){
	gulp.src("src/js/*-min.js")
	.pipe(gulp.dest("dist/js"));
});
gulp.task('minihtml', function(){
	gulp.src('src/*.html')
	.pipe(mini({ 
			collapseWhitespace: true,
			removeComments: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true
		}))
		.pipe(gulp.dest('dist'));
});


gulp.task('startServer', function(){
	browserSync.init({
		server: {
			baseDir: 'src'
		},
	})
});


gulp.task('watchSass',['sassCssMini','optjs','startServer'], function(){
	gulp.watch("src/scss/*.scss", ['sassCssMini']);
	gulp.watch(["src/js/jquery.js","src/js/bootstrap.js"], ['optjs']);
	gulp.watch("src/css/*-min.css", browserSync.reload);
	gulp.watch("src/*.html", browserSync.reload);
});


gulp.task('default',function(callback){
	runSequence('sassCssMini','cleanCss','optjs','images','fonts','css','js','minihtml', callback);
});
