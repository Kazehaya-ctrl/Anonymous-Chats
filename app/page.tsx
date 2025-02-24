"use client"
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Animated Grid Background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(#5a5a5a_2px,transparent_2px)] bg-[size:20px_20px] opacity-70 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      ></motion.div>
      
      {/* Main Content */}
      <motion.div 
        className="text-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="hover:scale-105 duration-300 transition-transform text-5xl font-bold text-gray-200 mb-6 drop-shadow-lg">
          Chat Anonymously!!!
        </h1>
        <Link href="/chat">
          <motion.button
            onClick={async () => {
              const user_join = await fetch('http://localhost:3002/join', {
                method: 'POST'
              })
              const response_user = await user_join.json()
              if (response_user.msg === 'Success') {
                localStorage.setItem("clientId", response_user.user.id)
              } else {
                alert('User not created')
              }
            }}
            className="px-10 py-4 text-white font-semibold text-xl bg-purple-700 hover:bg-purple-900 rounded-xl shadow-2xl transition duration-150 transform hover:scale-105 active:scale-95 backdrop-blur-lg bg-opacity-80"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            JOIN
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
