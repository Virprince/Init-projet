// npm install gulp gulp-compass gulp-autoprefixer gulp-jshint gulp-clean gulp-minify-css gulp-uglify gulp-rename gulp-concat gulp-notify gulp-livereload gulp-plumber path susy --save-dev

//load plugins
var gulp             = require('gulp'),
	compass          = require('gulp-compass'),
	autoprefixer     = require('gulp-autoprefixer'),
	minifycss        = require('gulp-minify-css'),
	jshint 			 = require('gulp-jshint'),
	uglify           = require('gulp-uglify'),
	rename           = require('gulp-rename'),
	concat           = require('gulp-concat'),
	clean 			 = require('gulp-clean'),
	notify           = require('gulp-notify'),
	livereload       = require('gulp-livereload'),
	plumber          = require('gulp-plumber'),
	path             = require('path');

//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};
// VARIABLES
var basePath = {
  src  : 'src/',
  dest : 'html/'
};

var srcAssets = {
  styles  : basePath.src + 'scss',
  scripts : basePath.src + 'js',
  templates : basePath.src + 'templates',
  images  : basePath.src + 'img'
};

var destAssets = {
  styles  : basePath.dest + 'css',
  scripts : basePath.dest + 'js',
  images  : basePath.dest + 'img'
};

//styles
gulp.task('styles', function() {
	return gulp.src([srcAssets.styles +'/**/*.scss'])
		.pipe(plumber(plumberErrorHandler))
		.pipe(compass({
			require: ['susy'],
			css: destAssets.styles,
			sass: srcAssets.styles,
			image: destAssets.img,
		    sourcemap: true
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(destAssets.styles))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest(destAssets.styles));
});

//scripts
gulp.task('scripts', function() {
	return gulp.src(srcAssets.scripts +'/**/*.js')
		.pipe(plumber(plumberErrorHandler))
		.pipe(concat('main.js'))
		.pipe(gulp.dest(destAssets.scripts))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(destAssets.scripts));
});
// assets
gulp.task('templates', function() {
	return gulp.src(srcAssets.templates +'/**/*')
		.pipe(plumber(plumberErrorHandler))
		.pipe(gulp.dest('html'));
});

// images
gulp.task('images', function() {
	return gulp.src(srcAssets.images +'/**/*')
		.pipe(plumber(plumberErrorHandler))
		.pipe(gulp.dest(destAssets.images));
});

//watch
gulp.task('live', function() {
	livereload.listen();

	//watch .scss files
	gulp.watch(srcAssets.styles + '/**/*.scss', ['styles']);

	//watch .js files
	gulp.watch(srcAssets.scripts + '/**/*.js', ['scripts']);

	//watch templates files
	gulp.watch(srcAssets.templates + '/**/*', ['templates']);

	// Watch image files
  	gulp.watch(srcAssets.images + '/**/*', ['images']);

	//reload when a template file, the minified css, or the minified js file changes
	gulp.watch(['html/*', 'html/css/styles.css', 'html/js/main.js'], function(event) {
		gulp.src(event.path)
			.pipe(plumber())
			.pipe(livereload())
			.pipe(notify({
				title: notifyInfo.title,
				icon: notifyInfo.icon,
				message: event.path.replace(__dirname, '').replace(/\\/g, '/') + ' was ' + event.type + ' and reloaded'
			})
		);
	});
});