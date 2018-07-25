var path = require('path');
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer({secure:false});
var ngServer = 'https://mmohammad-pk.github.io/pk-ecqm-grid-angular/',
    reactServer = 'https://mmohammad-pk.github.io/pk-bonnie-library-react/';

module.exports = function (app) {

	app.get('/', function (req, res, next) {
		res.sendFile(path.join(__dirname + '/../home.html'));
	});

	app.get('/home', function (req, res, next) {
		res.sendFile(path.join(__dirname + '/../home.html'));
	});

	app.get('/login', function (req, res, next) {
		res.render('login' );
	});

	app.get('/unauthorised', function (req, res, next) {
		res.render('unauthorised' );
	});

	app.post('/login', function (req, res, next) {

		if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
			req.session.authenticated = true;
			res.redirect('/home');
		} else {
			res.redirect('/login');
		}

	});

	app.all("/pk-ecqm-grid-angular/*", function(req, res) {
		console.log('redirecting to ngServer : '+req.url);
		console.log(req.session.page_views);
		apiProxy.web(req, res, {target: ngServer});
	});
	
	app.all("/pk-bonnie-library-react/*", function(req, res) {
		console.log('redirecting to reactServer : '+req.url);
		apiProxy.web(req, res, {target: reactServer});
	});

	app.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		res.redirect('/');
	});

};
