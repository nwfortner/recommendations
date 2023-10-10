module.exports = (grunt) => {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /*
    eslint: {
      options: {},
      target: ['<%= watch.server.files %>']
    },
    */
    watch: {
      server: {
        files: [
          '*.js',
          'modules/*.js',
          'shared/*.js',
        ],
        tasks: ['monitor:server'],
        options: {
          spawn: false,
        },
      },
    },
    concurrent: {
      server: {
        tasks: ['monitor:server', 'watch:server'],
        options: {
          logConcurrentOutput: true,
        },
      },
    },
    monitor: {
      server: {
        options: {
          script: 'index.js',
          timeout: 4,
          ignoreLogs: 0,
          logsPerConnect: 1,
          nodes: 1,
          environmentVariables: '', // ie 'ENVIRONMENT=production',
          nodeArgs: '', // ie '--harmony --debug'
          scriptArgs: '',
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-server-monitor');

  grunt.registerTask('default', ['concurrent:server']);
};
