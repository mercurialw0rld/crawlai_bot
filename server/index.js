// import dependencies
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const { Firecrawl } = require('@mendable/firecrawl-js');
const { GoogleGenAI } = require('@google/genai');
crawledPages = {};
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const app = express();
// middleware para parsear JSON
app.use(express.json());
app.use(cors());

// instancias de firecrawl y google generative AI
const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// definir un puerto
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// receive data in a POST route
app.post('/api/chat', upload.single('pdfFile'), async (req, res) => {
    try {
        let context = '';
        let pdfBase64 = null;
        const { userMessage, url} = req.body;
        const history = req.body.history ? JSON.parse(req.body.history) : { user: [], bot: [] };
        // convert pdf to base64 if it exists
        if (req.file){
            console.log('PDF file received:', req.file.originalname);
            pdfBase64 = req.file.buffer.toString('base64');
        }
        
        console.log('Request body:', req.body);
        // validate that userMessage is present
        if(!userMessage) {
            return res.status(400).json({ error: 'You must provide a message, it is required.' });
        }
        // if there is url, scrape it
        if (url && url.trim() !== '') {
            // check if we haven't scraped it before
            if (crawledPages[url]) {
                console.log('Using cached content for URL:', url);
                context = crawledPages[url];
            } else {
                console.log('No cached content found for URL:', url);
                const crawlResponse = await firecrawl.crawl(url, {
                    limit: 100,
                    scrapeOptions: { formats: ['markdown', 'html'], onlyMainContent: true },
                });
                console.log('Scraping completed!!!!');
                console.log('Crawl response:', JSON.stringify(crawlResponse, null, 2));
                
                // get the scraped content
            if (crawlResponse.data && crawlResponse.data.length > 0) {
                    context = crawlResponse.data.map(page => 
                        `URL: ${page.url}\nContent: ${page.content || page.markdown}\n---\n`
                    ).join('');
                    console.log('Scraped content:', context);
                    // store in cache
                    crawledPages[url] = context;
                } else {
                    return res.json({ message: 'Could not scrape content from the provided URL.' });
                }
    }
            }

        // generate response with Gemini
        const prompt = `Based on the following context, answer the user's question.
    
            CONTEXT:
            ---
            ${context}, BE COMPLETE IN YOUR RESPONSE, do not give concise or short answers, you must be explanatory and detailed. You must be extremely friendly and patient!${context ? ` If a URL was provided and content was scraped, start your response with "Successfully scraped ${url}" followed by the detailed answer.` : ''}
            ---
            CONVERSATION HISTORY:
            ---
            User: ${history.user.join('\nUser: ')}
            Bot: ${history.bot.join('\nBot: ')}
            ---
            QUESTION: ${userMessage}`;

        if (pdfBase64) {
            console.log('Generating response with attached PDF...');
            const contents = [
                { text: prompt },
                {
                    inlineData: {
                        // Use the mimetype detected by multer
                        mimeType: req.file.mimetype,
                        // Convert the file buffer (req.file.buffer) to Base64
                        data: pdfBase64
                    }
                }
            ];
            let response = await genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents: contents,
            });
            return res.json({ aiResponse: response.text });
        } else {
            let response = await genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ text: prompt }],
            });
            return res.json({ aiResponse: response.text });
        }

    } catch (error) {
        console.error('Error processing the request:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
