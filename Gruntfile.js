
var spawn = require('child_process').spawn;

module.exports = function(grunt) {

  grunt.initConfig({

    clean: [
      '_allDbs',
      '_pouch_*',
      'testdb_*',
      'test_suite_*'
    ],

    test: {
      pouchdb: {
        cmd: 'grunt',
        root: './node_modules/express-pouchdb/node_modules/pouchdb',
        args: ['node-qunit']
      },
      couchdb: {
        cmd: './bin/couchdb-harness',
        root: './node_modules/couchdb-harness',
        args: []
      }
    }

  });

  grunt.registerMultiTask('test', function () {
    var cmd = this.data.cmd
      , args = this.data.args
      , files = Array.prototype.slice.call(arguments, 0)
      , done = this.async()
      , task;

    if (this.target === 'couchdb') {
      args = args.concat(files);
    }

    task = spawn(cmd, args, { cwd: this.data.root });

    task.stdout.on('data', function (data) {
      grunt.log.write(data.toString());
    });

    task.stderr.on('data', function (data) {
      grunt.log.write(data.toString());
    });

    task.on('exit', function (code) {
      grunt.task.run('clean');
      done(!code);
    });
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['test']);

};
