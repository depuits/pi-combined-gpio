'use strict';

var config = {
	debug: (process.env.NODE_ENV !== 'production'),

	stripType: 'RGB', // options: BRIGHTNESS, RGB, RGBW

	pinRed: 0,		// For RGB(W)
	pinGreen: 0,	// For RGB(W)
	pinBlue: 0,		// For RGB(W)
	pinWhite: 0,	// For BRIGHTNESS and RGBW
	
	// Reverse the LED logic
	// false: 0 (off) - 255 (bright)
	// true: 255 (off) - 0 (bright)
	invertLedLogic: false,

	payloadOn: 'ON',
	payloadOff: 'OFF',

	mqtt: {
		host: '127.0.0.1', 
		port: 1883,
		username: undefined,
		password: undefined
	},
	mqttTopicState: 'home/PI_LED',
	mqttTopicSet: 'home/PI_LED/set',

	colorFade: {
		timeSlow: 10,
		timeFast: 3
	},

	dht: {
		pin: 5,
		type: 22,
		mqttTopic: 'home/sensor/dht',
		pollInterval: 30 * 1000 // every 30 seconds, can't be more then every 2 seconds
	},

	thermostat: {
		mqttTopicState: 'home/PI_THERMO',
		mqttTopicSet: 'home/PI_THERMO/set',
		pin: 23,
		
		stateOff: 'OFF',
		stateOn: 'ON'
	}

};

module.exports = config;
