import WebSocket, { WebSocketServer } from "ws";
import express, { Request, Response } from "express";
import prisma from "./db";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

interface websocketMessage {
	userId: string;
	content: string;
}

const app = express();
app.use(cors());
const server = app.listen(3002, () => {
	console.log(new Date() + " Running on port 3002");
});
const wss = new WebSocketServer({ server });
let wsClients = new Map<WebSocket, string>();

wss.on("connection", async (ws) => {
	try {
		const userId = Date.now().toString();
		await prisma.user.create({
			data: { id: userId },
		});
		wsClients.set(ws, userId);

		console.log(`Client connected: ${userId}`);
		ws.send(JSON.stringify({ type: "saveUserId", userId }));

		ws.on("message", async (message) => {
			try {
				const data = message.toString();
				if (!data) {
					throw new Error("Empty message received");
				}

				const parsed_data = JSON.parse(data) as websocketMessage;
				if (!parsed_data.userId || !parsed_data.content) {
					throw new Error("Invalid message format");
				}

				const newMessage = await prisma.message.create({
					data: {
						content: parsed_data.content,
						userId: parsed_data.userId,
					},
				});

				wss.clients.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(
							JSON.stringify({ type: "message", newMessage })
						);
					}
				});
			} catch (error) {
				console.error("Message handling error:", error);
				ws.send(JSON.stringify({ error: "Failed to process message" }));
				return;
			}
		});

		ws.on("close", async () => {
			const userId = wsClients.get(ws);
			if (userId) {
				await prisma.user.delete({ where: { id: userId } });
				wsClients.delete(ws);
			}
		});
	} catch (error) {
		console.error("Connection error:", error);
		ws.close();
	}
});

app.get("/messages", async (req: Request, res: Response) => {
	try {
		const message = await prisma.message.findMany({});
		res.status(200).json({ msg: "Success", messages: message });
	} catch (e) {
		console.log("Error" + e);
		res.status(400).json({ msg: "Failed" });
	}
});
