const axios = require("axios");
const { getPlantData } = require("./dbService");
require("dotenv").config();

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
		const plantDBData = await getPlantData(data.rackId);
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
						url: `${process.env.BASE_URL}/images/plant.jpg`,
					},
					timestamp: new Date(),
				},
			],
		};
	}
	return postData;
}

exports.sendNotification = sendNotification;
