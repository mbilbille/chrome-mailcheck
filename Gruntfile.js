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
					"resources/js/script.js" : ["resources/js/options.js", "resources/js/tooltip.js", "resources/js/extension.js"]
				}
			},
			options: {
				banner: "<%= meta.banner %>",
			}
		},

		// Lint definitions
		jshint: {
			files: ["resources/js/extension.js", "resources/js/tooltip.js" , "resources/js/options.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				files: {
					"resources/js/script.min.js" : "resources/js/script.js"
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
				cwd : 'resources/css/',
				src: ['style.css'],
				dest: 'resources/css/',
				ext: '.min.css'
			},
			options: {
				banner: "<%= meta.banner %>",
				report: 'gzip'
			}
		},

		'chrome-extension': {
				options: {
						name: "<%= pkg.name %>",
						version: "<%= pkg.version %>",
						id: "bjgbmbcjjngekbbjioohicaidafndfdg",
						chrome: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
						clean: true,
						certDir: 'cert',
						buildDir: 'build',
						resources: [
								"_locales/**",
								"resources/css/*.min.css",
								"resources/images/**",
								"resources/js/*.min.js",
								"resources/lib/**",
								"resources/**.html",
								"LICENSE"
						]
				}
			}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks('grunt-chrome-compile');

	grunt.registerTask("default", ["jshint", "concat", "uglify", "cssmin", "chrome-extension"]);
	grunt.registerTask("travis", ["jshint"]);
};
