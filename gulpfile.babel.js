import del from 'del'
import gulp from 'gulp'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import ejs from 'gulp-ejs'
import watch from 'gulp-watch'
import run from 'run-sequence'
import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import highlight from 'gulp-highlight'
import packageJson from './package.json'

gulp.task('clean', (cb) => {
  return del([
    './docs',
  ], cb)
})

gulp.task('css', () => {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer,
      cssnano,
    ]))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./docs/css'))
    .pipe(browserSync.stream())
})

gulp.task('template', () => {
  return gulp
    .src([
      './src/templates/*.ejs',
    ])
    .pipe(ejs({
      title: 'CONSTRUCT',
      version: packageJson['version'],
      components: [
        'heading',
        'link',
        'quote',
        'button',
        'badge',
        'note',
        'table',
        'list',
        'card',
        'avator',
        'breadcrumb',
        'input',
        'textarea',
        'selectbox',
        'checkbox',
        'radio',
        'menu',
        'media-card',
        'pagination',
        'tag',
        'loader',
        'divider',
      ],
      objects: [
        'grid',
        'inline-list',
        'container',
        'footer',
        'headbar',
        'hero',
        'main',
        'media-card',
        'sidebar',
        'wrapper',
      ],
    },
    {
      ext: '.html',
    }))
    .pipe(highlight())
    .pipe(gulp.dest('./docs'))
    .pipe(browserSync.stream())
})

gulp.task('serve', () => {
  run('clean', ['template', 'css'], () => {
    browserSync.init({
      server: './docs',
      open: false,
    })
  })

  gulp
    .watch(['./docs/*.html'])
    .on('change', browserSync.reload)

  gulp.watch(['./src/templates/**/*.ejs'], ['template'])
  gulp.watch(['./src/scss/**/*.scss'], ['css'])
})

gulp.task('build', () => {
  run('clean', ['css'])
})

gulp.task('doc', () => {
  run('clean', ['template', 'css'])
})

gulp.task('default', ['clean'])

