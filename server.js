'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const token = process.env.TOKEN;
const argv = require('yargs').agrv;
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index', {weather: null, error: null});
});

app.post('/', function(req, res) {
	let city = req.body.city;
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${token}`;

	request(url, function(err, console, body) { 
		if(err) {
			res.render('index', {weather: null, error: 'Error, please try again'});
		} else {
			let weather = JSON.parse(body);
			if(weather.main == undefined) {
				res.render('index', {weather: null, error: 'Error, please try again'});
			} else {
				let weatherText = `Its ${weather.main.temp} degrees in ${weather.name}!`;
				res.render('index', {weather: weatherText, error: null});
			}
		}	
	});
});

if(process.env.PRODUCTION) {
	const server = app.listen(process.env.PORT, () => { console.log('Exampe app listening on port %d', server.address().port);});
} else {
	const server = app.listen(3000, () => { console.log('Exampe app listening on port %d', server.address().port);});
}
