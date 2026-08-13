# S5 Full Stack Development Showcase

A dynamic React application built to showcase academic projects for our S5 Full Stack Development batch. 

Instead of hardcoding project details, this application acts as a Headless frontend, fetching real-time data directly from a published Google Sheet submitted by the class.

## 🚀 Features

* **Dynamic Data Fetching:** Automatically pulls and parses project details from a live Google Sheet (CSV format) using `PapaParse`.
* **Smart Filtering:** Automatically detects and removes duplicate team submissions based on the submitted GitHub links.
* **Contextual UI:** Scans the URL strings to dynamically generate the correct button styling (e.g., distinguishing between GitHub source code repositories and live deployed apps like Vercel).
* **Custom Injector:** Includes a dictionary structure to inject custom descriptions for specific project URLs when they are not provided by the database.

## 🛠️ Tech Stack

* **Frontend:** React.js, CSS3
* **Data Parsing:** PapaParse
* **Database:** Google Sheets (Published as CSV)
* **Hosting:** Vercel

## 💻 How to Run Locally

If you want to clone this repository and run it on your own machine:

1. Clone the repository: `git clone https://github.com/yourusername/s5-portfolio-showcase.git`
2. Navigate into the directory: `cd s5-portfolio-showcase`
3. Install the dependencies: `npm install`
4. Create a `.env` file in the root directory and add the Google Sheet link:
   `REACT_APP_GOOGLE_SHEET_URL="YOUR_CSV_LINK_HERE"`
5. Start the development server: `npm start`