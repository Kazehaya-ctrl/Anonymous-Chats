import WebSocket, { WebSocketServer } from "ws";
import express, { Request, Response } from "express";
import prisma from "./db";
import cors from "cors";

const app = express();
app.use(cors());
const server = app.listen(3002, () => {
	console.log(new Date() + " Running on port 3002");
});
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
	ws.on("error", (error) => {
		console.log("Error" + error);
	});
	ws.on("message", async (data, isBinary) => {
		const message = data.toString();
		const jsonData = JSON.parse(message);
		await prisma.message.create({
			data: {
				createdAt: new Date(),
				content: jsonData.message,
				userId: jsonData.id,
			},
		});
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data, { binary: isBinary });
			}
		});
	});
});

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
		console.log("ok");
		const message = await prisma.message.findMany({});
		console.log("ok", message);
		res.status(200).json({ msg: "Success", messages: message });
	} catch (e) {
		console.log("Error" + e);
		res.status(400).json({ msg: "Failed" });
	}
});
