// importar dependencias
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const { Firecrawl } = require('@mendable/firecrawl-js');
const { GoogleGenAI } = require('@google/genai');
let crawledPages = {};
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// crear una instancia de express
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
  res.send('Hola, mundo!');
});

// recibir datos en una ruta POST
app.post('/api/chat', async (req, res) => {
    try {
        let context = '';
        let pdfBase64;
        const { userMessage, url, history } = req.body;

        if (req.file) {
            pdfBase64 = req.file.buffer.toString('base64');
        }

        console.log('Cuerpo de la solicitud:', req.body);

        if (!userMessage) {
            return res.status(400).json({ error: 'Debes dejar un mensaje, es obligatorio.' });
        }

        if (url && url.trim() !== '') {
            if (crawledPages[url]) {
                console.log('Usando contenido en caché para la URL:', url);
                context = crawledPages[url];
            } else {
                console.log('No se encontró contenido en caché para la URL:', url);
                const crawlResponse = await firecrawl.crawl(url, {
                    limit: 100,
                    scrapeOptions: { formats: ['markdown', 'html'], onlyMainContent: true },
                });
                console.log('Scraping completado!!!!');
                console.log('Respuesta del crawl:', JSON.stringify(crawlResponse, null, 2));

                if (crawlResponse.data && crawlResponse.data.length > 0) {
                    context = crawlResponse.data
                        .map(
                            (page) =>
                                `URL: ${page.url}\nContenido: ${page.content || page.markdown}\n---\n`
                        )
                        .join('');
                    console.log('Contenido scrapeado:', context);
                    crawledPages[url] = context;
                } else {
                    return res.json({ message: 'No se pudo scrapear contenido de la URL proporcionada.' });
                }
            }
        }

        const prompt = `Basándote en el siguiente contexto, responde la pregunta del usuario.

                        CONTEXTO:
                        ---
                        ${context}, DEBES SER COMPLETO AL RESPONDER, no des respuestas concisas o cortas, debes ser explicativo y detallado. Debes ser sumamente amigable y paciente!
                        ---
                        HISTORIAL DE CONVERSACIÓN:
                        ---
                        Usuario: ${history.user.join('\nUsuario: ')}
                        Bot: ${history.bot.join('\nBot: ')}
                        ---
                        PREGUNTA: ${userMessage}`;

        if (pdfBase64) {
            const contents = [
                { text: userMessage },
                {
                    inlineData: {
                        mimeType: req.file.mimetype,
                        data: pdfBase64,
                    },
                },
            ];
            const response = await genAI.models.generateContent({
                model: 'gemini-2.0-flash',
                contents,
                config: {
                    systemInstruction: `${prompt}`,
                },
            });
            return res.json({ aiResponse: response.text });
        }

        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `${userMessage}`,
            config: {
                systemInstruction: `${prompt}`,
            },
        });
        return res.json({ aiResponse: response.text });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
