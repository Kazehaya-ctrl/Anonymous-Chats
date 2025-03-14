import { Elysia } from "elysia";
import { websocket_open } from "../controllers/websocket/websocket.open";
import { websocket_message } from "../controllers/websocket/websocket.message";
import { websocket_close } from "../controllers/websocket/websocket.close";
import { cors } from "@elysiajs/cors";
import { getMessage } from "../controllers/get.messages";

const app = new Elysia()
	.use(cors())
	.get("/messages", getMessage)

	.ws("/", {
		open: websocket_open,
		message: websocket_message,
		close: websocket_close,
	})
	.listen(process.env.PORT || 3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
