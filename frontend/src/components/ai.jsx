import React, { useState, useRef, useEffect } from 'react';

const Ai = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai', timestamp: '10:00 AM' },
    { id: 2, text: "Hi! Can you help me with a coding problem?", sender: 'user', timestamp: '10:02 AM' },
    { id: 3, text: "Of course! I'd be happy to help. What programming language are you working with?", sender: 'ai', timestamp: '10:02 AM' },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Code Review', date: 'Today', preview: 'Fixing React component...' },
    { id: 2, title: 'Project Ideas', date: 'Yesterday', preview: 'AI chatbot concepts...' },
    { id: 3, title: 'Learning Path', date: 'Dec 15', preview: 'JavaScript roadmap...' },
  ]);
  
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newUserMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponses = [
        "I understand. Let me think about that...",
        "That's an interesting question! Here's what I think:",
        "Based on your query, I'd recommend the following:",
        "Great question! Here's my analysis:"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage = {
        id: messages.length + 2,
        text: `${randomResponse} This is a simulated response to: "${inputText}". In a real implementation, this would connect to an AI API.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleNewChat = () => {
    setMessages([
      { id: 1, text: "Hello! I'm your AI assistant. What would you like to discuss?", sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    
    // Add to conversations
    const newConversation = {
      id: conversations.length + 1,
      title: `New Chat ${conversations.length + 1}`,
      date: 'Today',
      preview: 'New conversation started...'
    };
    setConversations([newConversation, ...conversations]);
  };
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300'>
      <div className='flex h-screen'>
        {/* Left Navigation/Sidebar */}
        <div className='w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300'>
          {/* Header */}
          <div className='p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300'>
            <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors duration-300'>
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                AI Assistant
              </span>
              <span className='inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-full transition-colors duration-300'>
                AI
              </span>
            </h1>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300'>Your intelligent companion</p>
          </div>
          
          {/* New Chat Button */}
          <div className='p-4'>
            <button
              onClick={handleNewChat}
              className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-gray-900 transition-colors duration-300'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>
          
          {/* Conversations List */}
          <div className='flex-1 overflow-y-auto p-4'>
            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 transition-colors duration-300'>Recent Conversations</h3>
            <div className='space-y-2'>
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className='p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors duration-300'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h4 className='font-medium text-gray-800 dark:text-gray-200 truncate transition-colors duration-300'>{conv.title}</h4>
                      <p className='text-sm text-gray-500 dark:text-gray-400 truncate mt-1 transition-colors duration-300'>{conv.preview}</p>
                    </div>
                    <span className='text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap transition-colors duration-300'>{conv.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* User Profile */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-500 dark:to-purple-500 rounded-full flex items-center justify-center text-white font-semibold transition-colors duration-300'>
                U
              </div>
              <div className='flex-1'>
                <h4 className='font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300'>User Account</h4>
                <p className='text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300'>Free Plan</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className='flex-1 flex flex-col'>
          {/* Chat Header */}
          <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300'>AI Assistant</h2>
                <div className='flex items-center gap-2 mt-1'>
                  <div className='flex items-center gap-1'>
                    <div className='w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full transition-colors duration-300'></div>
                    <span className='text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300'>Online</span>
                  </div>
                  <span className='text-gray-300 dark:text-gray-600 transition-colors duration-300'>•</span>
                  <span className='text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300'>Always ready to help</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150'>
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150'>
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className='flex-1 overflow-y-auto p-6'>
            <div className='max-w-3xl mx-auto'>
              {/* Welcome Message */}
              <div className='text-center mb-8'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4 transition-colors duration-300'>
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300'>Welcome to AI Assistant</h3>
                <p className='text-gray-600 dark:text-gray-300 transition-colors duration-300'>Ask me anything! I can help with coding, writing, analysis, and more.</p>
              </div>
              
              {/* Messages */}
              <div className='space-y-6'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-5 transition-all duration-300 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-br-none shadow-md'
                          : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded-bl-none transition-colors duration-300'
                      }`}
                    >
                      <div className='flex items-center gap-2 mb-2'>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          message.sender === 'user'
                            ? 'bg-blue-400 dark:bg-blue-500'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white'
                        }`}>
                          {message.sender === 'user' ? 'U' : 'AI'}
                        </div>
                        <span className='text-xs opacity-75 dark:opacity-90'>
                          {message.sender === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className='text-xs opacity-75 dark:opacity-90'>•</span>
                        <span className='text-xs opacity-75 dark:opacity-90'>{message.timestamp}</span>
                      </div>
                      <p className={`leading-relaxed ${message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className='flex justify-start'>
                    <div className='max-w-[80%] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded-2xl rounded-bl-none p-5 transition-colors duration-300'>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 flex items-center justify-center text-xs font-medium text-white'>
                          AI
                        </div>
                        <span className='text-xs text-gray-500 dark:text-gray-300'>AI Assistant</span>
                        <span className='text-xs text-gray-500 dark:text-gray-300'>•</span>
                        <span className='text-xs text-gray-500 dark:text-gray-300'>Typing...</span>
                      </div>
                      <div className='flex space-x-2'>
                        <div className='w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse transition-colors duration-300'></div>
                        <div className='w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse delay-150 transition-colors duration-300'></div>
                        <div className='w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse delay-300 transition-colors duration-300'></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className='border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-colors duration-300'>
            <div className='max-w-3xl mx-auto'>
              <form onSubmit={handleSendMessage} className='relative'>
                <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-2xl hover:border-gray-400 dark:hover:border-gray-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-900/30 transition-all duration-200 p-1'>
                  <button
                    type='button'
                    className='p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl ml-1 transition-colors duration-150'
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    type='text'
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder='Ask me anything...'
                    className='flex-1 border-none focus:ring-0 focus:outline-none p-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300'
                  />
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      className='p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-150'
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                    <button
                      type='submit'
                      disabled={!inputText.trim()}
                      className={`p-3 rounded-xl transition-all duration-200 ml-1 ${
                        inputText.trim()
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 shadow-sm hover:shadow dark:shadow-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Quick Suggestions */}
                <div className='flex flex-wrap gap-3 mt-4'>
                  <button
                    type='button'
                    onClick={() => setInputText('Explain quantum computing in simple terms')}
                    className='text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-150'
                  >
                    Explain quantum computing
                  </button>
                  <button
                    type='button'
                    onClick={() => setInputText('Write a Python function to reverse a string')}
                    className='text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-150'
                  >
                    Python reverse string
                  </button>
                  <button
                    type='button'
                    onClick={() => setInputText('Help me plan a workout routine')}
                    className='text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-150'
                  >
                    Workout routine
                  </button>
                </div>
                
                <div className='text-center mt-4'>
                  <p className='text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300'>
                    AI can make mistakes. Consider checking important information.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ai;