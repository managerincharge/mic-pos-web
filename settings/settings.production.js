var settings = {};

settings.fbList = {

	"micPosWeb": {
		"org": "main",
		"url": "https://mic-pos-web.firebaseio.com/",
		"key": "ORwz1cFgafuVf5WeKJbBBNXrisA3k0WaQKqSq4s4",
		"ref": null,
		"token": null,
		"connectedRef": null,
		"online": false,
		"statusRef": null,
		"logRef": null,
		"rawTransBaseRef": null
	},

	"micPos": {
		"org": "fcf",
		"url": "https://mic-pos.firebaseio.com/",
		"key": "6fyyTZuoFOPVmIS9RlF6YkWdGZsuGPs4EVYzl9mn",
		"ref": null,
		"token": null,
		"connectedRef": null,
		"online": false
	}
};

// this structure is not used yet
settings.posStoreList = {

	"fcf-9999": {
		"orgId": "fcf",
		"storeId": "9999",
		"fb": 'micPos',
		"newTransRef": null,
		"parserVersion": "v2",
		"parser": null,
		"businessDayStartTime": "00:00"
	},

		"fcf-0013": {
		"orgId": "fcf",
		"storeId": "0013",
		"fb": 'micPos',
		"newTransRef": null,
		"parserVersion": "v1",
		"parser": null,
		"businessDayStartTime": "00:00"
	},

		"fcf-0014": {
		"orgId": "fcf",
		"storeId": "0014",
		"fb": 'micPos',
		"newTransRef": null,
		"parserVersion": "v2",
		"parser": null,
		"businessDayStartTime": "00:00"
	},

		"fcf-0015": {
		"orgId": "fcf",
		"storeId": "0015",
		"fb": 'micPos',
		"newTransRef": null,
		"parserVersion": "v2",
		"parser": null,
		"businessDayStartTime": "00:00"
	}



};

settings.firebaseSecurityDebug = false;

module.exports = settings;