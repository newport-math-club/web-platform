const express = require("express");
const app = express();
const port = process.env.PORT ?? 3001;
app.get("/api/ping", (_, res) => {
	res.send("Pong!");
});
app.use(express.static("../frontend"));
app.listen(port, () => console.log(`Backend is live on port ${port}`));