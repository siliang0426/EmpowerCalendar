import { Button, Box } from "@mui/material";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useUser } from "../providers/UserProvider";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const GoogleAuthBtn = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const authCode = credentialResponse.credential;
    try {
      const response = await fetch(`${backendURL}/auth/google`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authCode }),
      });

      if (!response.ok) {
        const serverText = await response.text();
        toast.error(serverText);
      } else {
        const data = await response.json();
        setUser(data.user);
        toast.success(data["message"]);
        navigate("/home");
      }
    } catch (error) {
      toast.error("Google login request was not handled properly");
      console.error("Error sending token to backend:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 3,
        py: 1.5,
      }}
    >
      <Button
        sx={{
          margin: "auto",
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            toast.error("Google Login Failed!");
          }}
        />
      </Button>
    </Box>
  );
};

export default GoogleAuthBtn;
