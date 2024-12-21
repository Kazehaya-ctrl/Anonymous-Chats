"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";

interface messageSchema {
	id: number;
	createdAt: Date;
	content: string;
	userId: number;
}

export default function Chat() {
	const [socket, setSocket] = useState<WebSocket>();
	const [allMessage, setallMessage] = useState<messageSchema[]>([]);

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
			if (msgs.ok) {
				const repsonse = await msgs.json();
				console.log(repsonse);
				setallMessage(repsonse.messages);
			} else {
				console.log("Error");
			}
		};

		fetchAllmsg();
	}, [handleSendMessage]);

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:3002");

		socket.onopen = () => {
			console.log("Connection Established");
		};
		setSocket(socket);
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
						<ChatMessage message={element.content} />
					</div>
				);
			})}
			<ChatInput onSendMessage={(message) => handleSendMessage(message)} />
		</>
	);
}
