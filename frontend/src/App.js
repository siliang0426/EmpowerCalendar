import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <SignUp />
      <Login />
    </>
  );
}

export default App;
