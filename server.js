const express = require("express");
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
