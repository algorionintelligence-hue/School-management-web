import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaSearch, FaPaperPlane, FaPhone, FaVideo, FaEllipsisV,
  FaCheck, FaCheckDouble, FaImage, FaFile, FaSmile 
} from 'react-icons/fa';
import './Messaging.css';

const Messaging = () => {
  const { user } = useAuth();
  const { success } = useNotification();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = () => {
    setTimeout(() => {
      setConversations([
        { id: 1, name: 'Alice Johnson', role: 'student', lastMessage: 'Thank you, sir!', time: '10:30 AM', unread: 0, avatar: null },
        { id: 2, name: 'Bob Johnson', role: 'parent', lastMessage: 'When is the PTM?', time: '09:15 AM', unread: 2, avatar: null },
        { id: 3, name: 'Sarah Johnson', role: 'teacher', lastMessage: 'Meeting at 2 PM', time: 'Yesterday', unread: 0, avatar: null },
        { id: 4, name: 'Principal', role: 'admin', lastMessage: 'Please submit reports', time: 'Yesterday', unread: 1, avatar: null },
        { id: 5, name: 'Class 10-A Group', role: 'group', lastMessage: 'Homework uploaded', time: 'Monday', unread: 0, avatar: null }
      ]);
    }, 600);
  };

  const fetchMessages = (conversationId) => {
    setTimeout(() => {
      setMessages([
        { id: 1, sender: 'them', text: 'Hello, I wanted to discuss my child\'s progress.', time: '09:00 AM', read: true },
        { id: 2, sender: 'me', text: 'Sure, I\'m available. What would you like to know?', time: '09:05 AM', read: true },
        { id: 3, sender: 'them', text: 'Alice has been struggling with Mathematics lately.', time: '09:10 AM', read: true },
        { id: 4, sender: 'me', text: 'I noticed that too. I can arrange extra classes after school.', time: '09:12 AM', read: true },
        { id: 5, sender: 'them', text: 'That would be great! When can we start?', time: '09:15 AM', read: false },
      ]);
    }, 300);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update conversation last message
    setConversations(prev => prev.map(c => 
      c.id === selectedConversation.id 
        ? { ...c, lastMessage: newMessage, time: 'Just now' }
        : c
    ));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="module-container messaging-container">
      <div className="conversations-sidebar">
        <div className="conversations-header">
          <h2>Messages</h2>
          <div className="search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="conversations-list">
          {filteredConversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''} ${conv.unread > 0 ? 'unread' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="conversation-avatar">
                {conv.avatar ? (
                  <img src={conv.avatar} alt={conv.name} />
                ) : (
                  <div className="avatar-placeholder">{conv.name[0]}</div>
                )}
              </div>
              <div className="conversation-info">
                <div className="conversation-top">
                  <h4>{conv.name}</h4>
                  <span className="conversation-time">{conv.time}</span>
                </div>
                <div className="conversation-bottom">
                  <p>{conv.lastMessage}</p>
                  {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="conversation-avatar">
                  <div className="avatar-placeholder">{selectedConversation.name[0]}</div>
                </div>
                <div>
                  <h3>{selectedConversation.name}</h3>
                  <span className="user-status online">Online</span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="btn-icon"><FaPhone /></button>
                <button className="btn-icon"><FaVideo /></button>
                <button className="btn-icon"><FaEllipsisV /></button>
              </div>
            </div>

            <div className="messages-container">
              {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <div className="message-meta">
                      <span className="message-time">{msg.time}</span>
                      {msg.sender === 'me' && (
                        <span className="message-status">
                          {msg.read ? <FaCheckDouble /> : <FaCheck />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-area">
              <button className="btn-icon attach"><FaImage /></button>
              <button className="btn-icon attach"><FaFile /></button>
              <button className="btn-icon attach"><FaSmile /></button>
              <input 
                type="text" 
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="btn-primary send-btn" onClick={handleSendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;