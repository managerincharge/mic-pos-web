module.exports = function (posTransMain) {
	return {
		run: function( req, res) {

			res.send('running');
		},

		stop: function (req, res) {

			res.send('stopped');
		}
	};
};