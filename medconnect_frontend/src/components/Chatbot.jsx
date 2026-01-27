import { useState, useRef, useEffect } from "react"
import Card from "./ui/Card"
import Button from "./ui/Button"
import Badge from "./ui/Badge"
import { api } from "../api"
import { getUserName } from "../auth"

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! 👋 I'm MedConnect AI, your personal health assistant. I can help you with medical questions, drug information, and health concerns. You can also upload images, PDFs, or audio files for analysis.",
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const userName = getUserName()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file) => {
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"
    ]
    
    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type. Please upload an image, PDF, or audio file.")
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert("File size too large. Please upload a file smaller than 10MB.")
      return
    }
    
    setSelectedFile(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type === "application/pdf") return "📄"
    if (type.startsWith("audio/")) return "🎵"
    return "📎"
  }

  const getFileTypeBadge = (type) => {
    if (type.startsWith("image/")) return "Image"
    if (type === "application/pdf") return "PDF"
    if (type.startsWith("audio/")) return "Audio"
    return "File"
  }

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedFile) return
    
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputText,
      file: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type
      } : null,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentInput = inputText
    const currentFile = selectedFile
    setInputText("")
    setIsLoading(true)

    try {
      const data = await api.sendChatMessage(currentInput, currentFile)
      
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: data.response,
        route: data.route,
        inputSources: data.input_sources,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error("Chatbot error:", error)
      const errorMessage = {
        id: Date.now() + 1,
        type: "error",
        text: error.message || "Unable to connect to the server. Please check your connection and try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: "bot",
        text: "Chat cleared! How can I help you today?",
        timestamp: new Date()
      }
    ])
  }

  const quickQuestions = [
    "What are the symptoms of flu?",
    "How to manage stress?",
    "What is diabetes?",
    "Healthy diet tips"
  ]

  return (
    <div style={{ 
      background: 'var(--gray-50)', 
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
        color: 'white',
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem'
              }}>
                💬
              </div>
              <div>
                <h1 style={{ 
                  marginBottom: '0.25rem',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  MedConnect AI Assistant
                </h1>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.85)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00C853',
                    display: 'inline-block'
                  }}></span>
                  Online • Powered by Gemini AI
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={clearChat}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: '0.9rem'
              }}
            >
              🗑️ Clear Chat
            </Button>
          </div>
        </div>
      </section>

      {/* Chat Container */}
      <div className="container" style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Messages Area */}
        <Card style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxHeight: 'calc(100vh - 400px)',
            minHeight: '300px'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="fade-in"
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                {msg.type !== 'user' && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: msg.type === 'error' 
                      ? 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)'
                      : 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    {msg.type === 'error' ? '⚠️' : '🤖'}
                  </div>
                )}
                
                <div style={{
                  maxWidth: '75%',
                  padding: '1rem 1.25rem',
                  borderRadius: msg.type === 'user' 
                    ? '16px 16px 4px 16px' 
                    : '16px 16px 16px 4px',
                  background: msg.type === 'user' 
                    ? 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)'
                    : msg.type === 'error'
                    ? '#FEE2E2'
                    : 'var(--gray-100)',
                  color: msg.type === 'user' 
                    ? 'white' 
                    : msg.type === 'error'
                    ? '#DC2626'
                    : 'var(--text-primary)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.file && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}>
                      {getFileIcon(msg.file.type)}
                      <span style={{ opacity: 0.9 }}>{msg.file.name}</span>
                    </div>
                  )}
                  
                  <div style={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    fontSize: '0.95rem'
                  }}>
                    {msg.text}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    opacity: 0.7
                  }}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {msg.route && (
                      <Badge 
                        variant={msg.route === 'EMERGENCY' ? 'error' : 'primary'}
                        style={{ 
                          fontSize: '0.65rem', 
                          padding: '2px 6px',
                          background: msg.type === 'user' ? 'rgba(255,255,255,0.2)' : undefined
                        }}
                      >
                        {msg.route}
                      </Badge>
                    )}
                    {msg.inputSources?.length > 0 && (
                      <Badge 
                        variant="secondary"
                        style={{ 
                          fontSize: '0.65rem', 
                          padding: '2px 6px',
                          background: msg.type === 'user' ? 'rgba(255,255,255,0.2)' : undefined
                        }}
                      >
                        📎 {msg.inputSources.join(', ')}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {msg.type === 'user' && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00BFA5 0%, #00A890 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'white',
                    flexShrink: 0
                  }}>
                    {userName?.charAt(0)?.toUpperCase() || '👤'}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div
                className="fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}>
                  🤖
                </div>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'var(--gray-100)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span style={{ 
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                  }}>
                    MedConnect is thinking...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-muted)',
              marginBottom: '0.75rem'
            }}>
              💡 Quick questions:
            </p>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(q)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    background: 'white',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.color = 'var(--primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--border)'
                    e.target.style.color = 'var(--text-secondary)'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Area */}
        {selectedFile && (
          <Card 
            className="fade-in"
            style={{ 
              marginBottom: '1rem',
              padding: '1rem',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {getFileIcon(selectedFile.type)}
                </span>
                <div>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}>
                    {selectedFile.name}
                  </p>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem'
                  }}>
                    {getFileTypeBadge(selectedFile.type)} • {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--error)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}
              >
                ✕
              </button>
            </div>
          </Card>
        )}

        {/* Input Area */}
        <Card 
          style={{ padding: '1rem', position: 'relative' }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {dragActive && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--primary-light)',
              border: '2px dashed var(--primary)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }}>📁</span>
                <p style={{ margin: '0.5rem 0 0', color: 'var(--primary)' }}>
                  Drop your file here
                </p>
              </div>
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question here..."
                rows={2}
                disabled={isLoading}
                style={{
                  resize: 'none',
                  fontSize: '1rem',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.875rem 1rem'
                }}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,audio/*"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Attach file (Image, PDF, or Audio)"
                style={{
                  width: '48px',
                  height: '48px',
                  padding: 0,
                  borderRadius: '12px'
                }}
              >
                📎
              </Button>
              
              <Button
                variant="primary"
                onClick={sendMessage}
                disabled={isLoading || (!inputText.trim() && !selectedFile)}
                title="Send message"
                style={{
                  width: '48px',
                  height: '48px',
                  padding: 0,
                  borderRadius: '12px'
                }}
              >
                {isLoading ? '⏳' : '➤'}
              </Button>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--gray-200)'
          }}>
            <p style={{ 
              margin: 0,
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              📎 Supports: Images, PDFs, Audio files (max 10MB)
            </p>
            <p style={{ 
              margin: 0,
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              Press Enter to send
            </p>
          </div>
        </Card>

        {/* Disclaimer */}
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(255, 179, 0, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 179, 0, 0.2)'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            ⚠️ <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only and is not a substitute for professional medical advice. Always consult a qualified healthcare provider for medical decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
