import { ElysiaWS } from "elysia/dist/ws";
import { wsClient } from "../../schema/types";
import { prisma } from "../../prisma/db/prisma";

export const websocket_open = async (ws: ElysiaWS) => {
	try {
		wsClient.set(ws.id, ws);
		await prisma.user.create({
			data: {
				id: ws.id,
			},
		});
		console.log(`Connection opened ${ws.id}`);
		ws.send(JSON.stringify({ type: "saveUserId", userId: ws.id }));
	} catch (err) {
		console.log(err);
	}
};
