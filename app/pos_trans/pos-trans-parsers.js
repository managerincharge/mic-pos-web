module.exports = function (helper) {

	var transParsers = {};

	var _ = helper._;

	var TRAN_DELIM_1 = '================================';  // 32 chars

	transParsers.v1 = function (inp) {
		// inp is the raw tran(s) from pos
		// returns an array of trans json objects
		var transArray = [];
		var tranObject = {};

		// remove all blank lines
		inp = inp.replace(/^\s*[\r\n]/gm, '');
		// remove all lines with cc info
		inp = inp.replace(/^\s*X{5,}[\s\w\/]*[\r\n]/gm,'');
		// split transactions into an array
		transArray = inp.split(TRAN_DELIM_1);
		// remove transactions that are simply credit card reciepts
		transArray = _.filter(transArray, function (trans) {
			return Boolean(trans.indexOf('Acct #:') === -1 && trans.indexOf('Exp Date:') === -1);
		});
		// last trans in array might be empty, so remove it
		transArray = _.filter(transArray, function (trans) {
			return Boolean(trans.length > 2);
		});
		// map trans into json object for firebase: { “name”: “YYYY-MM-DD HH:MM TTTT”, “trans”: “string of trans”}
		var retArray = _.map(transArray, function (tran) {
			tranObject = {
				"name": getName1(tran), // "YYYY-MM-DD HH:MM TTTT"
				"trans": tran.replace(/[\r\n]$/, '')  // remove last end of line marker
			};
			return tranObject;
		});
		return retArray;
	};

	transParsers.v2 = function (inp) {
		// inp is the raw tran(s) from pos
		// returns an array of trans json objects
		var transArray = [];
		var tranObject = {};

		// remove all blank lines
		inp = inp.replace(/^\s*[\r\n]/gm, '');
		// remove all lines with cc info
		inp = inp.replace(/^\^\s*\d{8,}.\d\d\/\d\d[\s\w\/]*[\r\n]/gm,'');
		// split transactions into an array
		transArray = inp.split(TRAN_DELIM_1);
		// remove transactions that are simply credit card reciepts
		transArray = _.filter(transArray, function (trans) {
			return Boolean(trans.indexOf('Acct #:') === -1 && trans.indexOf('Exp Date:') === -1);
		});
		// last trans in array might be empty, so remove it
		transArray = _.filter(transArray, function (trans) {
			return Boolean(trans.length > 2);
		});
		// map trans into json object for firebase: { “name”: “YYYY-MM-DD HH:MM TTTT”, “trans”: “string of trans”}
		var retArray = _.map(transArray, function (tran) {
			tranObject = {
				"name": getName1(tran), // "YYYY-MM-DD HH:MM TTTT"
				"trans": tran.replace(/[\r\n]$/, '')  // remove last end of line marker
			};
			return tranObject;
		});
		return retArray;
	};


	function getName1 (tran) {
		// return name field as "YYYY-MM-DD HH:MM TTTT"
		var arr = tran.match(/^Trn\s(\d+)\s*(...)(..).(..).(\S*)$/m);
		var tranDateString = helper.moment(arr[3]+arr[2] + '20' + arr[4] + ' ' + arr[5], "DDMMMYYYY hh:mmA")
			.format('YYYY-MM-DD HH:mm');
		return tranDateString + ' ' + '0'.repeat(4 - arr[1].length) + arr[1];
	}

	return transParsers;
};