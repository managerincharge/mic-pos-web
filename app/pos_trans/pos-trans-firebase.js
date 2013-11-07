module.exports = function (helper) {

	var Firebase = require('firebase');
	var FirebaseTokenGenerator = require('firebase-token-generator');
	var settings = helper.settings;
	var util = helper.util;

	var serverTimeOffsetMs;


	//  +++++++++++++++++    micPosWeb    ++++++++++++++++++++++++++++++++
	var micPosWebRootRef = new Firebase(settings.micPosWebRootUrl);
	var micPosWeb = {
		ref: micPosWebRootRef,
		token: genToken(settings.micPosWebKey),
		connectedRef: micPosWebRootRef.child('.info/connected'),
		statusRef: micPosWebRootRef.child('status'),
		online: false,
		logRef: micPosWebRootRef.child('log')
	};
	micPosWeb.ref.auth(micPosWeb.token, function (error, result) {
		if(error) {
			logger.log(logger.ERROR, util.format('Authentication to %s failed // %s', micPosWeb.ref.toString(), error));
		} else {
			logger.log(logger.INFO, util.format('Successfully Authenticated to %s', micPosWeb.ref.toString()));
		}
	});
	micPosWeb.connectedRef.on('value', connectionChanged);
	micPosWeb.ref.child('.info/serverTimeOffset').on('value', function (snap) {
		serverTimeOffsetMs = snap.val();
	});
	//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


	//  +++++++++++++++++    micPos    +++++++++++++++++++++++++++++++++++
	var micPosRootRef = new Firebase(settings.micPosRootUrl);
	var micPos = {
		ref: micPosRootRef,
		token: genToken(settings.micPosKey),
		connectedRef: micPosRootRef.child('.info/connected'),
		online: false
	};
	micPos.ref.auth(micPos.token, function (error, result) {
		if(error) {
			logger.log(logger.ERROR, util.format('Authentication to %s failed // %s', micPos.ref.toString(), error));
		} else {
			logger.log(logger.INFO, util.format('Successfully Authenticated to %s', micPos.ref.toString()));
		}
	});
	micPos.connectedRef.on('value', connectionChanged);
	//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



	var logger = {
		log: function (category, message) {
			var entry = util.format('%s: %s', category, message);
			if (micPosWeb.online) {
				micPosWeb.logRef.child(helper.DateToStringSeqWithTimeIncFracSecs(getEstServerTime())).set(entry);
			} else {
				console.log(helper.DateToStringSeqWithTimeIncFracSecs(getEstServerTime()) + ' - ' + entry);
			}
		},
		// category can be any text, but the following constants are provided:
		ERROR: 'ERROR',
		INFO: 'INFO'
	};


	return {
		Firebase: Firebase,
		logger: logger,
		micPosWeb: micPosWeb,
		micPos: micPos,
		getEstServerTime: getEstServerTime
	};

	// internal functions

	function connectionChanged(snap) {
		var whichFb = (snap.ref().toString().indexOf('mic-pos-web') !== -1) ? 'mic-pos-web' : 'mic-pos';
		if (snap.val() === true) {
			micPosWeb.statusRef.child(whichFb + '/lastOnline').set(true);
			micPosWeb.statusRef.child(whichFb + '/lastOnline').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
			((whichFb.indexOf('web') !== -1) ? micPosWeb : micPos).online = true;
		} else {
			((whichFb.indexOf('web') !== -1) ? micPosWeb : micPos).online = false;
		}
	}

	function genToken (key) {
		var tokenGen = new FirebaseTokenGenerator(key);
		var token = tokenGen.createToken(
			{
				// no arbitrary data since we are 'admin' on server
			},
			{
				admin: true,
				debug: helper.settings.firebaseSecurityDebug,
				expires: new Date(100000000*86400000)
			}
		);
		return token;
	}

	function getEstServerTime () {
		return Date.now() + serverTimeOffsetMs;
	}

};

