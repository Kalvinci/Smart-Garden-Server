const mongoose = require("mongoose");
require("dotenv").config();

mongoose
	.connect(process.env.CONNECTION_URL)
	.catch((error) => console.log("mongodb connection error", error));

const plantSchema = new mongoose.Schema({
	rackId: {
		type: Number,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	temperature: {
		type: String,
		required: true,
	},
	humidity: {
		type: String,
		required: true,
	},
	moisture: {
		type: String,
		required: true,
	},
	light: {
		type: String,
		required: true,
	},
});

const Plants = new mongoose.model(process.env.COLLECTION_NAME, plantSchema);

async function getPlantData(rackId) {
	let plant = await Plants.findOne({ rackId }, { _id: false, __v: false });
	return plant;
}

exports.Plants = Plants;
exports.getPlantData = getPlantData;
