import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import Landing from "./components/Landing";

function App() {
  return (
    <>
      <Toaster />
      <Landing />
    </>
  );
}

export default App;
