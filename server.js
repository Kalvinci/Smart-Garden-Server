const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const {
	listPlants,
	getPlantInfo,
	setPlant,
	editPlant,
	removePlant,
	waterPlant,
	lightPlant,
} = require("./plantService");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("Smart Garden Server up & running :)");
});

app.get("/listplants", async (req, res) => {
	try {
		const response = await listPlants();
		return res.send(response);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.get("/plantinfo/:rackId", async (req, res) => {
	try {
		const rackId = req.params.rackId;
		const response = await getPlantInfo(rackId);
		exec("./checkPlant.sh", (error, stdout, stderr) => {
			// catch err, stdout, stderr
			// if (error) {
			//     console.log('Error in removing files');
			//     return;
			// }
			// if (stderr) {
			//     console.log('an error with file system');
			//     return;
			// }
			// console.log('Result of shell script execution',stdout);
		});
		return res.send(response);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.post("/setplant", async (req, res) => {
	try {
		const plantDetails = req.body;
		const response = await setPlant(plantDetails);
		return res.send(response);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.post("/editplant", async (req, res) => {
	try {
		const plantDetails = req.body;
		const response = await editPlant(plantDetails);
		return res.send(response);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.post("/removeplant", async (req, res) => {
	try {
		const rackId = req.body.rackId;
		const response = await removePlant(rackId);
		return res.send(response);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.post("/water", (req, res) => {
	const { rackId } = req.body;
	waterPlant(rackId);
	return res.send(`Plant in rack ${rackId} watered`);
});

app.post("/light", (req, res) => {
	const { rackId, state } = req.body;
	lightPlant(rackId, state);
	return res.send(`Lights turned ${state} in rack ${rackId}`);
});

app.post("/humidity/:rackId", (req, res) => {});

app.post("/temperature/:rackId", (req, res) => {});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
