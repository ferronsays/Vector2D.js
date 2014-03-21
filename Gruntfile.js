module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
          build: {
            src: 'Vector2D.js',
            dest: 'Vector2D.min.js'
          }
        },
        watch: {
          scripts: {
            files: ['*.js'],
            tasks: ['uglify'],
            options: {
              spawn: false,
            },
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify', 'watch']);

};
