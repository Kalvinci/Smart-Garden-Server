const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { sendNotification } = require("./notifier");
require("dotenv").config();

const arduinoSerialPort = new SerialPort({
	path: process.env.PORT_PATH,
	baudRate: 9600,
});

arduinoSerialPort.on("open", () => {
	console.log("Serial Port is open");
});

const parser = new ReadlineParser();
arduinoSerialPort.pipe(parser);
parser.on("data", (message) => {
	sendNotification(message);
});

function writeToSerialPort(jsonData) {
	try {
		arduinoSerialPort.write(jsonData + "\n");
	} catch (error) {
		console.log(error);
		throw new Error("Arduino write error");
	}
}

exports.writeToSerialPort = writeToSerialPort;
