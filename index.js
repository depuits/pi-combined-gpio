'use strict';

const config = require('config');
const dhtConf = config.get('dht');

const leds = require('pi-mqtt-led');
const dht = require('pigpio-dht');
const sensor = dht(dhtConf.pin, dhtConf.type);

sensor.on('result', data => {
	var dataJson = JSON.stringify(data);
	leds.mqtt.publish(dhtConf.mqttTopic, dataJson);
});

sensor.on('badChecksum', () => {
	console.log('checksum failed');
});

sensor.read();
setInterval(() => {
	sensor.read();
}, dhtConf.pollInterval);
