var gulp = require('gulp');
var fileExists = require('file-exists');
var rename = require('gulp-rename');

var configFiles = [
  {
    dest: './src/databases/',
    file: 'config-default.json',
    copy: 'config-local.json'
  }
]

function generateLocalConfigurations(cb, force) {

  if(!configFiles.length) {
    console.log("error: empty configuration array");
    cb();
  }

  configFiles.forEach(function(paths, key) {
    var lastItem = key=1 === configFiles.length;
    var messages = [];
    var file = paths.dest + paths.file;

    fileExists(file).then(exists => {
      if(exists) {
        fileExists(paths.dest + paths.copy).then(localExsists => {
          if(force || !localExsists) {
            gulp.src(file)
                .pipe(gulp.dest(paths.dest))
                .pipe(rename(paths.copy))
                .pipe(gulp.dest(paths.dest));

            console.log((localExsists ? "replaced: " : "created: ") + paths.copy)
          }
          else {
            console.log("jump:" + paths.copy);
          }

          if(lastItem) { cb() }
        });
      }
      else {
        console.log("missed: " + paths.file)
        if(lastItem) { cb() }
      }
    });
  });
}

gulp.task(':gen-config', function(cb) {
  generateLocalConfigurations(cb, false);
});

gulp.task(':gen-config-force-replace', function(cb) {
  generateLocalConfigurations(cb, true);
});
