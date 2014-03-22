/*
 * class
 * https://github.com/crossjs/class
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var transport = require('grunt-cmd-transport');
  var style = transport.style.init(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['src/*.js'],
      options: {
        jshintrc: true
      }
    },

    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          src: ['src/*.js'],
          instrumentedFiles: 'temp/',
          htmlReport: 'report/coverage',
          coberturaReport: 'report/',
          linesThresholdPct: 85
        }
      },
      all: ['test/*.html']
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          paths: 'src',
          outdir: 'doc',
          themedir: 'vendor/yuidoc-bootstrap'
        }
      }
    },

    clean: {
      pages: {
        files: {
          src: ['gh-pages/**', '!.git/', '!.gitignore']
        }
      },
      doc: {
        files: {
          src: ['doc/**']
        }
      },
      dist: {
        files: {
          src: ['dist/**']
        }
      },
      build: {
        files: {
          src: ['.build']
        }
      }
    },

    copy: {
      doc: {
        files: [ {expand: true, cwd: 'doc/', src: ['**'], dest: 'gh-pages/'} ]
      }
    },

    wrap: {
      css: {
        cwd: 'src/',
        expand: true,
        src: ['*.css'],
        dest: 'src/',
        options: {
          separator: '',
          compiler: function (content, options) {
            return ['\'', content
              .replace(/[\n\r]/g, '')
              .replace(/\t/g, '')
              .replace(/:\s+/g, ':')
              .replace(/\s+\{/g, '{')
              .replace(/\\/g, '\\\\'), '\''].join('');
          },
          wrapper: ['define(', ');']
        },
        ext: '.css.js'
      }
    },

    transport: {
      options: {
        debug: true,
        idleading: '<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/',
        alias: '<%= pkg.spm.alias %>'
      },
      js: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js', '!*.css.js'],
          dest: '.build/'
        }]
      },
      handlebars: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.handlebars'],
          dest: '.build/'
        }]
      },
      css: {
        options: {
          parsers: {
            '.css' : [style.css2jsParser]
          }
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.css'],
          dest: '.build/'
        }]
      }
    },

    concat: {
      options: {
        debug: true,
        include: 'relative',
        css2js: transport.style.css2js
      },
      src: {
        files: [{
          expand: true,
          cwd: '.build/',
          src: ['*.js'],
          dest: 'dist/'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        beautify: {
          'ascii_only': true
        },
        // mangle: true,
        compress: {
          'global_defs': {
            'DEBUG': false
          },
          'dead_code': true
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['*.js', '!*-debug*.js'],
          dest: 'dist/'
        }]
      }
    }

  });

  grunt.registerTask('build', ['clean:dist', 'transport', 'concat', 'clean:build', 'uglify']);

  grunt.registerTask('doc', ['yuidoc', 'clean:pages', 'copy', 'clean:doc']);

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['test', 'doc', 'build']);

};
