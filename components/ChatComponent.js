'use client';
import { useState, useEffect, useRef } from 'react';

export default function ChatComponent({ patientInfo, doctorInfo, onEndChat }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate WebSocket connection (replace with real WebSocket later)
  const connectChat = () => {
    setIsConnected(true);
    
    // Add welcome message
    setMessages([
      {
        id: 1,
        sender: 'doctor',
        text: `Hello! I'm Dr. ${doctorInfo?.name || 'Smith'}. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 2,
        sender: 'patient',
        text: patientInfo?.symptoms || `Hi Doctor, I'm not feeling well.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'patient',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate doctor response (replace with real WebSocket later)
    setTimeout(() => {
      const doctorResponse = {
        id: messages.length + 2,
        sender: 'doctor',
        text: getDoctorResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, doctorResponse]);
    }, 1000);
  };

  // Simple AI response generator (replace with real API later)
  const getDoctorResponse = (message) => {
    const responses = [
      "I understand. Can you tell me more about your symptoms?",
      "Thank you for sharing. Have you taken any medication?",
      "I see. When did these symptoms start?",
      "Based on what you're telling me, I recommend resting and staying hydrated.",
      "I'm here to help. Let me analyze your symptoms.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const endChat = () => {
    setIsConnected(false);
    setMessages([]);
    if (onEndChat) onEndChat();
  };

  useEffect(() => {
    connectChat();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>💬 Chat Consultation</h3>
          <p style={styles.subtitle}>with Dr. {doctorInfo?.name || 'Smith'}</p>
        </div>
        <button onClick={endChat} style={styles.endButton}>
          End Chat
        </button>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.message,
              ...(message.sender === 'patient' ? styles.patientMessage : styles.doctorMessage),
            }}
          >
            <div style={styles.messageHeader}>
              <span style={styles.senderName}>
                {message.sender === 'patient' ? 'You' : `Dr. ${doctorInfo?.name || 'Smith'}`}
              </span>
              <span style={styles.timestamp}>{message.timestamp}</span>
            </div>
            <p style={styles.messageText}>{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message here..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>

      <div style={styles.infoBar}>
        <span>🔒 End-to-end encrypted</span>
        <span>🟢 Doctor is online</span>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    background: '#f5f5f5',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #ddd',
  },
  title: {
    color: '#000000',
    margin: 0,
    fontSize: '18px',
  },
  subtitle: {
    color: '#666',
    margin: '5px 0 0 0',
    fontSize: '12px',
  },
  endButton: {
    padding: '8px 16px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px',
    padding: '10px',
    background: 'white',
    borderRadius: '8px',
  },
  message: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '8px',
    animation: 'fadeIn 0.3s ease-in',
  },
  patientMessage: {
    background: '#2c5530',
    color: 'white',
    marginLeft: '20%',
  },
  doctorMessage: {
    background: '#e8f5e8',
    color: '#000',
    marginRight: '20%',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '12px',
  },
  senderName: {
    fontWeight: 'bold',
  },
  timestamp: {
    opacity: 0.7,
  },
  messageText: {
    margin: 0,
    fontSize: '14px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    color: '#000000',
  },
  sendButton: {
    padding: '12px 24px',
    background: '#2c5530',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  infoBar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #ddd',
    fontSize: '12px',
    color: '#666',
  },
};