// src/components/GPT.jsx
import React, { useState } from 'react';
import '../css/ChatGPT.css'; // Import the CSS file

function GPT() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/chat', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            console.log('Response from backend:', data);
            setResponse(data.response);
        } catch (error) {
            console.error('Error sending message:', error);
            setResponse('An error occurred. Please try again.');
        }
    };

    return (
        <div className="chat-container">
            <h1>Chat with GPT</h1>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message"
                className="chat-input"
            />
            <button onClick={handleSubmit} className="chat-button">Send</button>
            <div className="response-container">
                <h2>Response:</h2>
                <p>{response}</p>
            </div>
        </div>
    );
}

export default GPT;
