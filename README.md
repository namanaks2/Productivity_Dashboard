# TaskAura - Productivity Dashboard

TaskAura is a lightweight and responsive productivity dashboard designed to bridge the gap between complex project management tools and user simplicity. This dashboard empowers users to capture, organize, and execute their tasks without any unnecessary friction. 

**Live Demo:** [https://productivity-dashboard-hytv.vercel.app/]

(https://productivity-dashboard-hytv.vercel.app/)

## Core Features
* **Task Management (CRUD):** Users can easily create new tasks, set priorities (High, Medium, Low), and assign due dates.
* **State Management:** Tasks can be easily toggled between Active and Completed states, featuring animated transitions for clear visual feedback.
* **Dashboard Analytics and Visualizations:**
  * A circular SVG-based Progress Ring to display the task completion rate.
  * A Weekly Activity Bar Chart to analyze the productivity pattern over the past 7 days.
  * A color-coded Priority Distribution Widget to show the distribution of High, Medium, and Low priorities.
* **Local Persistence:** Data is saved using the browser's local storage, ensuring no data is lost even upon page refresh.
* **Search and Filter:** Specific tasks can be easily found within large lists using instant keyword search and priority-based filtering.
* **Notifications and Reminders:** Browser-native notification prompts are triggered when due dates approach.

## Technology Stack
TaskAura is built on a modern, component-based frontend architecture:
* **Frontend Framework:** React.js / JavaScript
* **Styling:** CSS3 / Flexbox / CSS Grid
* **State Management:** React Hooks (useState, useEffect, useContext)
* **Data Visualization:** Chart.js / Custom SVG Components
* **Local Storage:** Browser Web Storage API
* **Build Tool and Version Control:** Vite / NPM and Git / GitHub
* **Hosting and Deployment:** Vercel

## Architecture and Deployment
* **Component Architecture:** The application is divided into Page Components, Feature Components (such as TaskCard, ProgressRing), and Utility Components.
* **Deployment:** A CI/CD pipeline is set up so that pushing to the main branch automatically triggers the build and deploy process.

## Future Roadmap
Several features are planned for upcoming development sprints:
* **High Priority:** OAuth 2.0 login for cross-device sync and Firebase/Supabase integration.
* **Medium Priority:** Advanced category tagging and a team-based collaboration mode.
* **Low Priority:** AI-based task prioritization and Google/Outlook Calendar integration.

---
*Capstone Project by Naman Gupta (K.R. Mangalam University)*