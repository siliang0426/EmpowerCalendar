// src/components/GPT.jsx
import React, { useState } from "react";
import "../css/ChatGPT.css"; // Import the CSS file
import JobList from "./JobList";
import { CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/system";

const LoadingContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100px",
});

function GPT() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setResponse(JSON.parse(data.response));
    } catch (error) {
      console.error("Error sending message:", error);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat with GPT</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
        className="chat-input"
      />
      <button onClick={handleSubmit} className="chat-button">
        Send
      </button>
      {loading ? (
        <LoadingContainer>
          <CircularProgress />
          <Typography variant="h6" className="mt-4">
            GPT is recommending some jobs for you...
          </Typography>
        </LoadingContainer>
      ) : (
        <div className="response-container">
          <h2>Response:</h2>
          <JobList jobs={response} />
        </div>
      )}
    </div>
  );
}

export default GPT;
