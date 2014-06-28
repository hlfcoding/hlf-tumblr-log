matchdep = require 'matchdep'

module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    autoprefixer:
      options:
        browsers: ['last 2 versions', 'ie 9']
        cascade: yes
      src:
        expand: yes
        src: 'release/**/*.css'
        ext: '.css'
        extDot: 'last'
    bower:
      install:
        options:
          cleanBowerDir: yes
          cleanTargetDir: no
          copy: yes
          install: yes
          layout: (type, component) -> type # Just the file.
          targetDir: './lib'
          verbose: yes
    bump:
      options:
        files: [
          'bower.json'
          'package.json'
        ]
        commitFiles: ['.']
        pushTo: 'origin'
    clean:
      lib: [
        'lib/*'
        '!lib/custom'
        '!lib/.gitignore'
      ]
      release: [
        'release/*'
      ]
    coffee:
      src:
        expand: yes
        src: 'src/**/*.coffee'
        dest: 'release/'
        ext: '.js'
        extDot: 'last'
        flatten: yes
    copy:
      release:
        expand: yes
        src: 'lib/**/*.css'
        dest: 'release/'
        extDot: 'last'
        flatten: yes
    sass:
      src:
        expand: yes
        src: 'src/**/*.scss'
        dest: 'release/'
        ext: '.css'
        extDot: 'last'
        flatten: yes
    watch:
      # Caveat: These watch tasks do not clean.
      css:
        files: 'src/**/*.scss'
        tasks: ['sass', 'autoprefixer']
      js:
        files: 'src/**/*.coffee'
        tasks: ['coffee']

  grunt.loadNpmTasks plugin for plugin in matchdep.filterDev 'grunt-*'

  grunt.registerTask 'default', [
    'lib'
    'release'
    'watch'
  ]

  grunt.registerTask 'lib', [
    'clean:lib'
    'bower'
  ]

  grunt.registerTask 'release', [
    'clean:release'
    'copy:release'
    'coffee'
    'sass'
    'autoprefixer'
  ]
