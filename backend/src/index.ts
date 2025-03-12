import WebSocket, { WebSocketServer } from "ws";
import express, { Request, Response } from "express";
import prisma from "./db";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

interface chatSchema {
	id?: string;
	content: string;
	userId: string;
	createdAt?: string;
}

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

wss.on("connection", (ws) => {
	if (!wsClients.has(ws)) {
		const time = Date.now();
		wsClients.set(ws, time.toString());
	}

	ws.on("error", (error) => {
		console.log("Error:", error);
	});

	console.log(wsClients.size);

	console.log(`Client connected: `, wsClients.get(ws));

	ws.on("message", async (message) => {
		const data = message.toString();
		if (!data) {
			throw new Error("Empty message received");
		}
		const parsed_data = JSON.parse(data) as websocketMessage;

		if (!parsed_data.userId || !parsed_data.content) {
			throw new Error("Invalid message format");
		}
		console.log(parsed_data);

		try {
			const createUser = await prisma.user.create({
				data: {
					id: wsClients.get(ws)!,
				},
			});
			if (createUser) {
				const createMesage = await prisma.message.create({
					data: {
						content: parsed_data.content,
						userId: parsed_data.userId,
					},
				});

				if (createMesage) {
					wsClients.forEach((id, client) => {
						if (client.readyState === WebSocket.OPEN) {
							client.send(data);
						}
					});
				}
			}
		} catch (err) {
			console.log("Error: ", err);
			throw new Error("Failed to create user");
		}
	});

	ws.on("close", async () => {
		console.log("Disconneted clients: ", wsClients.get(ws));

		try {
			await prisma.user.delete({
				where: {
					id: wsClients.get(ws),
				},
			});
		} catch (err) {
			console.log("Error: ", err);
		}

		wsClients.delete(ws);
		console.log(wsClients.size);
	});
});

app.get("/messages", async (req: Request, res: Response) => {
	try {
		// console.log("ok");
		const message = await prisma.message.findMany({});
		// console.log("ok", message);
		res.status(200).json({ msg: "Success", messages: message });
	} catch (e) {
		console.log("Error" + e);
		res.status(400).json({ msg: "Failed" });
	}
});
