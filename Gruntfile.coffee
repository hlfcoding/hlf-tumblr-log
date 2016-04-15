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
      options: { sourceMap: yes }
      src:
        src: 'src/theme.coffee'
        dest: 'release/theme.js' 
    copy:
      release:
        src: 'lib/hlf-css/_helpers.scss'
        dest: 'release/helpers.css'
    sass:
      src:
        src: 'src/theme.scss'
        dest: 'release/theme.css'
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
    'release'
    'watch'
  ]

  grunt.registerTask 'release', [
    'clean:release'
    'copy:release'
    'coffee'
    'sass'
    'autoprefixer'
  ]
