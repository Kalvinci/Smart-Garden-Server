const { exec } = require("child_process");
const { Plants, getPlantData } = require("./dbService");
const { writeToSerialPort } = require("./arduinoService");

async function listPlants() {
	try {
		const plants = await Plants.find({}, { _id: false, __v: false })
			.sort({ rackId: "asc" })
			.exec();
		console.log("Plants retrieved successfully!");
		return plants;
	} catch (error) {
		console.log("Error while retrieving plants", error);
		throw error;
	}
}

async function getPlantInfo(rackId) {
	try {
		let plant = await getPlantData(rackId);
		if (!plant) throw new Error(`No plant exists in rack ${rackId}`);
		const { stderr } = await exec("./checkPlant.sh");
		if (stderr) {
			throw new Error(stderr);
		}
		const data = JSON.stringify({ action: "PLANT_INFO", rackId });
		writeToSerialPort(data);
		console.log("Retrieving plant info!");
		return "Hang tight! I'm getting you the plant info :)";
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
		const data = JSON.stringify({ action: "SET_PLANT", ...plantDetails });
		writeToSerialPort(data);
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
		const result = await Plants.findOneAndUpdate(
			{ rackId: plantDetails.rackId },
			plantDetails.updateProperty
		);
		if (!result) throw new Error(`No plant exists in rack ${rackId}`);
		const data = JSON.stringify({ action: "EDIT_PLANT", ...plantDetails });
		writeToSerialPort(data);
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

function waterPlant(rackId) {
	const data = JSON.stringify({ action: "WATER", rackId });
	writeToSerialPort(data);
}

function lightPlant(rackId, state) {
	const data = JSON.stringify({
		action: "LIGHT",
		state,
		rackId,
	});
	writeToSerialPort(data);
}

exports.listPlants = listPlants;
exports.getPlantInfo = getPlantInfo;
exports.setPlant = setPlant;
exports.editPlant = editPlant;
exports.removePlant = removePlant;
exports.waterPlant = waterPlant;
exports.lightPlant = lightPlant;
