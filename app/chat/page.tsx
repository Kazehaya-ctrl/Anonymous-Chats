"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";

export default function Chat() {
	const [socket, setSocket] = useState<WebSocket>(
		new WebSocket("ws://localhost:3002")
	);
	const [msg, setMsg] = useState<string>("");
	const handleSendMessage = () => {
		socket.onopen = () => {
			let msg = "Connection Established";
			console.log(msg);
		};

		socket.onmessage = (message) => {};
	};

	useEffect(() => {}, []);

	if (!socket) {
		return (
			<>
				<div>Connection not Established</div>
			</>
		);
	}
	return (
		<>
			<ChatHeader />
			<ChatMessage />
			<ChatInput onSendMessage={handleSendMessage} />
		</>
	);
}
