"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";

export default function Chat() {
	const [socket, setSocket] = useState<WebSocket>();
	const [msg, setMsg] = useState<string>("");
	const handleSendMessage = () => {};

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:3002");

		socket.onopen = () => {
			console.log("Connection Established");
		};
		socket.onmessage = (message) => {
			setMsg(message.data);
		};
	}, []);

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
			<ChatMessage message={msg} sender={} />
			<ChatInput onSendMessage={handleSendMessage} />
		</>
	);
}
