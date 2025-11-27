import React, { useState } from 'react';

  function InputBar({ onSendMessage }) { 
    const [userMessage, setUserMessage] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault(); 
      if (!userMessage.trim()) return; 

      onSendMessage(userMessage, url, e.target.pdfFile.files[0]); 

      setUserMessage(''); 
     
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input 
        type="file" 
        name="pdfFile" 
        accept="application/pdf" />   
      <input
        type="text"
        placeholder="Article URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type your question..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default InputBar;