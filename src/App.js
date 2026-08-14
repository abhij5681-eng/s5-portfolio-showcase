import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

// --- YOUR CUSTOM DESCRIPTIONS ---
const customDescriptions = {
  // "https://github.com/yourusername/project1": "Custom description here",
};

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // 1. Pull the URL from the .env file instead of hardcoding it
    const sheetUrl = process.env.REACT_APP_GOOGLE_SHEET_URL;
    
    Papa.parse(sheetUrl, {
      download: true,
      header: false, // Bypasses the merged title row
      complete: (results) => {
        
        // Skip Row 1 and Row 2, start reading at the actual data
        const rawData = results.data.slice(2); 
        
        const uniqueProjects = [];
        const seenLinks = new Set();
        
        rawData.forEach(row => {
          // Check your Google Sheet to confirm which column holds the names!
          // row[0] = Col A, row[1] = Col B, row[2] = Col C, etc.
          const students = row[1]; // <-- Grab the names here
          const title = row[2];    // Column C: TITLE
          const rawLink = row[3];  // Column D: GITHUB LINK
          
          if (title && rawLink) {
            
            const cleanLink = rawLink
              .trim()
              .toLowerCase()
              .replace(/\/$/, '')
              .replace(/\.git$/, '');

            if (!seenLinks.has(cleanLink)) {
              seenLinks.add(cleanLink);
              
              const description = customDescriptions[rawLink] || customDescriptions[cleanLink] || "S5 Full Stack Development Project.";
              
              // Add 'students' to the object we are saving
              uniqueProjects.push({ 
                title, 
                students, // <-- Save it here
                link: rawLink.trim(), 
                description 
              });
            }
          }
        });

        setProjects(uniqueProjects);
      }
    });
  }, []);

  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <h1>S5 Full Stack Development Showcase</h1>
        <p>A collection of our batch's coursework and assignments.</p>
      </header>
      
      <div className="project-grid">
        {projects.map((project, index) => {
          
          const isGithub = project.link.toLowerCase().includes('github.com');
          
          return (
             <div key={index} className="project-card">
              <h2>{project.title}</h2>
              
              {/* Add this new line to display the student names */}
              <h4 className="student-names">Team: {project.students}</h4>
              
              <p>{project.description}</p>
              
              <a 
                href={project.link} 
                target="_blank" 
                rel="noreferrer"
                className={`btn ${isGithub ? 'btn-github' : 'btn-live'}`}
              >
                {isGithub ? '💻 View Source Work' : '🌐 View Live App'}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;