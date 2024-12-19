"use client";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	return (
		<div>
			<div className="bg-gray-100 h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Chat Anonymously!!!
					</h1>
					<button
						onClick={async () => {
							const user = await fetch("ws://localhost:3000/join", {
								method: "POST",
								headers: { "Content-Type": "Application/jsons" },
							});
							const response = await user.json();
							localStorage.setItem("userId", response.data.user.id);
						}}
						className="px-8 py-4 text-white font-semibold text-xl bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg transition duration-300"
					>
						JOIN
					</button>
				</div>
			</div>
		</div>
	);
}
