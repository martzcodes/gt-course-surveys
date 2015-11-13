module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
    
    jshint: {
      all: [ './Gruntfile.js', './app/assets/js/*.js', './app/assets/js/**/*.js' ]
    },

    copy: {
      app: {
        files: [
          { src: [ './node_modules/jquery/dist/jquery.min.js' ],                      dest: './tmp/js/vendor/jquery.min.js' },
          { src: [ './node_modules/angular/angular.min.js' ],                         dest: './tmp/js/vendor/angular.min.js' },
          { src: [ './node_modules/angular-animate/angular-animate.min.js' ],         dest: './tmp/js/vendor/angular-animate.min.js' },
          { src: [ './node_modules/angular-messages/angular-messages.min.js' ],       dest: './tmp/js/vendor/angular-messages.min.js' },
          { src: [ './node_modules/angular-route/angular-route.min.js' ],             dest: './tmp/js/vendor/angular-route.min.js' },
          { src: [ './node_modules/angular-resource/angular-resource.min.js' ],       dest: './tmp/js/vendor/angular-resource.min.js' },
          { src: [ './node_modules/angular-gravatar/build/angular-gravatar.min.js' ], dest: './tmp/js/vendor/angular-gravatar.min.js' },
          { src: [ './node_modules/angular-toastr/dist/angular-toastr.tpls.min.js' ], dest: './tmp/js/vendor/angular-toastr.tpls.min.js' },
          { src: [ './node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.min.js' ],  dest: './tmp/js/vendor/angular-ui-bootstrap.tpls.min.js' },
          { src: [ './node_modules/bootstrap/dist/js/bootstrap.min.js' ],             dest: './tmp/js/vendor/bootstrap.min.js' },
          { src: [ './node_modules/moment/min/moment.min.js' ],                       dest: './tmp/js/vendor/moment.min.js' },
          { src: [ './bower_components/firebase/firebase.js' ],                       dest: './tmp/js/vendor/firebase.min.js' },
          { src: [ './bower_components/angularfire/dist/angularfire.min.js' ],        dest: './tmp/js/vendor/angular-fire.min.js' },

          { src: [ './node_modules/normalize-css/normalize.css' ],                    dest: './tmp/css/vendor/normalize.css' },
          { src: [ './node_modules/angular-toastr/dist/angular-toastr.min.css' ],     dest: './tmp/css/vendor/angular-toastr.min.css' },
          { src: [ './node_modules/bootstrap/dist/css/bootstrap.min.css' ],           dest: './tmp/css/vendor/bootstrap.min.css' },
          { src: [ './node_modules/bootstrap/dist/css/bootstrap-theme.min.css' ],     dest: './tmp/css/vendor/bootstrap-theme.min.css' },

          {
            expand: true,
            flatten: true,
            src: [ './node_modules/bootstrap/dist/fonts/**' ],
            dest:  './app/dist/fonts/',
            filter: 'isFile'
          }
        ]
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: false
      },
      app: {
        files: [
          {
            src: [ './app/assets/css/*.css' ],
            dest:  './tmp/css/surveyor.min.css'
          },
          {
            src: [ './tmp/css/vendor/normalize.css' ],
            dest:  './tmp/css/vendor/normalize.min.css'
          }
        ]
      }
    },

    ngAnnotate: {
      app: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              './app/assets/js/directives/*.js',
              './app/assets/js/controllers/*.js',
              './app/assets/js/filters/*.js',
              './app/assets/js/services/*.js'
            ],
            dest: './tmp/js/supporting/'
          },
          {
            expand: true,
            flatten: true,
            src: [ './app/assets/js/*.js' ],
            dest:  './tmp/js/'
          }
        ]
      }
    },

    uglify: {
      options: {
        mangle: true,
        preserveComments: false
      },
      app: {
        files: [
          {
            src: [
              './tmp/js/app.js',
              './tmp/js/routes.js',
              './tmp/js/supporting/*.js'
            ],
            dest:  './tmp/js/surveyor.min.js'
          }
        ]
      }
    },

    concat: {
      options: {
        separator: '\n'
      },
      app: {
        files: [
          {
            src: [
              './tmp/css/vendor/normalize.min.css',
              './tmp/css/vendor/bootstrap.min.css',
              './tmp/css/vendor/bootstrap-theme.min.css',
              './tmp/css/vendor/angular-toastr.min.css',
              './tmp/css/surveyor.min.css',
            ],
            dest: './app/dist/css/main.css'
          },
          {
            src: [
              './tmp/js/vendor/jquery.min.js',
              './tmp/js/vendor/angular.min.js',
              './tmp/js/vendor/angular-animate.min.js',
              './tmp/js/vendor/angular-messages.min.js',
              './tmp/js/vendor/angular-route.min.js',
              './tmp/js/vendor/angular-resource.min.js',
              './tmp/js/vendor/angular-gravatar.min.js',
              './tmp/js/vendor/angular-toastr.tpls.min.js',
              './tmp/js/vendor/angular-ui-bootstrap.tpls.min.js',
              './tmp/js/vendor/bootstrap.min.js',
              './tmp/js/vendor/moment.min.js',
              './tmp/js/vendor/firebase.min.js',
              './tmp/js/vendor/angular-fire.min.js',
              './tmp/js/vendor/angular-geolocation.min.js',
              './tmp/js/surveyor.min.js'
            ],
            dest: './app/dist/js/main.js'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('default', [ 'jshint', 'copy', 'cssmin', 'ngAnnotate', 'uglify', 'concat' ]);
};