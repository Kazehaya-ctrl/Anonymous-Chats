import React from "react";
import { User } from "lucide-react";

interface ChatMessageProps {
	message: string;
	sender?: string;
	timestamp?: string;
	isOwn?: boolean;
}

export default function ChatMessage({
	message,
	sender,
	timestamp,
}: ChatMessageProps) {
	return (
		<div className="flex items-center justify-start p-4">
			<div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
				{message}
			</div>
		</div>
	);
}
