import axios from 'axios';
import React, { useState } from 'react';

const WpDemo = () => {
    const [number, setNumber] = useState('');

    const sendMsg = () => {
        console.log("Number is", number);

        const body = {
            "messaging_product": "whatsapp",
            "to": "918840801234",
            "type": "template",
            "template": {
                "name": "hello_world",
                "language": {
                    "code": "en_US"
                }
            }
        };

        axios.post('https://graph.facebook.com/v15.0/100763252803295/messages', body)
            .then((res) => {
                console.log("Msg Send Success", res);
            })
            .catch((err) => {
                console.log("Error while sending", err);
            });
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Side: Branding/Logo */}
                <div className="text-white text-2xl font-bold">
                    MyApp
                </div>
                
                {/* Right Side: Input and Button */}
                <div className="flex space-x-4 items-center">
                    <input
                        onChange={(e) => setNumber(e.target.value)}
                        type="text"
                        placeholder="Enter WhatsApp Number"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button 
                        onClick={sendMsg} 
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
                    >
                        Send Msg
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default WpDemo;
