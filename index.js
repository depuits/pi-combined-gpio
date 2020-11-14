'use strict';

const config = require('config');

const leds = require('pi-mqtt-led');
const mqttClient = leds.mqtt;

// DHT setup
const dhtConf = config.get('dht');
const dht = require('pigpio-dht');
const sensor = dht(dhtConf.pin, dhtConf.type);

sensor.on('result', data => {
	var dataJson = JSON.stringify(data);
	mqttClient.publish(dhtConf.mqttTopic, dataJson);
});

sensor.on('badChecksum', () => {
	console.log('checksum failed');
});

sensor.read();
setInterval(() => {
	sensor.read();
}, dhtConf.pollInterval);



// extras setup
const Gpio = require('pigpio').Gpio;
const extraConfs = config.get('extras');

for (let extra of extraConfs) {

	const conf = config.get('extras');
	const gpio = new Gpio(conf.pin, {mode: Gpio.OUTPUT});

	const onState = conf.inverted ? 0 : 1;
	const offState = conf.inverted ? 1 : 0;


	function sendState()
	{
		mqttClient.publish(conf.mqttTopicState, gpio.digitalRead() == onState ? conf.stateOn : conf.stateOff, { retain: true });
	}

	function set(on) {

		if (message == conf.stateOn)
		{
			gpio.digitalWrite(onState);
		}
		else if (message == conf.stateOff)
		{
			gpio.digitalWrite(offState);
		}

		sendState();
	}

	mqttClient.on('connect', function () {
		mqttClient.subscribe(conf.mqttTopicSet);
		set(false); // make sure the  is off
	});

	mqttClient.on('message', function (topic, message) {
		if (topic === conf.mqttTopicSet) {
			console.log('rec extra topic: ' + message);

			if (message == conf.stateOn)
			{
				set(true);
			}
			else if (message == conf.stateOff)
			{
				set(false);
			}

			sendState();
		}
	});

}

