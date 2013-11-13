module.exports = function (posTransMain) {

	return {
		run: function( req, res) {
			posTransMain.run();
			res.send('running');
		},

		stop: function (req, res) {
			posTransMain.stop();
			res.send('stopped');
		}
	};

};