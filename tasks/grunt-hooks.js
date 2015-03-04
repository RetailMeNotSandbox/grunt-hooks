'use strict';

module.exports = function( grunt ) {

	var description = 'Walks the user through interactive prompts to install git hooks.';

	var fs = require( 'fs' );
	var exec = require( 'child_process' ).exec;
	var inquirer = require('inquirer');
	var _ = require( 'lodash' );
	var path = require( 'path' );
	var mkpath = require( 'mkpath' );

	var done;     // async
	var task;     // task context
	var options;  // task options
	var hooks;    // hook configs
	var noPrompt; // option passed to task via flag

	function nextQuestion() {
		if ( !hooks.length ) {
			if ( !!options.onDone ) {
				grunt.log.writeln( '' );
				grunt.log.writeln( options.onDone.blue );
			}
			done();
		} else {
			var hookConfig = hooks.shift();
			promptHook( hookConfig );
		}
	}

	function promptHook( hookConfig ) {
		var prompt = hookConfig.name.yellow +
			' - ' +
			hookConfig.description.grey +
			'\nDo you want to install this hook?'.yellow;

		getYesNoResponse(
			prompt,
			_.partial(
				installHook,
				hookConfig.hookType,
				hookConfig.hookType,
				hookConfig.name,
				nextQuestion
			),
			nextQuestion
		);

		return;
	}

	/* Installs hook in grunt/hooks/source as .git/hooks/dest */
	function installHook( source, dest, sourceCanonicalName, cb ) {
		var hookToCopy = path.join( ( options.hookDir || 'grunt/hooks/' ), source );
		var whereToPutIt = '.git/hooks/' + dest;
		if ( !fs.existsSync( hookToCopy ) ) {
			grunt.fail.fatal( 'No file found at ' + hookToCopy );
		}

		// If there is already that type of hook installed
		if ( fs.existsSync( './' + whereToPutIt ) ) {

			// Ask if the user wants to overwrite the existing hook
			getYesNoResponse( [
					'A hook already exists at',
					whereToPutIt + '.',
					'Do you wish to overwrite it?'
				].join( ' ' ).red,
				function() {

					// The user said yes. Overwrite the existing hook.
					actuallyInstallHook(
						hookToCopy,
						whereToPutIt,
						sourceCanonicalName
					);

					cb();
				},
				function() {

					// The user said no, tell they we're skipping the hook
					grunt.log.writeln( [
						'Skipping install of ',
						sourceCanonicalName,
						' hook in ',
						whereToPutIt
					].join( '' ).red);

					cb();
				}
			);

		} else {

			// The file didn't exist, perform the copy and continue
			grunt.log.writeln( hookToCopy, whereToPutIt, sourceCanonicalName );
			actuallyInstallHook(
				hookToCopy,
				whereToPutIt,
				sourceCanonicalName
			);
			cb();
		}

		// Installs the hook without checking if it already exists
		function actuallyInstallHook(
			hookToCopy,
			whereToPutIt,
			sourceCanonicalName
		) {
			mkpath.sync( path.join( './', path.dirname( whereToPutIt ) ) );
			exec( 'cp ' + hookToCopy + ' ' + whereToPutIt );
			grunt.log.writeln( [
				'Installed ', sourceCanonicalName, ' hook in ', whereToPutIt
			].join( '' ).green );
		}
	}

	/**
	 * Prompts the user with prompStr.
	 * If user answers with anything !exists([yes, y, no, or n])
	 *
	 * @usage  grunt.log.writeln( {{yes/no question}} ), and call this
	 *         function omitting promptStr
	 *
	 * @param  {function}  callback for if the user answers yes
	 * @param  {function}  callback for if the user answers no
	 * @param  {string}    what to ask the user. (defaults to 'Y/N?')
	 * @return {undefined} n/a
	 */
	function getYesNoResponse( promptStr, yesCb, noCb ) {
		if ( noPrompt ) {
			yesCb();
			return;
		}
		inquirer.prompt([{
			name: 'response',
			type: 'confirm',
			message: promptStr
		}])
		.then(function (answers) {
		    if(answers.response){
		    	yesCb();
		    } else {
		    	noCb();
		    }
		})
		.catch(function(e){
			grunt.fail.fatal('an error occurred: ', e);
		});
	}

	grunt.registerMultiTask( 'hooks', description, function() {
		task = this;
		options = task.data.options;
		hooks = task.data.options.hooks;
		noPrompt = grunt.option( 'no-prompt' );
		done = this.async();

		// Start the question chain.
		nextQuestion();
	} );
};
