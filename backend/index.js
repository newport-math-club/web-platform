// Dependencies
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const express = require("express");
// Real stuff
initializeApp();
const db = getFirestore();
const app = express();
app.get("/api/ping", (_, res) => {
	res.send("Pong!");
});
app.use("/api/register", express.urlencoded({extended: false}));
app.post("/api/register", async (req, res) => {
	console.log(req.body);
	const teamReference = db.collection("teams").doc(req.body["team-name"]);
	teamReference.set(req.body);
	res.send(req.body);
});
exports.api = functions.https.onRequest(app);