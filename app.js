var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var port = process.env.PORT || 8999;
var app = express();

process.on('uncaughtException', function (err) {
    console.log(err);
});

function checkAuth (req, res, next) {
	// don't serve to those not logged in
	if(req.url !== '/' && req.url !== '/unauthorised' && req.url.indexOf('/login') == -1 && req.url.indexOf('/pk-login-react/') == -1 && (!req.session || !req.session.authenticated)) {
		console.log('Authentication Failed - '+req.url);
		res.redirect('/unauthorised');
	}else if(req.url === '/' && req.url.indexOf('/pk-login-react/') == -1 && (!req.session || !req.session.authenticated)) {
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
