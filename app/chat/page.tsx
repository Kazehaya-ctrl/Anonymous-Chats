"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";

export default function Chat() {
	const [socket, setSocket] = useState<WebSocket>();
	const [allMessage, setallMessage] = useState<Array<object>>([]);

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
		const fetchAllmsg = async () => {
			const msgs = await fetch("http://localhost:3002/messages");
			const repsonse = await msgs.json();
			setallMessage(repsonse);
		};

		fetchAllmsg();
	}, []);

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:3002");

		socket.onopen = () => {
			console.log("Connection Established");
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
			{allMessage.map((element: any) => {
				return (
					<div key={element.id}>
						<ChatMessage message={element.message} />
					</div>
				);
			})}
			<ChatInput onSendMessage={(message) => handleSendMessage(message)} />
		</>
	);
}
