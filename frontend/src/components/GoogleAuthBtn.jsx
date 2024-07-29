import { Button, Box } from "@mui/material";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const GoogleAuthBtn = () => {
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const authCode = credentialResponse.credential;
    try {
      const response = await fetch(`${backendURL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authCode }),
      });

      const serverText = await response.text();
      if (!response.ok) {
        toast.error(serverText);
      } else {
        toast.success(serverText);
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
