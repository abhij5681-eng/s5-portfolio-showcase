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
    // Adding a timestamp forces Google to send the freshest data, bypassing the 5-minute cache!
    const sheetUrl = `${process.env.REACT_APP_GOOGLE_SHEET_URL}&t=${new Date().getTime()}`;
    
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

        const groupedProjects = {}; 

        rawData.forEach(row => {
          const studentName = row[1]; // Column B: NAME
          const title = row[2];       // Column C: TITLE
          const rawLink = row[3];     // Column D: GITHUB LINK
          
          // THE FIX: Only check if the link exists! 
          // We no longer care if they left the title blank.
          if (rawLink) { 
            
            const cleanLink = rawLink
              .trim()
              .toLowerCase()
              .split('?')[0]                  
              .split('#')[0]                  
              .replace(/\/$/, '')             
              .replace(/\.git$/, '')          
              .replace(/^https?:\/\//, '')    
              .replace(/^www\./, '');         

            if (!groupedProjects[cleanLink]) {
              // If it's a new project, create it
              groupedProjects[cleanLink] = {
                title: title || "S5 Project", // If title is blank, use a fallback
                students: [studentName],
                link: rawLink.trim(),
                description: customDescriptions[rawLink] || customDescriptions[cleanLink] || "S5 Full Stack Development Project."
              };
            } else {
              // If the project already exists, just push the teammate's name!
              if (studentName && !groupedProjects[cleanLink].students.includes(studentName)) {
                groupedProjects[cleanLink].students.push(studentName);
              }
              // If the first teammate forgot the title, but the second one remembered it, grab it!
              if (title && groupedProjects[cleanLink].title === "S5 Project") {
                groupedProjects[cleanLink].title = title;
              }
            }
          }
        });

        const finalProjectsList = Object.values(groupedProjects).map(project => ({
          ...project,
          students: project.students.filter(Boolean).join(" & ")
        }));

        setProjects(finalProjectsList);
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