import { ElysiaWS } from "elysia/dist/ws";
import { prisma } from "../../prisma/db/prisma";
import { wsClient } from "../../schema/types";

export const websocket_close = async (ws: ElysiaWS) => {
	wsClient.delete(ws.id);
	try {
		await prisma.message.deleteMany({
			where: {
				userId: ws.id,
			},
		});
		await prisma.user.delete({
			where: {
				id: ws.id,
			},
		});
		console.log(`Connection closed ${ws.id}`);
	} catch (err) {
		console.log(err);
	}
};
