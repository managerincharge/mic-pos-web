module.exports = function (helper) {

	/*################################################################################
	local vars
	################################################################################*/
	var Firebase = require('firebase');
	var FirebaseTokenGenerator = require('firebase-token-generator');
	var parsers = require('./pos-trans-parsers.js')(helper);
	var settings = helper.settings;
	var util = helper.util;
	var _ = helper._;

	var serverTimeOffsetMs;
	var fbList = settings.fbList;
	var posStoreList = settings.posStoreList;
	var micPosWeb = fbList.micPosWeb;  // shortcut


	/*################################################################################
	setup firebase(s)
	################################################################################*/
	_.each(fbList, function (item, key) {
		item.ref = new Firebase(item.url);
		item.token = genToken(item.key);
		item.connectedRef = item.ref.child('.info/connected');
		if (item.org == 'main') {
			item.statusRef = item.ref.child('status');
			item.logRef = item.ref.child('log');
			item.rawTransBaseRef = item.ref.child('rawTrans');
		}
		fbAuth(item);
	});

	micPosWeb.ref.child('.info/serverTimeOffset').on('value', function (snap) {
		serverTimeOffsetMs = snap.val();
	});
	micPosWeb.statusRef.child('mic-pos-web/processingTrans').set(false);


	/*################################################################################
	setup each store's ref to watch for new trans
	################################################################################*/
	_.each(posStoreList, function (item, key) {
		item.newTransRef = fbList[item.fb].ref.child('org').child(item.orgId).child('store').child(item.storeId).child('newTrans');
		// also set up store parser
		item.parser = parsers[item.parserVersion];
	});


	/*################################################################################
	logger
	################################################################################*/
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


	/*################################################################################
	return module api
	################################################################################*/
	return {
		Firebase: Firebase,
		logger: logger,
		fbList: fbList,
		getEstServerTime: getEstServerTime
	};


	/*################################################################################
	internal functions
	################################################################################*/

	function fbAuth (fbStruct) {
		fbStruct.ref.auth(fbStruct.token, function (error, result) {
			if(error) {
				logger.log(logger.ERROR, util.format('Authentication to %s failed // %s', fbStruct.ref.toString(), error));
			} else {
				logger.log(logger.INFO, util.format('Successfully Authenticated to %s', fbStruct.ref.toString()));
			}
		});
		fbStruct.connectedRef.on('value', connectionChanged);
	}

	function connectionChanged(snap) {
		var whichFb = snap.ref().toString();
		whichFb = whichFb.substring(8, whichFb.length - 31);
		if (snap.val() === true) {
			micPosWeb.statusRef.child(whichFb + '/lastOnline').set(true);
			micPosWeb.statusRef.child(whichFb + '/lastOnline').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
			fbList[whichFb.toCamel()].online = true;
		} else {
			fbList[whichFb.toCamel()].online = false;
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

