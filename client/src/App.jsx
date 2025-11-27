import './App.css';
import ChatWindow from './components/chatwindow.jsx'; 

function App() {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
            <circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="none"/>
            <line x1="12" y1="3" x2="12" y2="9" stroke="white" stroke-width="2"/>
            <line x1="12" y1="15" x2="12" y2="21" stroke="white" stroke-width="2"/>
            <line x1="3" y1="12" x2="9" y2="12" stroke="white" stroke-width="2"/>
            <line x1="15" y1="12" x2="21" y2="12" stroke="white" stroke-width="2"/>
            <line x1="6" y1="6" x2="9" y2="9" stroke="white" stroke-width="2"/>
            <line x1="15" y1="15" x2="18" y2="18" stroke="white" stroke-width="2"/>
            <line x1="6" y1="18" x2="9" y2="15" stroke="white" stroke-width="2"/>
            <line x1="15" y1="9" x2="18" y2="6" stroke="white" stroke-width="2"/>
          </svg>
          <span style={{ fontStyle: 'italic' }}>CrawlAI</span>
        </h1>
      </header>
      <div className="app-container">
        <ChatWindow />
        <footer className="app-footer">
          <p>
            Created with ❤️ by{' '}
            <a href="https://github.com/mercurialw0rld" target="_blank" rel="noopener noreferrer">
              @mercurialw0rld
            </a>
            {' '}🐙
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
