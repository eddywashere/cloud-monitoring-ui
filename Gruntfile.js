'use strict';

var fs = require('fs');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Create a restart.txt file
  fs.writeFileSync('.rebooted', 'rebooted');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      cdnContainer: '',
      cdnUrl: '',
      dist: 'dist',
      pkg: grunt.file.readJSON('package.json')
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      server: {
        files:  [ '.rebooted' ],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['<%= yeoman.app %>/**/*.html', '<%= yeoman.app %>/**/*.ejs'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '35729'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/{,*/}*.ejs',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ignore: ['server/**/*.ejs'],
          watch: ['server'],
          env: {
            PORT: '8000',
            DEBUG: 'app'
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
            // refreshes browser when server reboots
            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function() {
                fs.writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>'
          ]
        }]
      },
      removeBower: {
        files: [{
          dot: true,
          src: ['<%= yeoman.dist %>/bower_components']
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.ejs'],
        ignorePath: '<%= yeoman.app %>/'
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: '<%= yeoman.app %>/bower_components/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n',
        bundleExec:true
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {

      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/*.ejs',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html', '<%= yeoman.dist %>/{,*/}*.ejs'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.ejs', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.ejs']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.ejs',
            'views/{,*/}*.html',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      deploy: {
        expand: true,
        dest: '.tmp/deploy',
        src: ['package.json', 'app/**/*', 'dist/**/*', 'server/**/*', 'server.js']
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      express: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    cdn: {
      options: {
        /** @required - root URL of your CDN (may contains sub-paths as shown below) */
        cdn: '<%= yeoman.cdnUrl %>/<%= yeoman.pkg.version %>/',
        /** @optional  - if provided both absolute and relative paths will be converted */
        flatten: true,
        /** @optional  - if provided will be added to the default supporting types */
        supportedTypes: { 'ejs': 'html' }
      },
      dist: {
        /** @required  - string (or array of) including grunt glob variables */
        src: ['<%= yeoman.dist %>/*.ejs']
      }
    },

    // TODO - headers shouldn't override what pkgcloud does. create pr for merging upload.headers with default mime-type headers
    cloudfiles: {
      dist: {
        user: process.env.RACKSPACE_USERNAME,
        key: process.env.RACKSPACE_API_KEY,
        region: 'DFW',
        upload: [{
          container: '<%= yeoman.cdnContainer %>',
          src: ['dist/**/*', '!dist/**/*.html', '!dist/*.ejs'],
          dest: '<%= yeoman.pkg.version %>/',
          stripcomponents: 1
        }]
      },
      html: {
        user: process.env.RACKSPACE_USERNAME,
        key: process.env.RACKSPACE_API_KEY,
        region: 'DFW',
        upload: [{
          container: '<%= yeoman.cdnContainer %>',
          src: ['dist/**/*.html'],
          dest: '<%= yeoman.pkg.version %>/', // TODO - make this a variable
          stripcomponents: 1,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/html'
          }
        }]
      }
    },

    'git_deploy': {
      heroku: {
        options: {
          url: 'git@heroku.com:cloud-images-ui.git',
          branch: 'master',
          message: 'Grunt Deployment'
        },
        src: '.tmp/deploy'
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function () {

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'concurrent:express'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'nodemon:test',
    'karma'
  ]);

  grunt.registerTask('build', function (target) {
    grunt.task.run([
      'clean:dist',
      'bowerInstall',
      'useminPrepare',
      'concurrent:dist',
      'autoprefixer',
      'concat',
      'ngmin',
      'copy:dist',
      'cdnify',
      'cssmin',
      'uglify',
      'rev',
      'usemin',
      'htmlmin',
      'clean:removeBower'
    ]);

    if (target === 'cdn') {
      grunt.task.run(['cloudfiles','cdn']);
    }
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('deploy:heroku', [
    'clean:server',
    'copy:deploy',
    'git_deploy:heroku',
    'clean:dist'
  ]);
};
