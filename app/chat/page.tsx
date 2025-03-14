"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { motion } from "framer-motion";

interface msgTosendSchema {
	content: string;
	id: string;
}

interface messageSchema {
	content: string;
	time: string;
	type: "sent" | "recieved";
}

const ChatUI = () => {
	const [messages, setMessages] = useState<Array<messageSchema>>([]);
	const [input, setInput] = useState("");
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, setMessages]);

	useEffect(() => {
		const socket_connection = new WebSocket("ws://localhost:3002");

		socket_connection.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "saveUserId") {
				setUserId(message.userId);
			} else if (message.type === "message") {
				setMessages((prev) => [
					...prev,
					{
						content: message.newMessage.content,
						time: message.newMessage.createdAt,
						type:
							message.newMessage.userId === userId
								? "sent"
								: "recieved",
					},
				]);
			}
		};

		setSocket(socket_connection);

		return () => {
			socket_connection.close();
		};
	}, []);

	useEffect(() => {
		const fetchMessages = async () => {
			const stored_messages = await fetch(
				"http://localhost:3002/messages"
			);
			const response = await stored_messages.json();
			response.messages.forEach((message: any) => {
				setMessages((prev) => [
					...prev,
					{
						content: message.content,
						time: message.time,
						type: message.userId === userId ? "sent" : "recieved",
					},
				]);
			});
		};

		fetchMessages();
	}, []);

	const sendMessage = () => {
		const message: msgTosendSchema = {
			content: input,
			id: userId || "",
		};

		socket?.send(JSON.stringify(message));
		setMessages((prev) => [
			...prev,
			{
				content: input,
				time: new Date().toLocaleTimeString(),
				type: "sent",
			},
		]);
		setInput("");
	};

	const renderMessage = (message: messageSchema, index: any) => (
		<motion.div
			key={index}
			initial={{ opacity: 0, y: 10, rotate: 2 }}
			animate={{ opacity: 1, y: 0, rotate: 0 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className={`flex items-end p-2 my-1 ${
				message.type === "sent" ? "justify-end" : "justify-start"
			}`}
		>
			{message.type === "recieved" && (
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
					{message.time}
				</div>
			</div>
		</motion.div>
	);

	return (
		<div className="h-screen w-screen flex flex-col items-center bg-black bg-[radial-gradient(#5a5a5a_2px,transparent_2px)] bg-[size:20px_20px] text-white overflow-hidden">
			<div
				className="flex-1 overflow-y-auto p-4"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{messages?.map((message, index) =>
					renderMessage(message, index)
				)}
				<div ref={messagesEndRef} />
			</div>
			<div className="bg-black w-[90vh]  border-t border-gray-700 p-3 flex items-center">
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
