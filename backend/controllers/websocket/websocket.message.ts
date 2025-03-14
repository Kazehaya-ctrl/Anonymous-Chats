import { ElysiaWS } from "elysia/dist/ws";
import { Message } from "../../schema/interface";
import { prisma } from "../../prisma/db/prisma";
import { wsClient } from "../../schema/types";

export const websocket_message = async (ws: ElysiaWS, message: Message) => {
	try {
		const createMessage = await prisma.message.create({
			data: {
				content: message.content,
				userId: message.id,
			},
		});

		if (createMessage) {
			wsClient.forEach((client) => {
				if (client.id !== ws.id) {
					client.send(
						JSON.stringify({
							type: "message",
							newMessage: {
								...createMessage,
								createdAt:
									createMessage.createdAt.toLocaleTimeString(),
							},
						})
					);
				}
			});
		}
	} catch (err) {
		console.log(err);
	}
};
