import { useUser } from "../providers/UserProvider";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const Home = () => {
  const { user } = useUser();
  const [calendarEmbedUrl, setCalendarEmbedUrl] = useState("");
  const [status, setStatus] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status) {
      setStatus(status);
      if (user && status === 'calendar_access_granted') {
        fetchCalendarEmbedUrl();
      }
    }
  }, [user, location.search]);

  const fetchCalendarEmbedUrl = () => {
    fetch('/user/calendar', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.calendar_embed_url) {
          setCalendarEmbedUrl(data.calendar_embed_url);
        }
      })
      .catch((error) => console.error("Error fetching calendar embed URL:", error));
  };

  const handleGoogleCalendarAuth = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/google/calendar', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authorization_url;
      } else {
        console.error("Error initiating Google Calendar authorization:", response.statusText);
      }
    } catch (error) {
      console.error("Error initiating Google Calendar authorization:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Box>
      <h1>
        Hi {user.first_name} {user.last_name} with email {user.email}
      </h1>
      {status === 'calendar_access_granted' && <p>Calendar access granted!</p>}
      <Button variant="contained" color="primary" onClick={handleGoogleCalendarAuth}>
        Authorize Google Calendar
      </Button>
      {calendarEmbedUrl && (
        <iframe
          src={calendarEmbedUrl}
          style={{ border: 0, width: '100%', height: '600px' }}
        ></iframe>
      )}
    </Box>
  );
};

export default Home;



