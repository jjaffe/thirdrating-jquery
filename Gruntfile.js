// set timer
var timer = require("grunt-timer");

module.exports = function(grunt) {

    timer.init(grunt);

    //var pkg = require("./package.json");

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            all: ['Gruntfile.js', 'js/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        
          uglify: {
            options: {
              mangle: true,
              compress: true,
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
              files: {
                './thirdrating-jquery.min.js': ['js/thirdrating-jquery.js'],
                './thirdrating-jquery.min.css': ['css/thirdrating-jquery.css']
              }
            }
          }
        
    });

    // By default, check syntax
    
    grunt.registerTask('default', ['jshint', 'uglify:build']);


};
