let work_folder = 'app';
let project_folder = 'dist';

let path = {
    src: {
        html: [work_folder + '/*.html', '!' + work_folder + '/_*.html'],
        scss: work_folder + '/scss/style.scss',
        js: work_folder + '/js/scripts.js',
        image: work_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts: work_folder + '/fonts/**/*'
    },
    build: {
        html: project_folder + '/',
        css: project_folder + '/css/',
        js: project_folder + '/js/',
        image: project_folder + '/img/',
        fonts: project_folder + '/fonts/'
    },
    watch: {
        html: work_folder + '/**/*.html',
        css: work_folder + '/scss/*.scss',
        js: work_folder + '/js/**/*.js',
        img: work_folder + '/**/*.{jpg,png,svg,gif,ico,webp}'
    },
    clean: `./${project_folder}/`,
}

let { src, dest, prependListener } = require('gulp'),
    gulp = require('gulp'),
    browsersynk = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    groupmedia = require('gulp-group-css-media-queries');

function browserSynk(params) {
    browsersynk.init({
        server: {
            baseDir: './' + project_folder + '/'
        },
        port: 3000,
        notify: false,
    })
}

function clean() {
    return del(path.clean);
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersynk.stream())
}

function css() {
    return src(path.src.scss)
        .pipe(scss({
            outputStyle: 'expanded'
        }))
        .pipe(groupmedia())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersynk.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersynk.stream())
}

function image() {
    return src(path.src.image)
        .pipe(dest(path.build.image))
        .pipe(browsersynk.stream())
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], image);
}

let build = gulp.series(clean, gulp.parallel(html, css, js, image, fonts));
let watch = gulp.parallel(build, watchFiles, browserSynk)

exports.build = build;
exports.watch = watch;
exports.default = watch;