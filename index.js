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

// Thermostat setup
const Gpio = require('pigpio').Gpio;
const thermoConf = config.get('thermostat');
const thermo = new Gpio(thermoConf.pin, {mode: Gpio.OUTPUT});

function sendThermoState()
{
	mqttClient.publish(thermoConf.mqttTopicState, thermo.digitalRead() ? thermoConf.stateOn : thermoConf.stateOff, { retain: true });
}

mqttClient.on('connect', function () {
	mqttClient.subscribe(thermoConf.mqttTopicSet);
	thermo.digitalWrite(0); // make sure the thermostat is off
	sendThermoState(); //make sure the current state is know when connected
});

mqttClient.on('message', function (topic, message) {
	if (topic === thermoConf.mqttTopicSet) {
		console.log('rec topic: ' + message);

		if (message === thermoConf.stateOn)
		{
			thermo.digitalWrite(1);
		}
		else if (message === thermoConf.stateOff)
		{
			thermo.digitalWrite(0);
		}

		sendThermoState();
	}
});

