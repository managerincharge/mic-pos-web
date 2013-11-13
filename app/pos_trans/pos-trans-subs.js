module.exports = function (helper) {

	var subs = {};

	var _ = helper._;
	var posStoreList = helper.settings.posStoreList;

	subs.handleOnChild_Added = function(snap) {
		var orgStore = getOrgStoreFromRef(snap.ref());
		// get the time that this store's business day starts
		var businessDayStartTime = posStoreList[orgStore].businessDayStartTime;
		var newTransRef = helper.settings.fbList.micPosWeb.rawTransBaseRef.child(orgStore);
		// returns array with 0..n individual trans objects
		var transArray = posStoreList[orgStore].parser(snap.val().text);
		var errorOccurred = false;
		// write each new trans
		_.each(transArray, function (item, key) {
			var tranDatePart = item.name.substr(0, 10);
			// determine business date of trans (might not be the same date as the trans)
			var busDateStart = helper.moment(tranDatePart + ' ' + businessDayStartTime, 'YYYY-MM-DD HH:mm');
			// date & time of trans
			var tranWhen = helper.moment(item.name.substr(0, 16), 'YYYY-MM-DD HH:mm');
			if (tranWhen.isBefore(busDateStart)) {
				// time of transaction has not yet reached the time the business day starts
				tranDatePart = helper.moment(tranDatePart, 'YYYY-MM-DD').subtract('days', 1).format('YYYY-MM-DD');
			}
			// put trans name & value into org-store, i.e. fcf-9999, then by business day
			newTransRef.child(tranDatePart).child(item.name).set(item.trans);
		});
	};

	return subs;

	/*################################################################################
	internal functions
	################################################################################*/


	function getOrgFromRef (ref) {
		return ref.parent().parent().parent().parent().name();
	}

	function getStoreFromRef (ref) {
		return ref.parent().parent().name();
	}

	function getOrgStoreFromRef (ref) {
		return getOrgFromRef(ref) + '-' + getStoreFromRef(ref);
	}




};
