import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

// --- YOUR CUSTOM DESCRIPTIONS ---
const customDescriptions = {
  // Add any custom project descriptions here
};

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Force Google Sheets to bypass the 5-minute cache
    const sheetUrl = `${process.env.REACT_APP_GOOGLE_SHEET_URL}&t=${new Date().getTime()}`;
    
    Papa.parse(sheetUrl, {
      download: true,
      header: false,
      complete: (results) => {
        // Skip Row 1 and 2
        const rawData = results.data.slice(2); 
        
        // Declared exactly ONCE
        const groupedProjects = {}; 
        
        rawData.forEach(row => {
          const studentName = row[1]; // Column B: NAME
          const title = row[2];       // Column C: TITLE
          const rawLink = row[3];     // Column D: GITHUB LINK
          
          if (rawLink) { 
            // The Ultimate Link Cleaner
            const cleanLink = rawLink
              .trim()
              .toLowerCase()
              .split('?')[0]                  
              .split('#')[0]                  
              .replace(/\/$/, '')             
              .replace(/\.git$/, '')          
              .replace(/^https?:\/\//, '')    
              .replace(/^www\./, '');         

            // Grouping Logic
            if (!groupedProjects[cleanLink]) {
              groupedProjects[cleanLink] = {
                title: title || "S5 Project",
                students: [studentName],
                link: rawLink.trim(),
                description: customDescriptions[rawLink] || customDescriptions[cleanLink]
              };
            } else {
              if (studentName && !groupedProjects[cleanLink].students.includes(studentName)) {
                groupedProjects[cleanLink].students.push(studentName);
              }
              if (title && groupedProjects[cleanLink].title === "S5 Project") {
                groupedProjects[cleanLink].title = title;
              }
            }
          }
        });

        // Convert the object back to an array for React
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