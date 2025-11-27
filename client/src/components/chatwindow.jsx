import React, { useState } from 'react'; 
import MessageList from './messagelist';
import InputBar from './inputbar';
import axios from 'axios';

function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🤖 Hello! I am CrawlAI, a chatbot with the ability to access web page content! If you want, paste a URL 🌐 and ask me a question about its content, or let\'s chat normally! I\'m ready to explore! 🚀' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  let conversationHistory = { user: [], bot: [] };

  const handleSendMessage = async (userMessage, url, pdfFile) => {
    const newUserMessage = { sender: 'user', text: userMessage + (url ? ` (URL: ${url})` : '') };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    conversationHistory.user.push(userMessage);

    setIsLoading(true);
    try {
      // Crear FormData para enviar el archivo PDF
      const formData = new FormData();
      formData.append('userMessage', userMessage);
      formData.append('url', url || '');
      formData.append('history', JSON.stringify(conversationHistory));
      if (pdfFile) {
        formData.append('pdfFile', pdfFile);
      }
      
      const response = await axios.post('/api/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const aiMessage = { sender: 'bot', text: response.data.aiResponse };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      conversationHistory.bot.push(response.data.aiResponse);
    } catch (error) {
      console.error('Error communicating with the server:', error);
      const errorMessage = { sender: 'bot', text: '😔 Sorry, there was an error processing your request. Please try again. 🔄' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <MessageList messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;