require("dotenv").config();
const mongoose = require("mongoose");

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
		type: Number,
		required: true,
	},
	humidity: {
		type: Number,
		required: true,
	},
	water: {
		type: Number,
		required: true,
	},
	light: {
		type: String,
		required: true,
	},
});

const Plants = new mongoose.model(process.env.COLLECTION_NAME, plantSchema);

async function listPlants() {
	try {
		const plants = await Plants.find({}, { _id: false, __v: false }).exec();
		console.log("Plants retrieved successfully!");
		return plants;
	} catch (error) {
		console.log("Error while retrieving plants", error);
		throw error;
	}
}

async function getPlantInfo(rackId) {
	try {
		let plant = await Plants.findOne(
			{ rackId },
			{ _id: false, __v: false }
		);
		if (!plant) throw new Error(`No plant exists in rack ${rackId}`);
		console.log("Plant info retrieved successfully!");
		return plant;
	} catch (error) {
		console.log("Error while retrieving plant", error);
		throw error;
	}
}

async function setPlant(plantDetails) {
	try {
		let plant = new Plants(plantDetails);
		plant = await plant.save();
		console.log("Plant set successfully!");
		return plant;
	} catch (error) {
		console.log("Error while setting plant", error);
		throw error;
	}
}

async function editPlant(plantDetails) {
	try {
		let plant = await Plants.findOne({ rackId: plantDetails.rackId });
		if (!plant) throw new Error(`No plant exists in rack ${rackId}`);
		plant.name = plantDetails.name;
		plant.temperature = plantDetails.temperature;
		plant.humidity = plantDetails.humidity;
		plant.water = plantDetails.water;
		plant.light = plantDetails.light;
		plant = await plant.save();
		console.log("Plant updated successfully!");
		return plant;
	} catch (error) {
		console.log("Error while setting plant", error);
		throw error;
	}
}

exports.listPlants = listPlants;
exports.getPlantInfo = getPlantInfo;
exports.setPlant = setPlant;
exports.editPlant = editPlant;
