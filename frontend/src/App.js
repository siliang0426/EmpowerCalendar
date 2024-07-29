import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import Landing from "./components/Landing";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar/>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth">
            <Route path="sign-in" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
