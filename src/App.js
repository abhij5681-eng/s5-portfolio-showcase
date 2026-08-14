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
        
        // 1. Create an empty object to group our projects
        const groupedProjects = {}; 

        rawData.forEach(row => {
          const studentName = row[1]; // Column B: NAME
          const title = row[2];       // Column C: TITLE
          const rawLink = row[3];     // Column D: GITHUB LINK
          
          if (title && rawLink) {
            
            const cleanLink = rawLink
              .trim()
              .toLowerCase()
              .replace(/\/$/, '')
              .replace(/\.git$/, '');

            // 2. If we haven't seen this project link before, create it!
            if (!groupedProjects[cleanLink]) {
              groupedProjects[cleanLink] = {
                title: title,
                students: [studentName], // Store names in an array
                link: rawLink.trim(),
                description: customDescriptions[rawLink] || customDescriptions[cleanLink] || "S5 Full Stack Development Project."
              };
            } else {
              // 3. If the project ALREADY exists, just push the new student's name into the array!
              if (studentName && !groupedProjects[cleanLink].students.includes(studentName)) {
                groupedProjects[cleanLink].students.push(studentName);
              }
            }
          }
        });

        // 4. Convert our grouped object back into an array for React, and glue the names with " & "
        const finalProjectsList = Object.values(groupedProjects).map(project => ({
          ...project,
          students: project.students.filter(Boolean).join(" & ")
        }));
        
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