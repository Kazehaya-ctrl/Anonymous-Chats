import React from "react";
import { User } from "lucide-react";

interface ChatMessageProps {
	message: string;
	sender: string;
	timestamp: string;
	isOwn: boolean;
}

export default function ChatMessage({
	message,
	sender,
	timestamp,
	isOwn,
}: ChatMessageProps) {
	return (
		<div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
			<div
				className={`flex ${
					isOwn ? "flex-row-reverse" : "flex-row"
				} items-end max-w-[80%]`}
			>
				<div className="flex-shrink-0 mr-2 ml-2">
					<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
						<User className="w-5 h-5 text-gray-500" />
					</div>
				</div>
				<div>
					<div
						className={`${
							isOwn ? "bg-blue-500 text-white" : "bg-gray-100"
						} rounded-2xl px-4 py-2`}
					>
						<p className="text-sm font-medium mb-1">{sender}</p>
						<p className="text-sm">{message}</p>
					</div>
					<p
						className={`text-xs text-gray-500 mt-1 ${
							isOwn ? "text-right" : "text-left"
						}`}
					>
						{timestamp}
					</p>
				</div>
			</div>
		</div>
	);
}
