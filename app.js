var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var port = 8999;
var app = express();

function checkAuth (req, res, next) {
	// don't serve to those not logged in
	if(req.url !== '/' && req.url !== '/unauthorised' && req.url !== '/login' && (!req.session || !req.session.authenticated)) {
		console.log('Authentication Failed - '+req.url);
		res.redirect('/unauthorised');
	}else if(req.url === '/' && (!req.session || !req.session.authenticated)) {
		res.redirect('/login');
	}else{
		next();
	}
}

app.use('/img', express.static(__dirname +'/img'));
app.use(cookieParser());
app.use(session({ secret: 'example' }));
app.use(bodyParser());
app.use(checkAuth);
app.set('view engine', 'jade');
app.set('view options', { layout: false });

require('./lib/routes.js')(app);

app.listen(port);
console.log('Node listening on port %s', port);
