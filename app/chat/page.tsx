"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { motion } from "framer-motion";

export interface chatSchema {
	id?: string;
	content: string;
	createdAt?: Date;
	userId: string;
	type?: string;
}

const ChatUI = () => {
	const [messages, setMessages] = useState<Array<chatSchema>>([]);
	const [incomingMessage, setIncomingMessage] = useState(0);
	const [input, setInput] = useState("");
	const [socket, setSocket] = useState<WebSocket | null>(null);

	// Create ref for message container
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Function to scroll to bottom
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Add effect to scroll when messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages, setMessages]);

	useEffect(() => {
		const socket_connection = new WebSocket("ws://localhost:3002");

		socket_connection.onmessage = async (response) => {
			const text_response = await response.data.text();
			setIncomingMessage((prev) => prev + 1);
			const parsed_data = JSON.parse(text_response);
			console.log(parsed_data);
			setMessages((prev) => [...prev, parsed_data]);
		};
		setSocket(socket_connection);

		return () => {
			socket_connection.close();
		};
	}, []);

	const sendMessage = () => {
		const user_id = localStorage.getItem("clientId");
		if (user_id === null) {
			alert("User not created");
			return;
		}
		const data_to_sent = {
			userId: user_id,
			content: input,
			type: "sent",
		};

		socket?.send(
			JSON.stringify({
				userId: user_id,
				content: input,
			})
		);

		setMessages((prev) =>
			prev ? [...prev, data_to_sent] : [data_to_sent]
		);
		setInput("");
	};

	useEffect(() => {
		const fetch_messages = async () => {
			const stored_msg = await fetch("http://localhost:3002/messages");
			const msg_response = await stored_msg.json();
			if (msg_response.length === 0) {
				return;
			}
			const messageResponse = msg_response.messages.map(
				(msg: chatSchema) => {
					// Create a new object with all existing properties
					return {
						...msg,
						// Add type property based on userId
						type:
							msg.userId === localStorage.getItem("clientId")
								? "sent"
								: "received",
					};
				}
			);
			setMessages(messageResponse);
			console.log(msg_response);
		};

		fetch_messages();
	}, [incomingMessage]);

	const renderMessage = (message: chatSchema) => (
		<motion.div
			key={message.id}
			initial={{ opacity: 0, y: 10, rotate: 2 }}
			animate={{ opacity: 1, y: 0, rotate: 0 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className={`flex items-end p-2 my-1 ${
				message.type === "sent" ? "justify-end" : "justify-start"
			}`}
		>
			{message.type === "received" && (
				<div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
					<span className="text-white font-bold">U</span>
				</div>
			)}
			<div
				className={`p-3 hover:scale-105 backdrop-blur-xl transition-transform max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-lg opacity-80 
                ${
					message.type === "sent"
						? "bg-blue-700/30 text-white"
						: "bg-black/50 text-white"
				}`}
			>
				{message.content}
				<div
					className={`text-xs text-right mt-1 ${
						message.type === "sent"
							? "text-gray-400"
							: "text-gray-300"
					}`}
				>
					{new Date(message.createdAt!).toLocaleTimeString()}
				</div>
			</div>
		</motion.div>
	);

	return (
		<div className="h-screen w-screen flex flex-col bg-black bg-[radial-gradient(#5a5a5a_2px,transparent_2px)] bg-[size:20px_20px] text-white overflow-hidden">
			<div
				className="flex-1 overflow-y-auto p-4"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{messages?.map((message) => renderMessage(message))}
				{/* Invisible div to scroll to */}
				<div ref={messagesEndRef} />
			</div>
			<div className="bg-black border-t border-gray-700 p-3 flex items-center">
				<input
					type="text"
					placeholder="Type your message here..."
					className="flex-1 p-2 border border-gray-600 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
				/>
				<button
					className="bg-blue-700/60 backdrop:blur-lg hover:scale-105 duration-200 transition hover:bg-blue-900 text-white font-bold py-2 px-4 rounded flex items-center ml-2"
					onClick={sendMessage}
				>
					<AiOutlineSend className="mr-2" /> Send
				</button>
			</div>
		</div>
	);
};

export default ChatUI;
