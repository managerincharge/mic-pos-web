// Module dependencies.

var express = require('express');
var http = require('http');
var path = require('path');
var util = require('util');

var app = express();

// load my settings
var settings = require('./settings')(app);

var moment = require('moment');

// load my modules
var helper = require('./app/helper.js')(settings, moment, util);
var posTransMain = require('./app/pos_trans/pos-trans-main.js')(helper);

var routes = require('./routes');
var encDecRoutes = require('./routes/enc-dec.js')(helper);
var posTransRoutes = require('./routes/pos-trans.js')(posTransMain);

// all environments
app.set('port', process.env.PORT || 1981);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function () {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
	app.use(express.static(__dirname + '/../iisnode'));
});

// this is how you provide vars to jade views
app.locals.settings = settings;
app.locals.app = app;

app.get('/', routes.index);
app.get('/enc/:s/:k', encDecRoutes.enc);
app.get('/dec/:s/:k', encDecRoutes.dec);
app.get('/pos-trans/run', posTransRoutes.run);
app.get('/pos-trans/stop', posTransRoutes.stop);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
