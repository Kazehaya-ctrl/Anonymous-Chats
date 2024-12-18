import React from "react";
import { Users, Phone, Video } from "lucide-react";

export default function ChatHeader() {
	return (
		<div className="flex items-center justify-between p-4 border-b bg-white">
			<div className="flex items-center space-x-4">
				<div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
					<Users className="w-6 h-6 text-white" />
				</div>
				<div>
					<h2 className="text-lg font-semibold">Team Chat</h2>
					<p className="text-sm text-gray-500">5 members • 2 online</p>
				</div>
			</div>
			<div className="flex space-x-2">
				<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
					<Phone className="w-5 h-5 text-gray-600" />
				</button>
				<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
					<Video className="w-5 h-5 text-gray-600" />
				</button>
			</div>
		</div>
	);
}
