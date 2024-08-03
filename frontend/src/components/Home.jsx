import { useUser } from "../providers/UserProvider";
import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const { user } = useUser();
  const [calendarEmbedUrl, setCalendarEmbedUrl] = useState("");
  const [status, setStatus] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [eventData, setEventData] = useState({
    summary: "",
    description: "",
    start: {
      dateTime: "",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "",
      timeZone: "America/New_York",
    },
  });
  const [iframeKey, setIframeKey] = useState(0);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // const status = params.get('status');
    // if (status) {
    // console.log("This is the status" + status);
    // setStatus(status);
    if (user && user.credentials) {
      console.log("fetch called");
      fetchCalendarEmbedUrl();
    }
    // }
  }, [user, location.search]);

  useEffect(() => {
    console.log("Updated calendar embed URL:", calendarEmbedUrl);
  }, [calendarEmbedUrl]);

  const fetchCalendarEmbedUrl = () => {
    fetch(`${backendURL}/user/calendar`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.calendar_embed_url) {
          setCalendarEmbedUrl(data.calendar_embed_url);
        }
      })
      .catch((error) =>
        console.error("Error fetching calendar embed URL:", error)
      );
  };

  const handleGoogleCalendarAuth = async () => {
    try {
      const response = await fetch(`${backendURL}/auth/google/calendar`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authorization_url;
      } else {
        console.error(
          "Error initiating Google Calendar authorization:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error initiating Google Calendar authorization:", error);
    }
  };

  const createEmpowerCalendar = () => {
    fetch(`${backendURL}/user/calendar/create`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.calendar_id) {
          console.log(`Calendar created with ID: ${data.calendar_id}`);
          setCalendarId(data.calendar_id);
          const newEmbedUrl = `https://calendar.google.com/calendar/embed?src=${data.calendar_id}&ctz=America/New_York`;
          setCalendarEmbedUrl(newEmbedUrl);
        }
      })
      .catch((error) => console.error("Error creating calendar:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");

    if (child) {
      setEventData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setEventData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addEvent = (e) => {
    e.preventDefault();
    const event = {
      summary: eventData.summary,
      description: eventData.description,
      start: {
        dateTime: new Date(eventData.start.dateTime).toISOString(),
        timeZone: eventData.start.timeZone,
      },
      end: {
        dateTime: new Date(eventData.end.dateTime).toISOString(),
        timeZone: eventData.end.timeZone,
      },
    };

    fetch(`${backendURL}/user/calendar/event`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ calendar_id: calendarId, event }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Event added: ${data.event}`);
        setIframeKey((prevKey) => prevKey + 1);
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Box className="space-y-8">
      <h1 className="text-white text-2xl text-bold">
        Hi {user.first_name} {user.last_name}
      </h1>
      {!calendarEmbedUrl && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoogleCalendarAuth}
        >
          Authorize Google Calendar
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={createEmpowerCalendar}
      >
        Open Empower Calendar
      </Button>
      {calendarEmbedUrl && (
        <iframe
          key={iframeKey}
          src={calendarEmbedUrl}
          style={{ border: 0, width: "100%", height: "600px" }}
        ></iframe>
      )}
      {calendarId && (
        <form onSubmit={addEvent} className="bg-white p-8">
          <h1 className="text-bold text-xl text-black">
            Please enter the event information:{" "}
          </h1>
          <TextField
            type="text"
            name="summary"
            label="Event Summary"
            value={eventData.summary}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            type="text"
            name="description"
            label="Event Description"
            value={eventData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            type="datetime-local"
            name="start.dateTime"
            label="Start Time"
            value={eventData.start.dateTime}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="datetime-local"
            name="end.dateTime"
            label="End Time"
            value={eventData.end.dateTime}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Event
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Home;
