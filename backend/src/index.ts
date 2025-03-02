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

	console.log("Helo world", ws);
	console.log(wsClients.size);

	console.log(`Client connected: `, wsClients.get(ws));

	ws.on("message", async (message) => {
		try {
			const data = message.toString();
			const jsonMessage = JSON.parse(data) as chatSchema;

			if (jsonMessage) {
				const post_messages = await prisma.message.create({
					data: {
						content: jsonMessage.content,
						userId: jsonMessage.userId,
					},
				});
				if (post_messages) {
					const parsed_data = JSON.stringify(post_messages);
					wsClients.forEach((_, webskt) => {
						webskt.send(parsed_data);
					});
				}
			}
			console.log(message);
		} catch (e) {
			console.log("Invalid msg", e);
		}
	});

	ws.on("close", () => {
		console.log("Disconneted clients: ", wsClients.get(ws));
		wsClients.delete(ws);
		console.log(wsClients.size);
	});
});

// wss.on("connection", (ws) => {
// 	ws.on("error", (error) => {
// 		console.log("Error" + error);
// 	});

// 	ws.on("message", async (data, isBinary) => {
// 		const message = data.toString();
// 		const jsonData = JSON.parse(message);

// 		if(!wsClients.has(ws)) {
// 			wsClients.set(ws, jsonData.id)
// 		}
// 		await prisma.message.create({
// 			data: {
// 				createdAt: new Date(),
// 				content: jsonData.message,
// 				userId: jsonData.id,
// 			},
// 		});
// 		wss.clients.forEach((client) => {
// 			if (client.readyState === WebSocket.OPEN) {
// 				client.send(data, { binary: isBinary });
// 			}
// 		});
// 	});

// 	ws.on("close", async () => {
// 		console.log('Client Disconnected')
// 		const deleteUser = await prisma.user.delete({
// 			where: {
// 				id: wsClients.get(ws)
// 			}
// 		})

// 		wsClients.delete(ws)
// 	})
// });

app.post("/join", async (req: Request, res: Response) => {
	try {
		const user = await prisma.user.create({
			data: {
				id: String(Date.now()),
			},
		});
		if (user) {
			const userResponse = {
				...user,
				id: user.id.toString(),
			};
			res.status(200).json({
				msg: "Success",
				user: userResponse,
			});
		} else {
			res.status(400).json({ msg: "User not made" });
		}
	} catch (e) {
		console.log("Error" + e);
		res.status(400).json({ msg: "Failed" });
	}
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
