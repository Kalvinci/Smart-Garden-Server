const { SerialPort } = require("serialport");
require("dotenv").config();

const arduinoSerialPort = new SerialPort({
	path: process.env.PORT_PATH,
	baudRate: 9600,
});

arduinoSerialPort.on("open", () => {
	console.log("Serial Port is open");
});

function writeToSerialPort(jsonData) {
	try {
		arduinoSerialPort.write(jsonData);
	} catch (error) {
		console.log(error);
		throw new Error("Arduino error");
	}
}

exports.writeToSerialPort = writeToSerialPort;
