/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    // useminPrepare: {
    //   html: './public/index.html',
    //   options: {
    //     dest: './build'
    //   }
    // },
    // usemin: {
    //   html: ['build/index.html']
    // },
    // copy: {
    //   task0: {
    //     src: './public/index.html',
    //     dest: './build/index.html'
    //   }
    // }
    pkg: grunt.file.readJSON('package.json'),

    clean: ['build', '.tmp', 'dist'],

    dirs: {
      //src: ['./public/js/config/*.js', './public/js/factories/*.js', './public/js/controllers/*.js', './public/js/directives/*.js']
      src: './public/js/config/app.js'
    },

    copy: {
        main: {
            expand: true,
            cwd: 'public/',
            src: ['**', '!js/**', '!css/**','!**/*.css', '!bower_components/**', 'images/**'],
            dest: 'build/'
        },
        shims: {
            expand: true,
            cwd: 'public/bower_components/webshim/js-webshim/dev/shims/',
            src: ['**'],
            dest: 'build/js/shims'
        }
    },

    rev: {
        files: {
            src: ['build/**/*.{js,css}', 'build/images/*.{jpg,png}','!build/js/shims/**']
        }
    },

    useminPrepare: {
        html: 'public/index.html',
        options: {
          dest: 'build'
          // flow: {
          //   html: {
          //     steps: {'js': ['concat:prod', 'uglifyjs']},
          //     post: {}
          //   }
          // }
        }
    },

    usemin: {
        html: ['build/index.html']
    }, 

    concat: {
      dev: {
        dest: 'public/js/main.js',
        src: ['./public/js/config/*.js', './public/js/factories/*.js', './public/js/controllers/*.js', './public/js/directives/*.js']
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
      beforeconcat: ['<%= concat.dev.src %>'],
      afterconcat: ['<%= concat.dev.dest %>']
    },

    watch: {
      options: {
        livereload: true
      },
      scripts: {
        //files: ['./public/{,**/}*.js'],
        // files: ['<%= concat.dev.src =>'],
        files: ['<%= concat.dev.src %>'],
        tasks: ['jshint:beforeconcat', 'concat:dev', 'jshint:afterconcat']
      },
      css: {
        files: ['public/css/*.css']
      },
      html: {
        files: ['public/{,**/*.html}']
      }
    },

    concurrent: {
      dev: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['watch', 'nodemon:dev']
      }
    },

    nodemon: {
      dev: {
        script: 'app.js',
        options: {
            args: [],
            ignore: ['public/bower_components/**', 'routes/**', 'views/**', 'node_modules/**'],
            ext: 'js,html,css',
            nodeArgs: ['--debug'],
            delayTime: 1,
            env: {
                PORT: 3000
            },
            cwd: __dirname
        }
      }
    }

    // express: {
    //   options: {
    //     // Override defaults here
    //   },

    //   dev: {
    //     options: {
    //       script: 'app.js'
    //     }
    //   }
    // }

    // uglify: {
    //   my_target: {
    //     options: {
    //         report: 'min',
    //         mangle: false
    //     },
    //     files: {
    //       'build/js/output.min.js': ['.tmp/concat/js/app.js']
    //     }
    //   }
    // },

    // cssmin: {
    //    files: {
    //     'build/css/': ['.tmp/concat/css/main.css']
    //   }
    // }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');

  // Default task.
  grunt.registerTask('default', ['express:dev', 'watch']);

  grunt.registerTask('dev', ['concurrent:dev']);

  grunt.registerTask('build', [
        'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin'
    ]);

};
