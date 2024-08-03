# EmpowerCalendar

## Inspiration

All of the team members are First Generation Low-Income students. Money issues and the study-life balance are always a problem for us. We do not have the luxury compared to other students for spare money, instead, we need to work while studying. Thus, we wish there was a solution that could help with our financial capability while ensuring the academic path for us.

## What it does

Empower Calendar provides a platform for First Generation Low-Income students to organize and manage their study and work schedules efficiently. A custom tune Large Language Model that will recommend the best fitting job for the First Generation Low-Income students based on their own schedule.

## How we built it

The platform was built by designing the architecture of the core application, then designing the different screens and implementing it with web frameworks.

## Challenges we ran into

Learning New APIs such as Google Calendar API, and OAuth 2.0 protocol.

## Accomplishments that we're proud of

We are proud that the majority of the functionality, the calendar event created based on student schedules, and the customization match of the best-fitting job was accomplished within the time frame. The First Generation Low-Income students will benefit from our platform.

## What we learned

We explore the fine-tuning of the Large Language Generative AI model, the Google OAuth protocol, and the utilization of the Google Calendar API.

## What's next for LinkDatReasource

Our next step will be the implementation of directly modifying events through the prompt of generative AI, the automation of adding events to the current calendar, and the integration support of cross-platform mobile devices.

# To Run the Application Locally

1. Setup a Google Credential on GCP and obtain Client Id and Client Secret
2. Setup .env files in the frontend and backend
   Frontend environment variables:

   - REACT_APP_BACKEND_URL <- Keep this as "http://localhost:8000"
   - REACT_APP_OAUTH_CLIENT_ID <- This should be your Google client id credentials that you have setup

   Backend environment variables:

   - DB_CONNECTION_STRING <- This should be your MongoDB connection string
   - SESSION_SECRET <- any random string
   - GOOGLE_OAUTH_CLIENT_ID <- This should also be the client id that you have setup on google
   - GOOGLE_OAUTH_CLIENT_SECRET <- This should be the client secret that you have setup on google
   - OPENAI_API_KEY <- This should be the OpenAI Key used to communicate to the model
   - OPENAI_API_SYSTEM_PROMPT <- This should be the prompt used to tune the model

3. Install Docker
4. In the root folder run "docker compose up".
5. go to "http://localhost:3000" after the containers has booted up.
