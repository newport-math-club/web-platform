const express = require("express");
const app = express();
const port = 3001;
app.get("/api/ping", (_, res) => {
	res.send("Pong!");
});
app.listen(port, () => console.log(`Backend is live on port ${port}`));