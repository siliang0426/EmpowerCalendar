// src/JobList.js
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledList = styled(List)({
  width: "80%",
  backgroundColor: "#ffffff",
  margin: "auto",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

const StyledListItem = styled(ListItem)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  backgroundColor: "#e1bee7",
  marginBottom: "10px",
  borderRadius: "8px",
  padding: "10px",
});

const StyledAvatar = styled(Avatar)({
  backgroundColor: "#8e24aa",
  color: "#ffffff",
});

const JobTitle = styled(Typography)({
  fontWeight: "bold",
  color: "#8e24aa",
  fontSize: "18px",
});

const JobDescription = styled(Typography)({
  color: "#424242",
  fontSize: "16px",
  marginLeft: "20px",
  flexGrow: 1,
});

const JobList = ({ jobs }) => {
  console.log(jobs);
  if (!jobs) return <h1>Trying asking the bot something!</h1>;
  return (
    <StyledList>
      {jobs.map((job, index) => (
        <StyledListItem key={index}>
          <ListItemAvatar>
            <StyledAvatar>{index + 1}</StyledAvatar>
          </ListItemAvatar>
          <ListItemText
            primary={<JobTitle>{job.title}</JobTitle>}
            secondary={<JobDescription>{job.explanation}</JobDescription>}
          />
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default JobList;
