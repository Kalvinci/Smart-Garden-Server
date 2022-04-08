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
		if (error.message.includes("duplicate"))
			throw new Error(`Rack ${plantDetails.rackId} is occupied!`);
		throw error;
	}
}

async function editPlant(plantDetails) {
	try {
		console.log(plantDetails.updateProperty);
		const result = await Plants.findOneAndUpdate(
			{ rackId: plantDetails.rackId },
			plantDetails.updateProperty
		);
		if (!result) throw new Error(`No plant exists in rack ${rackId}`);
		console.log("Plant updated successfully!");
		return "Plant updated successfully!";
	} catch (error) {
		console.log("Error while setting plant", error);
		throw new Error(`No plant exists in rack ${plantDetails.rackId}`);
	}
}

async function removePlant(rackId) {
	try {
		let plant = await Plants.findOne({ rackId }, "name");
		if (!plant) throw new Error(`No plant exists in rack ${rackId}`);
		await Plants.deleteOne({ rackId });
		console.log("Plant removed successfully!");
		return `${plant.name} has been removed from rack ${rackId}!`;
	} catch (error) {
		console.log("Error while removing plant", error);
		throw error;
	}
}

exports.listPlants = listPlants;
exports.getPlantInfo = getPlantInfo;
exports.setPlant = setPlant;
exports.editPlant = editPlant;
exports.removePlant = removePlant;
