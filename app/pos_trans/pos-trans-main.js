module.exports = function (helper) {

	var posTransFb = require('./pos-trans-firebase.js')(helper);

	return {
		run: run,
		stop: stop
	}


	// internals

	function run() {
		console.log('pos-trans test running')
	}

	function stop() {
		console.log('pos-trans test stopped')
	}


}

