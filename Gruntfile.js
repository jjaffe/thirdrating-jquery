// set timer
var timer = require("grunt-timer");

module.exports = function(grunt) {

    timer.init(grunt);

    //var pkg = require("./package.json");

    grunt.loadNpmTasks('grunt-contrib-jshint');
    

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            all: ['Gruntfile.js', 'js/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        }
    });

    // By default, check syntax
    
    grunt.registerTask('default', ['jshint']);


};
