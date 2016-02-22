/* jslint es3: false */
/* global module:false, console:false, process:false */

module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        /*----------------------------------( PACKAGE )----------------------------------*/

        /**
         * The `package.json` file belongs in the root directory of your project,
         * next to the `Gruntfile`, and should be committed with your project
         * source. Running `npm install` in the same folder as a `package.json`
         * file will install the correct version of each dependency listed therein.
         *
         * Install project dependencies with `npm install` (or `npm update`).
         *
         * @see http://gruntjs.com/getting-started#package.json
         * @see https://npmjs.org/doc/json.html
         * @see http://package.json.nodejitsu.com/
         * @see http://stackoverflow.com/a/10065754/922323
         */

        pkg: grunt.file.readJSON('package.json'),

        /*----------------------------------( BANNERS )----------------------------------*/

        /**
         * Short and long banners.
         *
         * @see http://gruntjs.com/getting-started#an-example-gruntfile
         */

        banner: {

            'short': '/*! ' +
                '<%= pkg.title || pkg.name %>' +
                '<%= pkg.version ? " v" + pkg.version : "" %>' +
                '<%= pkg.licenses ? " | " + _.pluck(pkg.licenses, "type").join(", ") : "" %>' +
                '<%= pkg.homepage ? " | " + pkg.homepage : "" %>' +
                ' */',

            'long': '/**\n' +
                ' * <%= pkg.title || pkg.name %>\n' +
                '<%= pkg.description ? " * " + pkg.description + "\\n" : "" %>' +
                ' *\n' +
                '<%= pkg.author.name ? " * @author " + pkg.author.name + "\\n" : "" %>' +
                '<%= pkg.author.url ? " * @link " + pkg.author.url + "\\n" : "" %>' +
                '<%= pkg.homepage ? " * @docs " + pkg.homepage + "\\n" : "" %>' +
                ' * @copyright Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>.\n' +
                '<%= pkg.licenses ? " * @license Released under the " + _.pluck(pkg.licenses, "type").join(", ") + ".\\n" : "" %>' +
                '<%= pkg.version ? " * @version " + pkg.version + "\\n" : "" %>' +
                ' * @date <%= grunt.template.today("yyyy/mm/dd") %>\n' +
                ' */\n\n'

        },

        /*----------------------------------( VERSIONING )----------------------------------*/

        /**
         * Build date and version.
         *
         * @see http://tanepiper.com/blog/2012/11/25/building-and-testing-javascript-with-gruntjs/
         * @see http://blog.stevenlevithan.com/archives/date-time-format
         */

        now: grunt.template.today('yyyymmdd'), // Alternative: yyyymmddhhMMss

        ver: 1, // Increment if more than one build is needed in a single day.

        /*----------------------------------( BOWER )----------------------------------*/

        /**
         * Install Bower packages. Smartly.
         *
         * Use this task to update dependencies defined in `bower.json`.
         *
         * @see https://github.com/yatskevich/grunt-bower-task
         * @see http://bower.io/
         */

        bower: {

            install: {

                options: {

                    targetDir: './files/plugins', // A directory where you want to keep your Bower packages.
                    cleanup: true, // Will clean target and bower directories.
                    layout: 'byComponent', // Folder structure type.
                    verbose: true // Debug output.

                }

            }

        },

        /*----------------------------------( JSHINT )----------------------------------*/

        /**
         * Validate files with JSHint.
         *
         * @see https://github.com/gruntjs/grunt-contrib-jshint
         * @see http://www.jshint.com/docs/
         */

        jshint: {

            options: {

                jshintrc: '.jshintrc' // Defined options and globals.

            },

            init: [

                './Gruntfile.js',
                './files/js/<%= pkg.name %>.*.js'

            ]

        },

        /*----------------------------------( ENV )----------------------------------*/

        /**
         * Grunt task to automate environment configuration for future tasks.
         *
         * @see https://github.com/onehealth/grunt-env
         */

        env: {

            dev: {

                NODE_ENV: 'DEVELOPMENT'

            },

            prod: {

                NODE_ENV: 'PRODUCTION'

            }

        },

        /*----------------------------------( CLEAN )----------------------------------*/

        /**
         * Clean files and folders.
         *
         * @see https://github.com/gruntjs/grunt-contrib-clean
         */

        clean: {

            options: {

                force: true // Allows for deletion of folders outside current working dir (CWD). Use with caution.

            },

            dev: [

                '../build/dev/**/*'

            ],

            prod: [

                '../build/prod/<%= pkg.version %>/<%= now %>/<%= ver %>/**/*',
                '../index.html'

            ]

        },

        /*----------------------------------( UGLIFY )----------------------------------*/

        /**
         * Minify files with UglifyJS.
         *
         * @see https://github.com/gruntjs/grunt-contrib-uglify
         * @see http://lisperator.net/uglifyjs/
         */

        uglify: {

            prod: {

                options: {

                    banner: '<%= banner.short %>'

                },

                files: {

                    '../build/prod/<%= pkg.version %>/<%= now %>/<%= ver %>/js/<%= pkg.name %>.min.js': [
                        './files/js/fastclick.js',
                        './files/js/jquery.js',
                        './files/js/jquery.*.js',
                        './files/js/<%= pkg.name %>.js',
                        './files/js/<%= pkg.name %>.mod.*.js',
                        './files/js/<%= pkg.name %>.init.js'
                    ]

                    // Optionally, add more generated files here ...

                }

            }

        },

        /*----------------------------------( SASS )----------------------------------*/

        /**
         * Compile LESS to CSS.
         *
         * @see https://github.com/gruntjs/grunt-contrib-less
         */

        less: {
            dev: {
                options: {
                    strictMath: true,
                    compress: false

                },
                files: {
                    '../build/dev/css/<%= pkg.name %>.css': './files/styles/less/<%= pkg.name %>.less',
                    '../build/dev/css/development.css': './files/styles/less/development.less'
                }
            },
            prod: {
                options: {
                    strictMath: true,
                    compress: true
                },
                files: {
                    '../build/prod/<%= pkg.version %>/<%= now %>/<%= ver %>/css/<%= pkg.name %>.min.css': './files/styles/less/<%= pkg.name %>.less'
                }
            }
        },

        /*----------------------------------( PREPROCESS )----------------------------------*/

        /**
         * Grunt task around preprocess npm module.
         *
         * @see https://github.com/onehealth/grunt-preprocess
         * @see https://github.com/onehealth/preprocess
         * @see http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
         */

        preprocess: {

            options: {

                context: {

                    description: '<%= pkg.description %>',
                    homepage: '<%= pkg.homepage %>',
                    license: '<%= _.pluck(pkg.licenses, "type").join(", ") %>',
                    name: '<%= pkg.name %>',
                    now: '<%= now %>',
                    production: '<%= pkg.production %>',
                    title: '<%= pkg.title %>',
                    ver: '<%= ver %>',
                    version: '<%= pkg.version %>'

                }

            },

            dev: {

                files: [

                    {

                        expand: true,
                        cwd: './files/templates/',
                        src: [
                            '**/*.html',
                            '!includes/**/*',
                            '!latest.html'
                        ],
                        dest: '../build/dev/'

                    }

                ]

            },

            prod: {

                files: [

                    {

                        expand: true,
                        cwd: './files/templates/',
                        src: [
                            'index.html'
                        ],
                        dest: '../build/prod/<%= pkg.version %>/<%= now %>/<%= ver %>/'

                    }, {

                        src: './files/templates/latest.html',
                        dest: '../build/prod/index.html'

                    }

                ]

            }

        },

        /*----------------------------------( COPY )----------------------------------*/

        /**
         * Copy files and folders.
         *
         * @see https://github.com/gruntjs/grunt-contrib-copy
         * @see http://gruntjs.com/configuring-tasks#globbing-patterns
         */

        copy: {

            dev: {

                files: [

                    {

                        expand: true,
                        cwd: './files/',
                        src: [
                            'img/**/*.*', // Could also use: `*.{gif,png,svg}`
                            'js/**/*',
                            '!**/source/**'
                        ],
                        dest: '../build/dev/'

                    }

                ]

            },

            prod: {

                files: [

                    {

                        expand: true,
                        cwd: './files/',
                        src: [
                            'img/**/*.*',
                            '!**/source/**',
                            '!**/junk/**'
                        ],
                        dest: '../build/prod/<%= pkg.version %>/<%= now %>/<%= ver %>/'

                    }, {

                        // COPY INDEX TO ROOT:
                        src: '../build/prod/<%= pkg.version %>/<%= now %>/<%= ver %>/index.html',
                        dest: '../index.html'

                    }

                    // Optionally, add more generated files here ...

                ]

            }

        },

        /*----------------------------------( WATCH )----------------------------------*/

        /**
         * Run predefined tasks whenever watched file patterns are added, changed
         * or deleted.
         *
         * @see https://github.com/gruntjs/grunt-contrib-watch
         */

        connect: {
            options: {
                port: 9007,
                livereload: 42202,
                hostname: 'localhost',
                base: '../build/dev'
            },
            livereload: {
                options: {
                    open: true
                }
            }
        },

        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [ // Files to livereload on
                    '<%= jshint.init %>',
                    './files/js/**/*',
                    './files/styles/**/*',
                    './files/templates/**/*',
                    '../build/dev*'
                ]
            },
            files: [ // Files to livereload on
                '<%= jshint.init %>',
                './files/js/**/*',
                './files/styles/**/*',
                './files/templates/**/*',
                '../build/dev*'
            ],

            tasks: ['default']
        }

    });

    /*----------------------------------( TASKS )----------------------------------*/

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-bower-task');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-env');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.loadNpmTasks('grunt-preprocess');

    grunt.loadNpmTasks('grunt-contrib-copy');

    //----------------------------------

    /**
     * @see https://github.com/onehealth/grunt-preprocess/issues/7
     * @see https://github.com/onehealth/grunt-env/issues/4
     */

    grunt.registerTask('printenv', function() { console.log(process.env); });

    //----------------------------------

    grunt.registerTask('init', ['jshint']);

    grunt.registerTask('dev', ['init', 'env:dev', 'clean:dev', 'less:dev', 'preprocess:dev', 'copy:dev']);

    grunt.registerTask('prod', ['init', 'dev', 'env:prod', 'clean:prod', 'less:prod', 'uglify:prod', 'preprocess:prod', 'copy:prod']);

    grunt.registerTask('default', ['dev']);

    // Run server, run...
    grunt.registerTask('server', ['init', 'env:dev', 'clean:dev', 'less:dev', 'preprocess:dev', 'copy:dev', 'connect:livereload', 'watch']);

};
