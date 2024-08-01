// src/components/GPT.jsx
import React, { useState } from 'react';

function GPT() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = () => {
        // Simulate API call
        setResponse(`Echo: ${input}`);
    };

    return (
        <div>
            <h1>Chat with GPT</h1>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message"
            />
            <button onClick={handleSubmit}>Send</button>
            <div>
                <h2>Response:</h2>
                <p>{response}</p>
            </div>
        </div>
    );
}

export default GPT;
