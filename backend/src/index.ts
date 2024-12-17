import WebSocket, { WebSocketServer } from "ws";
import express from "express";

const app = express();
const server = app.listen(3002, () => {
	console.log(new Date() + " Running on port 3002");
});
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
	ws.on("error", (error) => {
		console.log("Error" + error);
	});
	ws.on("message", (data, isBinary) => {
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data, { binary: isBinary });
			}
		});
	});
	ws.send("Connection Established");
});

app.get("/chat", (req, res) => {
	res.json({ msg: "Succecss" });
});
