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
							const user = await fetch("http://localhost:3002/join", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
							});
							if (!user.ok) throw new Error("Failed to fetch user");
							const response = await user.json();
							console.log(response);
							if (response) {
								localStorage.setItem("userId", response.user.id.toString());
								router.push("/chat");
							} else {
								console.log("Response not found");
							}
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
