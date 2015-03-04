'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		eslint: {
			lint: {
				src: ['./']
			},
			fix: {
				options: {
					fix: true
				},
				src: ['./']
			}
		},
		hooks: {
			main: {
				options: {
					hookDir: 'config/hooks/',
					onDone: 'Thanks for being a good citizen and using the hooks.',
					hooks: [{
						name: 'pre-push',
						hookType: 'pre-push',
						description: 'ensure that there are no build or ' +
							'workflow-breaking issues.'
					}]
				}
			}
		}
	});

	grunt.registerTask('lint', ['eslint:lint']);
	grunt.registerTask('jsb', ['eslint:fix']);
	grunt.loadNpmTasks('gruntify-eslint');
	grunt.loadTasks('./tasks/');
};
