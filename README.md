# CrawlAI

An intelligent chat application that combines web scraping capabilities with AI-powered responses. CrawlAI allows users to have conversations with an AI assistant that can scrape website content and analyze PDF documents to provide comprehensive, context-aware answers.

## Features

- **Web Scraping**: Automatically scrape and analyze website content for enhanced responses
- **PDF Analysis**: Upload and analyze PDF documents with AI assistance
- **Conversational AI**: Powered by Google Gemini for detailed, friendly responses
- **Caching**: Intelligent caching of scraped content for improved performance
- **Modern UI**: Clean, responsive React interface with real-time chat

## Tech Stack

### Frontend
- React 19
- Vite
- Axios for API calls
- React Markdown for rich text rendering

### Backend
- Node.js with Express
- Google Generative AI (Gemini)
- Firecrawl for web scraping
- Multer for file uploads
- PostgreSQL database
- CORS enabled

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API keys for:
  - Google Gemini AI
  - Firecrawl

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mercurialw0rld/CrawlAI.git
cd CrawlAI
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables:
Create a `.env` file in the `server` directory with:
```
FIRECRAWL_API_KEY=your_firecrawl_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## Usage

1. Start the server:
```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

2. Start the client (in a new terminal):
```bash
cd client
npm run dev
```

3. Open your browser to `http://localhost:5173`

## API Endpoints

### POST /api/chat
Main chat endpoint that accepts:
- `userMessage`: The user's message (required)
- `url`: Optional URL to scrape for context
- `history`: JSON string of conversation history
- `pdfFile`: Optional PDF file upload

## Project Structure

```
crawlai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── chatwindow.jsx
│   │   │   ├── inputbar.jsx
│   │   │   └── messagelist.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── index.js
│   ├── package.json
│   └── uploads/            # File upload directory
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Created with ❤️ by [@mercurialw0rld](https://github.com/mercurialw0rld)
