import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Landing from "./components/Landing";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import ChatGPT from "./components/ChatGPT";
import GPT from "./components/GPT";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./providers/UserProvider";

const GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <BrowserRouter>
        <NavBar />
        <Toaster />
        <UserProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth">
              <Route path="sign-in" element={<Login />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route>
            <Route path="/gpt" element={<GPT />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<ChatGPT />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
