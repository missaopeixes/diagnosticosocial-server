const gulp = require('gulp');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');

const tsMainProject = ts.createProject('tsconfig.json');
const tsMigrationProject = ts.createProject('src/database/config/ts-migrations.json');

const ASSETS_FILES = ['src/*.json', 'src/**/*.json', 'src/**/*.html'];

gulp.task('assets', function() {
  return gulp.src(ASSETS_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', gulp.series('assets', () => {
  return gulp.src('src/**/*.ts')
    .pipe(tsMainProject())
    .pipe(gulp.dest('dist'));
}));

gulp.task('compile-migrations', () => {
  gulp.src('src/database/migrations/*.ts')
    .pipe(tsMigrationProject())
    .pipe(gulp.dest('src/database/migrations/compiled'));
});

gulp.task('watch', gulp.series('scripts', () => {
  gulp.watch('src/**/*.ts', gulp.series('scripts'));
}));

gulp.task('serve', (cb) => {
  nodemon({
    script: 'dist/server.js',
    watch: ['dist/server.js']
  });
});

gulp.task('default', gulp.series('scripts'));