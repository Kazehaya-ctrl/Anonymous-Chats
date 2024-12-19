"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";

export default function Chat() {
	const [socket, setSocket] = useState<WebSocket>();
	const [msg, setMsg] = useState<string>("");
	const [allMessage, setallMessage] = useState<Array<string>>([]);

	const handleSendMessage = async (message: string) => {
		const id = localStorage.getItem("userId");
		try {
			const jsonResponse = JSON.stringify({ message, id });
			if (socket) {
				socket.send(jsonResponse);
			} else {
				console.log("Connection is not established");
			}
		} catch (e) {
			console.log("Error" + e);
		}
	};

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:3002");

		socket.onopen = () => {
			console.log("Connection Established");
		};
		socket.onmessage = (message) => {
			setMsg(message.data);
		};

		return () => {
			socket.close();
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
			<ChatMessage />
			<ChatInput onSendMessage={(message) => handleSendMessage(message)} />
		</>
	);
}
