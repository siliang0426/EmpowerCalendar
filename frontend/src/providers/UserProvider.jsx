import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const UserContext = createContext();

export const useUser = () => {
  if (!UserContext) {
    throw new Error("useUser is not included in an UserProvider");
  }
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("use effect");
    const fetchCheckLogin = async () => {
      const res = await fetch(`${backendURL}/auth/check-login`, {
        credentials: "include",
      });

      console.log("fetch check login called");
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        if (data.loggedIn) {
          setUser(data.user);
          navigate("/home");
        } else if (
          location.pathname !== "/" &&
          location.pathname !== "/auth/sign-in" &&
          location.pathname !== "/auth/sign-up"
        ) {
          navigate("/chat");
        }
      } else {
        navigate("/");
        console.log("server send back error response");
      }
    };
    fetchCheckLogin();
  }, [location.pathname, navigate]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
