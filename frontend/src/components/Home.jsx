import { useUser } from "../providers/UserProvider";
import { Button, Box } from "@mui/material";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useUser();

  if (!user) return <div>Loading...</div>;
  return (
    <Box>
      <h1>
        Hi {user.first_name} {user.last_name} with email {user.email}
      </h1>
    </Box>
  );
};

export default Home;
