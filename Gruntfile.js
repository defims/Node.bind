module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                paths: ['.']
            },

            NodeBind: {
                options: {
                    include: 'relative'
                },
                files: [
                    {
                        src: [
                            '<%= _src.NodeBind %>Node\.bind.js'
                        ],
                        dest: '<%= _dist.NodeBind %>Node\.bind.js'
                    },
                    {
                        src: [
                            '<%= _src.NodeBind %>Node\.bind.js',
                        ],
                        dest: '<%= _dist.NodeBind %>Node\.bind\.debug.js'
                    }
                ]
            }
        },

        uglify: {
            options: {
                banner: ''
            },

            NodeBind: {
                files:{
                    'Node\.bind\.min.js': ['dist/*.js', '!dist/*debug.js']
                },
                options: {
                    banner: ''
                }
            }
        },

        cssmin: {
            options: {
                banner: ''
            }
        },

        copy: {
            
            NodeBind: {
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        },

        clean: {
            NodeBind: ['dist'],
        },

        _src: {
            'NodeBind': 'src/'
        },
        _dist: {
            'NodeBind': 'dist/'
        }
    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('deploy-NodeBind', ['clean:NodeBind', 'concat:NodeBind', 'uglify:NodeBind', 'copy:NodeBind']);

    grunt.registerTask('default', ['deploy-NodeBind']);
};
