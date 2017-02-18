'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import conf from '../conf';

const TASKS = [{
  name: 'config:local',
  dependencies: [{
    name: 'config:constants:local',
    src: `${conf.paths.config}/local/index.constants.js`,
    dest: `${conf.paths.src}/app/`
  }]
}, {
  name: 'config:staging',
  dependencies: [{
    name: 'config:constants:staging',
    src: `${conf.paths.config}/staging/index.constants.js`,
    dest: `${conf.paths.src}/app/`
  }]
}, {
  name: 'config:production',
  dependencies: [{
    name: 'config:constants:production',
    src: `${conf.paths.config}/production/index.constants.js`,
    dest: `${conf.paths.src}/app/`
  }]
}];

TASKS.forEach((task) => {
  task.dependencies.forEach((d) => {
    gulp.task(d.name, () =>
      gulp.src(d.src).pipe(gulp.dest(d.dest, { overwrite: true })));
  });

  gulp.task(task.name, _.map(task.dependencies, 'name'));
});
