module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    devPath: '',
    distPath: '../static/',

    jshint: {
      files: ['Gruntfile.js', 'js/main.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'style/main.css': 'style/main.scss',
          '<%= distPath %>css/main.css': 'style/main.scss'
        }
      }
    },
    watch: {
      css: {
          files: ['style/*.scss'],
          tasks: ['sass']
      },
      js: {
          files: ['js/*.js','js/**/*.js'],
          tasks: ['jshint', 'requirejs', 'ngAnnotate:app', 'uglify:app']
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "js",
          out: "<%= distPath %>js/main.js",
          name: "main",
          mainConfigFile : "js/config.js"
        }
      }
    },
    grunticon: {
      myIcons: {
        files: [{
            expand: true,
            cwd: 'img/icons',
            src: ['*.svg', '*.png'],
            dest: '<%= distPath %>img/icons/'
        }],
        options: {
          
          colors: {
              darkGray: "#aaaaaa",
              lightGray: "#cccccc",
              white: "#ffffff",
              black: "#000000"
          },
          customselectors: {
              "check-white": [".btn-save"],
              "plus-white": [".btn-add"],
              "edit-white": [".btn-edit"]
          }
        }
      }
    },
    ngAnnotate: {
        app: {
            files: {
                '<%= devPath %>js/invoicifyApp.js': 
                [
                '<%= devPath %>js/vendor/angular.js',
                '<%= devPath %>js/angular/invoicifyApp.js', 
                '<%= devPath %>js/angular/controllers/invoicifyController.js',
                ]
            },
        }
    },
    uglify: {
        app: {
            files: {
                '<%= distPath %>js/invoicifyApp.min.js': 
                [
                '<%= devPath %>js/invoicifyApp.js'
                ]
            }
        }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  
  grunt.registerTask('default', ['jshint', 'sass', 'requirejs', 'ngAnnotate:app', 'uglify:app']);
  

};