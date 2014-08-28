module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
			" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
			" *  <%= pkg.description %>\n" +
			" *  <%= pkg.homepage %>\n" +
			" *\n" +
			" *  Made by <%= pkg.author %>\n" +
			" *  Under <%= pkg.licenses[0].type %> License\n" +
			" */\n"
		},

		// Concat definitions
		concat: {
			dist: {
				files : {
					"src/resources/js/script.js" : ["src/resources/js/options.js", "src/resources/js/tooltip.js", "src/resources/js/extension.js"]
				}
			},
			options: {
				banner: "<%= meta.banner %>",
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/resources/js/extension.js", "src/resources/js/tooltip.js" , "src/resources/js/options.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				files: {
					"src/resources/js/script.min.js" : "src/resources/js/script.js"
				}
			},
			options: {
				banner: "<%= meta.banner %>",
				report: 'gzip'
			}
		},

		cssmin: {
			minify: {
				expand: true,
				cwd : 'src/resources/css/',
				src: ['style.css'],
				dest: 'src/resources/css/',
				ext: '.min.css'
			},
			options: {
				banner: "<%= meta.banner %>",
				report: 'gzip'
			}
		},

		compress: {
			main: {
				options: {
					archive: "dist/<%= pkg.name %>.zip"
				},
				files: [
					{
						expand: true,
						cwd: "src",
						src: [
							"manifest.json",
							"background.js",
							"_locales/**",
							"resources/css/*.min.css",
							"resources/images/**",
							"resources/js/*.min.js",
							"resources/lib/**",
							"resources/pages/**"
						],
						dest: "<%= pkg.name %>"
					}
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask("default", ["jshint", "concat", "uglify", "cssmin", "compress"]);
	grunt.registerTask("travis", ["jshint"]);
};
