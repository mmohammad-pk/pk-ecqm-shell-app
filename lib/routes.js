var path = require('path');
var httpProxy = require('http-proxy');
// var apiProxy = httpProxy.createProxyServer({secure:false, hostRewrite: 'localhost:8999', protocolRewrite: 'http'});
var apiProxy = httpProxy.createProxyServer({secure:false, hostRewrite: 'pk-ecqm-demo.herokuapp.com'});
var ngServer,reactServer,vueServer,loginServer = 'https://mmohammad-pk.github.io';
	// reactServer = 'https://mmohammad-pk.github.io',
    // vueServer = 'https://mmohammad-pk.github.io',
    // loginServer = 'https://mmohammad-pk.github.io';
	

// var ngServer = 'http://localhost:4200',
//     reactServer = 'http://localhost:8888',
//     vueServer = 'http://localhost:8080',
//     loginServer = 'http://localhost:3001';

module.exports = function (app) {

	app.get('/', function (req, res, next) {
		console.log('url : / , loading home.html file');
		res.sendFile(path.join(__dirname + '/../home.html'));
	});

	app.get('/home', function (req, res, next) {
		console.log('url : /home , loading home.html');
		res.sendFile(path.join(__dirname + '/../home.html'));
	});

	app.get('/login', function (req, res, next) {
		console.log('url : /login GET , redirecting to react login server');
		req.url = req.url.replace('/login', '');
		delete req.headers.host;
		apiProxy.web(req, res, {target: loginServer+'/pk-login-react'});
	});

	app.get('/unauthorised', function (req, res, next) {
		console.log('url : /unauthorised GET , loading unauthorised');
		res.render('unauthorised' );
	});

	app.post('/login', function (req, res, next) {
		console.log('url : /login POST');
		console.log('body : '+req.body);
		if (req.body.email && req.body.email === 'admin@prokarma.com' && req.body.password && req.body.password === 'admin') {
			req.session.authenticated = true;
			console.log('LOGGED in Successsfully');
			res.redirect('/home');
		} else {
			console.log('LOGGED in Failed');
			res.redirect('/login');
		}
	});

	app.all("/pk-ecqm-grid-angular/*", function(req, res) {
		console.log('redirecting to grid : '+req.url);
		delete req.headers.host;
		apiProxy.web(req, res, {target: ngServer});
	});

	app.all("/pk-ecqm-header-vue/*", function(req, res) {
		console.log('redirecting to header : '+req.url);
		delete req.headers.host;
		apiProxy.web(req, res, {target: vueServer});
	});
	
	app.all("/pk-bonnie-library-react/*", function(req, res) {
		console.log('redirecting to bonnie : '+req.url);
		delete req.headers.host;
		apiProxy.web(req, res, {target: reactServer});
	});
	
	app.all("/pk-login-react/*", function(req, res) {
		console.log('redirecting to loginServer : '+req.url);
		delete req.headers.host;
		apiProxy.web(req, res, {target: loginServer});
	});

	app.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		res.redirect('/login');
	});

};
