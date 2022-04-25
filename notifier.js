const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

mongoose
	.connect(process.env.CONNECTION_URL)
	.catch((error) => console.log("mongodb connection error", error));

async function sendNotification(type, data) {
	try {
		const postData = await getPostData(type, data);
		await axios.post(process.env.DISCORD_WEBHOOK_URL, postData);
	} catch (error) {
		console.log(error);
		throw new Error("Error sending message");
	}
}

async function getPostData(type, data) {
	let postData;
	if (type === "WATER_ALERT") {
		postData = {
			content:
				"Your plants are running out of water :disappointed_relieved:",
			embeds: [
				{
					image: {
						url: "https://c.tenor.com/5J2A7MTVr-IAAAAC/summer-water-spongebob-squarepants.gif",
					},
				},
			],
		};
	} else if (type === "PLANT_INFO") {
		const plantDBData = await getPlantDBData(data.rackId);
		postData = {
			content: `I have got you the info of plant in rack ${data.rackId} :smiley:`,
			embeds: [
				{
					color: parseInt("0x12e385", 16),
					fields: [
						{
							name: "Rack",
							value: plantDBData.rackId.toString(),
							inline: true,
						},
						{
							name: "Name",
							value: plantDBData.name,
							inline: true,
						},
						{
							name: "Temperature",
							value: `${data.temperature} / ${plantDBData.temperature}`,
							inline: true,
						},
						{
							name: "Humidity",
							value: `${data.humidity} / ${plantDBData.humidity}`,
							inline: true,
						},
						{
							name: "Moisture",
							value: `${data.moisture} / ${plantDBData.moisture}`,
							inline: true,
						},
						{
							name: "Light",
							value: `${data.light} / ${plantDBData.light}`,
							inline: true,
						},
					],
					image: {
						url: "https://www.thespruce.com/thmb/_6OfTexQcyd-3aW8Z1O2y78sc-Q=/2048x1545/filters:fill(auto,1)/snake-plant-care-overview-1902772-04-d3990a1d0e1d4202a824e929abb12fc1-349b52d646f04f31962707a703b94298.jpeg",
					},
					timestamp: new Date(),
				},
			],
		};
	}
	return postData;
}

async function getPlantDBData(rackId) {
	const Plants = new mongoose.model(process.env.COLLECTION_NAME);
	let plant = await Plants.findOne({ rackId }, { _id: false, __v: false });
	return plant;
}

exports.sendNotification = sendNotification;
