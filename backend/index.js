// Dependencies
const functions = require("firebase-functions");
const express = require("express");
// Real stuff
const app = express();
app.get("/api/ping", (_, res) => {
	res.send("Pong!");
});
app.use("/api/register", express.urlencoded({extended: false}));
app.post("/api/register", (req, res) => {
	res.send(req.body);
});
exports.api = functions.https.onRequest(app);