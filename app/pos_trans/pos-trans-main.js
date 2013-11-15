module.exports = function (helper) {

	var subs = require('./pos-trans-subs.js')(helper);
	var fb = require('./pos-trans-firebase.js')(helper);
	var	_ = require('underscore');

	var posStoreList = helper.settings.posStoreList;
	var micPosWebStatusRef = fb.fbList.micPosWeb.statusRef;

	return {
		run: run,
		stop: stop,
	};


	// internals

	function run() {
		// process trans one block at a time to avoid stack overflows
		_.each(posStoreList, function(item, key) {
			item.newTransRef.on('child_added', function(snap) {
				setTimeout( function() {
						if (snap.val() !== null) {
							// parse and add tran(s) to mic-pos-web fb
							subs.handleOnChild_Added(snap);
							snap.ref().remove();
						}
				}, 0);
			});
		});
		micPosWebStatusRef.child('mic-pos-web/processingTrans').set(true);
	}

	function stop() {
		_.each(posStoreList, function(item, key) {
			item.newTransRef.off('child_added');
		});
		micPosWebStatusRef.child('mic-pos-web/processingTrans').set(false);
	}


};

