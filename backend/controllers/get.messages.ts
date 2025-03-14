import { prisma } from "../prisma/db/prisma";

export const getMessage = async () => {
	try {
		const messages = await prisma.message.findMany({});
		if (messages) {
			return { messages, msg: "Success" };
		} else {
			return { msg: "No messages found" };
		}
	} catch (err) {
		console.log(err);
		return { error: err, msg: "Failure" };
	}
};
