const axios = require("axios");
require("dotenv").config();

async function sendNotification(message) {
	try {
		await axios.post(process.env.WEB_HOOK_URL, {
			content: message,
		});
	} catch (error) {
		console.log(error);
		throw new Error("Error sending message");
	}
}
