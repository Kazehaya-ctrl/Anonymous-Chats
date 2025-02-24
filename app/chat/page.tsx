"use client"
import React, { useEffect, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { chatSchema } from '@/components/interface/schema';

// const initialMessages = [
//     { id: 1, text: 'Hello!', timestamp: '10:30 AM', type: 'received' },
//     { id: 2, text: 'Hi! How are you?', timestamp: '10:31 AM', type: 'sent' },
//     { id: 3, text: 'I am fine, thanks! And you?', timestamp: '10:32 AM', type: 'received' },
//     { id: 4, text: 'Doing great, working on a new project!', timestamp: '10:35 AM', type: 'sent' },
//     { id: 5, text: 'Sounds exciting! Would love to hear more.', timestamp: '10:37 AM', type: 'received' },
//     { id: 6, text: 'Definitely, will share the details soon.', timestamp: '10:40 AM', type: 'sent' }
// ];

const ChatUI = () => {
    const [messages, setMessages] = useState<Array<chatSchema>>();
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null)

    
    useEffect(() => {
        const socket_connection = new WebSocket('ws://localhost:3002')
        setSocket(socket_connection)
        
        socket_connection.onmessage = async (response) => {
            const text_response = await response.data.text()
            const parsed_data = JSON.parse(text_response)
            console.log(parsed_data)
            setMessages((prev) => prev ? [...prev, parsed_data] : [parsed_data])
        }
        
        return () => {
            socket_connection.close()
        }
    }, [])
    
    const sendMessage = () => {
        const userId = localStorage.getItem('clientId')
        const infoToServer = JSON.stringify({id: userId, msg: input})
        socket!.send(infoToServer)
    };
    
    useEffect(() => {
        const fetch_messages = async () => {
            const stored_msg = await fetch('http://localhost:3002/messages')
            const msg_response = await stored_msg.json()
            setMessages(msg_response)
        }

        fetch_messages()
    }, [sendMessage])

    const renderMessage = (message: any) => (
        <motion.div 
        initial={{ opacity: 0, y: 10, rotate: 2 }} 
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`flex items-end p-2 my-1 ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}> 
        {message.type === 'received' && (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white font-bold">U</span>
            </div>
        )}
        <div 
            className={`p-3 hover:scale-105 backdrop-blur-xl transition-transform max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-lg opacity-80 
                ${message.type === 'sent' ? 'bg-blue-700/30 text-white' : 'bg-black/50 text-white'}`}
              > 
            {message.text}
            <div className={`text-xs text-right mt-1 ${message.type === 'sent' ? 'text-gray-400' : 'text-gray-300'}`}>{message.timestamp}</div>
        </div>
        </motion.div>
  );

  return (
        <div className="h-screen w-screen flex flex-col bg-black bg-[radial-gradient(#5a5a5a_2px,transparent_2px)] bg-[size:20px_20px] text-white overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* {messages.map((message) => renderMessage(message))} */}
            </div>
            <div className="bg-black border-t border-gray-700 p-3 flex items-center">
                <input 
                    type="text" 
                    placeholder="Type your message here..." 
                    className="flex-1 p-2 border border-gray-600 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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