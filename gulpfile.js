const { src, dest, watch, series, task } = require('gulp')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const tsProject = ts.createProject('tsconfig.json')
const del = require('del')

function clean(cb) {
  return del(['dist'], cb)
}

function toJs() {
  return src('server/**/*.ts').pipe(tsProject()).pipe(dest('dist'))
}

function runNodemon() {
  nodemon({
    inspect: true,
    script: 'server/app.ts',
    watch: ['server'],
    ext: 'ts',
    env: { NODE_ENV: 'development' },
  }).on('crash', () => {
    console.error('Application has crashed!\n')
  })
}

const build = series(clean, toJs)
task('build', build)

exports.build = build
exports.default = runNodemon
