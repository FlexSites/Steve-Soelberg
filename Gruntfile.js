module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            local: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'public/css/style.css': ['public/scss/style.scss']
                }
            },
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'public/css/style.css': ['public/scss/style.scss']
                }
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'public/css/style.css': ['public/scss/style.scss']
                }
            }
        },
        concat: {
            local: {
                src: [
                    '../global/partials/ngHead.html',
                    'index.html',
                    '../global/partials/foot.html'
                ],
                dest: 'public/index.html',
            },
            dev: {
                src: [
                    '../global/partials/ngHead.html',
                    'index.html',
                    '../global/partials/foot.html'
                ],
                dest: 'public/index.html',
            },
            prod: {
                src: [
                    '../global/partials/ngHead.html',
                    'index.html',
                    '../global/partials/foot.html'
                ],
                dest: 'public/index.html',
            }
        },
        // Uglify for development JS combination
        uglify: {
            local: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },

                files: {
                    'public/ng/min/global.js': [
                        '../global/public/ng/lib/angular.min.js',
                        '../global/public/ng/lib/angular-route.min.js',
                        'public/ng/global.js'
                    ],
                    'public/ng/global.js': [
                        '../global/public/ng/lib/angular.min.js',
                        '../global/public/ng/lib/angular-route.min.js',
                        'public/ng/global.js'
                    ]
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },

                files: {
                    'public/ng/min/global.js': [
                        '../global/public/ng/lib/angular.min.js',
                        '../global/public/ng/lib/angular-route.min.js',
                        'public/ng/global.js'
                    ],
                    'public/ng/global.js': [
                        '../global/public/ng/lib/angular.min.js',
                        '../global/public/ng/lib/angular-route.min.js',
                        'public/ng/global.js'
                    ]
                }
            },
            prod: {
                options: {
                    mangle: true,
                    compress: true,
                    beautify: false
                },

                files: {
                    'public/ng/min/global.js': [
                        '../global/public/ng/lib/angular.min.js',
                        '../global/public/ng/lib/angular-route.min.js',
                        'public/ng/global.js'
                    ],
                    'public/ng/global.js': [
                        '../global/public/ng/lib/angular.min.js',
                        '../global/public/ng/lib/angular-route.min.js',
                        'public/ng/global.js'
                    ]
                }
            }
        },
        // Closure compiler for production JS minification
        'closure-compiler': {
            global: {
                closurePath: '/comedian/app',
                js: [
                    '../global/public/ng/lib/angular.min.js',
                    '../global/public/ng/lib/angular-route.min.js',
                    'public/ng/global.js'
                ],
                jsOutputFile: 'public/ng/min/global.js',
                maxBuffer: 500,
                options: {
                    // compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    // language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },

        watch: {
            dev: {
                tasks: ['uglify', 'sass:dev', 'concat:prod', 'hogan'],
                files: [
                    'public/scss/style.scss',
                    'public/scss/partials/*.scss',
                    'public/ng/*.js',
                    'public/js/*.js',
                    'config.json',
                    'routes.json'
                ],
                options: {
                    atBegin: true,
                    spawn: false,
                    debounceDelay: 250,
                    livereload: 35731
                }
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-closure-compiler');


    //grunt.registerTask('default',['watch:actionItems']);

    grunt.registerTask('build', 'Run all my build tasks.', function(env) {
      if (env && (env == 'prod' || env == 'dev' || env == 'local')) {
        grunt.task.run('sass:' + env, 'concat:' + env, 'hogan:' + env, 'uglify:' + env);
      }
      else {
        grunt.warn('Build environment invalid. Must be prod, dev, or local.');
      }
    });

    // For compiling hogan.js/mustache 
    function hoganRender(env,done){
        
        var hogan = require('hogan.js');
        var clc = require('cli-color');
        var fs = require('fs');
        var async = require('async');

        var filenames = [{src:'public/index.html', dest:'public/index.html'}, {src:'public/ng/src/global.js', dest:'public/ng/global.js'}];
        var config = require('./config.json');
        config.routes = JSON.stringify(require('./routes.json'));
        config.env = env;

        async.each(filenames, function( file, callback) {
            fs.readFile(file.src, 'utf8', function(err, data) {
                var tmpl = hogan.compile(data, {
                    delimiters: '<@ @>'
                });
                fs.writeFile(file.dest, tmpl.render(config), function(err, data) {
                    if (err) {
                        throw new Error('Failed to save ' + file.dest)
                    } else {
                        done();
                    }
                });
            });
        });

    }
    
    grunt.registerTask('hogan:local', 'Compiles mustache syntax templates', function(){
        hoganRender('local',this.async());
    });
    grunt.registerTask('hogan:dev', 'Compiles mustache syntax templates', function(){
        hoganRender('test',this.async());
    });
    grunt.registerTask('hogan:prod', 'Compiles mustache syntax templates', function(){
        hoganRender('',this.async());
    });

};
