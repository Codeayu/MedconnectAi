import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

// Education Topics Data
const educationTopics = [
  {
    id: 'cpr',
    title: 'CPR & First Aid',
    icon: '❤️',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    description: 'Learn life-saving techniques for emergency situations',
    articles: [
      { title: 'How to Perform CPR on Adults', duration: '5 min read' },
      { title: 'CPR for Infants and Children', duration: '4 min read' },
      { title: 'Using an AED (Automated External Defibrillator)', duration: '3 min read' },
      { title: 'Recovery Position Explained', duration: '2 min read' },
    ],
    keyPoints: [
      'Call emergency services (112) before starting CPR',
      '30 chest compressions followed by 2 rescue breaths',
      'Push hard and fast - about 2 inches deep, 100-120 per minute',
      "Don't stop until help arrives or person recovers"
    ],
    detailedContent: `
      <h3>Basic CPR Steps</h3>
      <ol>
        <li><strong>Check responsiveness</strong> - Tap the person's shoulder and shout "Are you okay?"</li>
        <li><strong>Call for help</strong> - Dial 112 or ask someone nearby to call</li>
        <li><strong>Open the airway</strong> - Tilt head back, lift chin</li>
        <li><strong>Check breathing</strong> - Look, listen, and feel for 10 seconds</li>
        <li><strong>Begin compressions</strong> - Push hard and fast in the center of the chest</li>
        <li><strong>Give rescue breaths</strong> - After 30 compressions, give 2 breaths</li>
        <li><strong>Continue CPR</strong> - Repeat cycles of 30:2 until help arrives</li>
      </ol>
    `
  },
  {
    id: 'maternal',
    title: 'Maternal Care',
    icon: '🤰',
    color: '#A855F7',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    description: 'Essential information for pregnancy and postnatal care',
    articles: [
      { title: 'Prenatal Care: First Trimester Guide', duration: '8 min read' },
      { title: 'Nutrition During Pregnancy', duration: '6 min read' },
      { title: 'Warning Signs During Pregnancy', duration: '5 min read' },
      { title: 'Postnatal Care for Mother and Baby', duration: '7 min read' },
    ],
    keyPoints: [
      'Regular prenatal checkups are essential',
      'Take folic acid supplements before and during pregnancy',
      'Stay hydrated and eat balanced meals',
      'Know the warning signs: severe headache, vision changes, excessive swelling'
    ]
  },
  {
    id: 'child',
    title: 'Child Health',
    icon: '👶',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    description: 'Complete guide to keeping children healthy',
    articles: [
      { title: 'Vaccination Schedule for Children', duration: '6 min read' },
      { title: 'Common Childhood Illnesses', duration: '8 min read' },
      { title: 'Child Nutrition Guide (0-5 years)', duration: '7 min read' },
      { title: 'Developmental Milestones', duration: '5 min read' },
    ],
    keyPoints: [
      'Follow the recommended vaccination schedule',
      'Exclusive breastfeeding for first 6 months',
      'Regular growth monitoring',
      'Ensure safe sleeping environment'
    ]
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    icon: '🍎',
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
    description: 'Healthy eating habits for all ages',
    articles: [
      { title: 'Balanced Diet Basics', duration: '5 min read' },
      { title: 'Nutrition for Different Age Groups', duration: '7 min read' },
      { title: 'Micronutrients: Vitamins and Minerals', duration: '6 min read' },
      { title: 'Combating Malnutrition', duration: '5 min read' },
    ],
    keyPoints: [
      'Eat a variety of colorful fruits and vegetables',
      'Include protein in every meal',
      'Limit sugar and processed foods',
      'Stay hydrated - drink 8 glasses of water daily'
    ]
  },
  {
    id: 'hygiene',
    title: 'Hygiene',
    icon: '💧',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
    description: 'Personal and environmental hygiene practices',
    articles: [
      { title: 'Hand Washing: The Right Way', duration: '3 min read' },
      { title: 'Safe Water and Sanitation', duration: '5 min read' },
      { title: 'Menstrual Hygiene Management', duration: '6 min read' },
      { title: 'Food Safety at Home', duration: '4 min read' },
    ],
    keyPoints: [
      'Wash hands with soap for at least 20 seconds',
      'Use clean water for drinking and cooking',
      'Keep living areas clean and ventilated',
      'Proper disposal of waste'
    ]
  },
  {
    id: 'chronic',
    title: 'Chronic Diseases',
    icon: '💊',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
    description: 'Understanding and managing long-term health conditions',
    articles: [
      { title: 'Diabetes: Prevention and Management', duration: '8 min read' },
      { title: 'High Blood Pressure Guide', duration: '6 min read' },
      { title: 'Heart Disease Prevention', duration: '7 min read' },
      { title: 'Managing Asthma', duration: '5 min read' },
    ],
    keyPoints: [
      'Regular health checkups for early detection',
      'Maintain healthy weight through diet and exercise',
      'Take prescribed medications as directed',
      'Know your family health history'
    ]
  },
];

// Quiz Data
const quizQuestions = [
  {
    id: 1,
    question: 'How many chest compressions should you do in CPR before giving rescue breaths?',
    options: ['10', '20', '30', '40'],
    correctAnswer: 2,
    explanation: '30 chest compressions followed by 2 rescue breaths is the standard CPR ratio.',
    category: 'CPR'
  },
  {
    id: 2,
    question: 'What is the emergency number in India?',
    options: ['911', '112', '999', '100'],
    correctAnswer: 1,
    explanation: '112 is the universal emergency number in India for all emergencies.',
    category: 'Emergency'
  },
  {
    id: 3,
    question: 'What should you do first if someone is choking?',
    options: ['Give water', 'Encourage coughing', 'Call doctor immediately', 'Pat on back firmly'],
    correctAnswer: 1,
    explanation: 'If the person can still breathe, encourage them to cough.',
    category: 'First Aid'
  },
  {
    id: 4,
    question: 'How long should you wash your hands?',
    options: ['5 seconds', '10 seconds', '20 seconds', '60 seconds'],
    correctAnswer: 2,
    explanation: 'Wash for at least 20 seconds - about the time it takes to sing "Happy Birthday" twice.',
    category: 'Hygiene'
  },
  {
    id: 5,
    question: 'What is the normal blood pressure range for adults?',
    options: ['90/60 - 120/80', '120/80 - 140/90', '140/90 - 160/100', '160/100 - 180/110'],
    correctAnswer: 0,
    explanation: 'Normal blood pressure is typically around 120/80 mmHg or lower.',
    category: 'Health'
  },
  {
    id: 6,
    question: 'How many glasses of water should you drink daily?',
    options: ['2-3 glasses', '4-5 glasses', '8-10 glasses', '15+ glasses'],
    correctAnswer: 2,
    explanation: '8-10 glasses (about 2 liters) of water per day is recommended for most adults.',
    category: 'Nutrition'
  },
  {
    id: 7,
    question: 'What is the first sign of dehydration?',
    options: ['Headache', 'Thirst', 'Dizziness', 'Dark urine'],
    correctAnswer: 1,
    explanation: 'Thirst is the earliest sign that your body needs more fluids.',
    category: 'Health'
  },
  {
    id: 8,
    question: 'Which vitamin is produced when skin is exposed to sunlight?',
    options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    correctAnswer: 3,
    explanation: 'Vitamin D is synthesized in the skin when exposed to UVB rays from sunlight.',
    category: 'Nutrition'
  }
];

// Video Data
const videoLibrary = [
  {
    id: '1',
    title: 'How to Perform CPR - Complete Guide',
    description: 'Learn the correct technique for performing CPR on adults',
    duration: '5:30',
    category: 'Emergency',
    views: '2.5M',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop',
    youtubeId: 'cosVBV96E2g',
    color: '#EF4444'
  },
  {
    id: '2',
    title: 'Basic First Aid for Burns',
    description: 'Step-by-step guide on how to treat minor burns at home',
    duration: '4:15',
    category: 'First Aid',
    views: '1.8M',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=225&fit=crop',
    youtubeId: 'EaJmzB8YgS0',
    color: '#F97316'
  },
  {
    id: '3',
    title: 'Proper Hand Washing Technique',
    description: 'WHO-recommended hand washing technique',
    duration: '3:00',
    category: 'Hygiene',
    views: '3.2M',
    thumbnail: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=225&fit=crop',
    youtubeId: '3PmVJQUCm4E',
    color: '#06B6D4'
  },
  {
    id: '4',
    title: 'Choking First Aid - Heimlich Maneuver',
    description: 'Learn how to help someone who is choking',
    duration: '4:45',
    category: 'Emergency',
    views: '1.5M',
    thumbnail: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=225&fit=crop',
    youtubeId: 'PA9hpOnvtCk',
    color: '#A855F7'
  },
  {
    id: '5',
    title: 'Breastfeeding Techniques for New Mothers',
    description: 'Correct positions and techniques for breastfeeding',
    duration: '8:20',
    category: 'Maternal Care',
    views: '890K',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=225&fit=crop',
    youtubeId: 'wjt-EgIbBIs',
    color: '#EC4899'
  },
  {
    id: '6',
    title: 'Managing Diabetes at Home',
    description: 'Daily routines, diet tips, and monitoring techniques',
    duration: '10:30',
    category: 'Chronic Disease',
    views: '1.2M',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop',
    youtubeId: 'wZAjVQWbMlE',
    color: '#22C55E'
  }
];

// Emergency Numbers
const emergencyNumbers = [
  { number: '112', label: 'National Emergency', icon: '🚨', color: '#EF4444', desc: 'Universal emergency helpline' },
  { number: '102', label: 'Ambulance', icon: '🚑', color: '#3B82F6', desc: '24/7 emergency medical services' },
  { number: '100', label: 'Police', icon: '👮', color: '#1E40AF', desc: 'Law enforcement assistance' },
  { number: '101', label: 'Fire', icon: '🚒', color: '#F97316', desc: 'Fire and rescue services' },
  { number: '104', label: 'Health Helpline', icon: '📞', color: '#22C55E', desc: 'Health advice and information' },
  { number: '1098', label: 'Child Helpline', icon: '👶', color: '#A855F7', desc: 'Child protection services' }
];

export default function HealthAwareness({ onBack }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);
  
  // Quiz State
  const [quizState, setQuizState] = useState('idle'); // idle, playing, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  
  // Video State
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoCategory, setVideoCategory] = useState('All');

  // Quiz Functions
  const startQuiz = () => {
    setQuizState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizState('result');
    }
  };

  const resetQuiz = () => {
    setQuizState('idle');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  // Video Filter
  const videoCategories = ['All', ...new Set(videoLibrary.map(v => v.category))];
  const filteredVideos = videoCategory === 'All' 
    ? videoLibrary 
    : videoLibrary.filter(v => v.category === videoCategory);

  const tabs = [
    { id: 'overview', label: '📚 Overview', icon: '📚' },
    { id: 'education', label: '🎓 Education', icon: '🎓' },
    { id: 'quiz', label: '🎯 Health Quiz', icon: '🎯' },
    { id: 'videos', label: '🎬 Videos', icon: '🎬' },
    { id: 'emergency', label: '🚨 Emergency', icon: '🚨' }
  ];

  return (
    <div className="health-awareness-container">
      {/* Header */}
      <div className="health-awareness-header">
        <div className="container">
          {onBack && (
            <Button variant="outline" onClick={onBack} style={{ marginBottom: '1rem' }}>
              ← Back to Dashboard
            </Button>
          )}
          
          <Badge variant="primary" icon="📖">Health Education</Badge>
          <h1 className="health-awareness-title">Health Awareness Hub</h1>
          <p className="health-awareness-subtitle">
            Your comprehensive resource for health education, emergency preparedness, and wellness knowledge
          </p>

          {/* Stats Row */}
          <div className="health-stats-row">
            <div className="health-stat-item">
              <span className="health-stat-icon">📚</span>
              <span className="health-stat-value">24+</span>
              <span className="health-stat-label">Health Topics</span>
            </div>
            <div className="health-stat-item">
              <span className="health-stat-icon">🎬</span>
              <span className="health-stat-value">{videoLibrary.length}</span>
              <span className="health-stat-label">Video Tutorials</span>
            </div>
            <div className="health-stat-item">
              <span className="health-stat-icon">🎯</span>
              <span className="health-stat-value">{quizQuestions.length}</span>
              <span className="health-stat-label">Quiz Questions</span>
            </div>
            <div className="health-stat-item">
              <span className="health-stat-icon">🆘</span>
              <span className="health-stat-value">24/7</span>
              <span className="health-stat-label">Emergency Info</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="health-tabs-container">
        <div className="health-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`health-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedTopic(null);
              }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label.replace(tab.icon + ' ', '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="container" style={{ padding: '2rem 1rem' }}>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="health-overview">
            {/* Quick Access Cards */}
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>🏥 Quick Access</h2>
            <div className="health-quick-grid">
              {educationTopics.slice(0, 6).map((topic, index) => (
                <Card 
                  key={topic.id}
                  hover
                  className="health-topic-card fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setActiveTab('education');
                  }}
                >
                  <div 
                    className="topic-card-header"
                    style={{ background: topic.gradient }}
                  >
                    <span className="topic-icon">{topic.icon}</span>
                  </div>
                  <div className="topic-card-body">
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                    <div className="topic-meta">
                      <span>📄 {topic.articles.length} articles</span>
                      <span>✅ {topic.keyPoints.length} key points</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Feature Highlights */}
            <div className="health-features-section">
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>✨ Features</h2>
              <div className="health-features-grid">
                <Card hover className="health-feature-card" onClick={() => setActiveTab('quiz')}>
                  <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #0066CC 0%, #00BFA5 100%)' }}>
                    🎯
                  </div>
                  <h3>Interactive Quiz</h3>
                  <p>Test your health knowledge with our interactive quiz and learn as you go</p>
                  <Button variant="outline" size="sm">Take Quiz →</Button>
                </Card>
                
                <Card hover className="health-feature-card" onClick={() => setActiveTab('videos')}>
                  <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' }}>
                    🎬
                  </div>
                  <h3>Video Library</h3>
                  <p>Watch expert-curated health education videos from trusted sources</p>
                  <Button variant="outline" size="sm">Watch Videos →</Button>
                </Card>
                
                <Card hover className="health-feature-card" onClick={() => setActiveTab('emergency')}>
                  <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
                    🚨
                  </div>
                  <h3>Emergency Guide</h3>
                  <p>Quick access to emergency numbers and first aid instructions</p>
                  <Button variant="outline" size="sm">View Emergency →</Button>
                </Card>
              </div>
            </div>

            {/* Emergency Quick Dial */}
            <div className="emergency-quick-section">
              <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🆘 Emergency Quick Dial</h2>
              <div className="emergency-quick-grid">
                {emergencyNumbers.slice(0, 4).map(em => (
                  <a 
                    key={em.number}
                    href={`tel:${em.number}`}
                    className="emergency-quick-card"
                    style={{ borderColor: em.color }}
                  >
                    <span className="em-icon">{em.icon}</span>
                    <span className="em-number" style={{ color: em.color }}>{em.number}</span>
                    <span className="em-label">{em.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="health-education">
            {!selectedTopic ? (
              <>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>🎓 Health Education Topics</h2>
                <div className="education-topics-grid">
                  {educationTopics.map((topic, index) => (
                    <Card 
                      key={topic.id}
                      hover
                      className="education-topic-card fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <div 
                        className="education-topic-header"
                        style={{ background: topic.gradient }}
                      >
                        <span className="education-topic-icon">{topic.icon}</span>
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                      </div>
                      <div className="education-topic-content">
                        <h4>📌 Key Points</h4>
                        <ul>
                          {topic.keyPoints.slice(0, 3).map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                        <Button variant="primary" size="sm" style={{ marginTop: '1rem', width: '100%' }}>
                          Learn More →
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="topic-detail">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTopic(null)}
                  style={{ marginBottom: '1.5rem' }}
                >
                  ← Back to Topics
                </Button>
                
                <Card className="topic-detail-card">
                  <div 
                    className="topic-detail-header"
                    style={{ background: selectedTopic.gradient }}
                  >
                    <span className="topic-detail-icon">{selectedTopic.icon}</span>
                    <h2>{selectedTopic.title}</h2>
                    <p>{selectedTopic.description}</p>
                  </div>
                  
                  <div className="topic-detail-body">
                    <div className="topic-detail-grid">
                      {/* Key Points Section */}
                      <div className="topic-key-points">
                        <h3>✅ Key Points to Remember</h3>
                        <ul>
                          {selectedTopic.keyPoints.map((point, i) => (
                            <li key={i}>
                              <span className="point-bullet" style={{ background: selectedTopic.color }}></span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Articles Section */}
                      <div className="topic-articles">
                        <h3>📄 Related Articles</h3>
                        <div className="articles-list">
                          {selectedTopic.articles.map((article, i) => (
                            <div 
                              key={i}
                              className={`article-item ${expandedArticle === i ? 'expanded' : ''}`}
                              onClick={() => setExpandedArticle(expandedArticle === i ? null : i)}
                            >
                              <div className="article-header">
                                <span className="article-icon">📖</span>
                                <div className="article-info">
                                  <h4>{article.title}</h4>
                                  <span className="article-duration">{article.duration}</span>
                                </div>
                                <span className="article-arrow">{expandedArticle === i ? '▼' : '▶'}</span>
                              </div>
                              {expandedArticle === i && (
                                <div className="article-preview">
                                  <p>This article covers important information about {article.title.toLowerCase()}. 
                                  Learn best practices, common mistakes to avoid, and expert recommendations.</p>
                                  <Button variant="outline" size="sm">Read Full Article</Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Content */}
                    {selectedTopic.detailedContent && (
                      <div className="topic-detailed-content">
                        <h3>📋 Detailed Guide</h3>
                        <div dangerouslySetInnerHTML={{ __html: selectedTopic.detailedContent }} />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="health-quiz">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>🎯 Health Knowledge Quiz</h2>
            
            {quizState === 'idle' && (
              <Card className="quiz-start-card">
                <div className="quiz-start-content">
                  <div className="quiz-trophy">🏆</div>
                  <h3>Test Your Health Knowledge</h3>
                  <p>Challenge yourself with questions about first aid, health, nutrition, and emergency preparedness!</p>
                  
                  <div className="quiz-info">
                    <div className="quiz-info-item">
                      <span className="info-icon">❓</span>
                      <span>{quizQuestions.length} Questions</span>
                    </div>
                    <div className="quiz-info-item">
                      <span className="info-icon">⏱️</span>
                      <span>No Time Limit</span>
                    </div>
                    <div className="quiz-info-item">
                      <span className="info-icon">📚</span>
                      <span>Learn As You Go</span>
                    </div>
                  </div>
                  
                  <Button variant="primary" size="lg" onClick={startQuiz}>
                    🚀 Start Quiz
                  </Button>
                </div>
              </Card>
            )}

            {quizState === 'playing' && (
              <Card className="quiz-playing-card">
                {/* Progress */}
                <div className="quiz-progress">
                  <div className="quiz-progress-bar">
                    <div 
                      className="quiz-progress-fill"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                  <span className="quiz-progress-text">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                </div>

                {/* Question */}
                <div className="quiz-question-section">
                  <Badge variant="secondary">{quizQuestions[currentQuestion].category}</Badge>
                  <h3 className="quiz-question">{quizQuestions[currentQuestion].question}</h3>
                </div>

                {/* Options */}
                <div className="quiz-options">
                  {quizQuestions[currentQuestion].options.map((option, i) => (
                    <button
                      key={i}
                      className={`quiz-option ${
                        showExplanation 
                          ? i === quizQuestions[currentQuestion].correctAnswer 
                            ? 'correct' 
                            : i === selectedAnswer 
                              ? 'incorrect' 
                              : ''
                          : selectedAnswer === i 
                            ? 'selected' 
                            : ''
                      }`}
                      onClick={() => handleAnswerSelect(i)}
                      disabled={showExplanation}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                      <span className="option-text">{option}</span>
                      {showExplanation && i === quizQuestions[currentQuestion].correctAnswer && (
                        <span className="option-check">✓</span>
                      )}
                      {showExplanation && i === selectedAnswer && i !== quizQuestions[currentQuestion].correctAnswer && (
                        <span className="option-cross">✗</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <div className={`quiz-explanation ${selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? 'correct' : 'incorrect'}`}>
                    <div className="explanation-header">
                      {selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? (
                        <>✅ Correct!</>
                      ) : (
                        <>❌ Incorrect</>
                      )}
                    </div>
                    <p>{quizQuestions[currentQuestion].explanation}</p>
                    <Button variant="primary" onClick={nextQuestion}>
                      {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results →'}
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {quizState === 'result' && (
              <Card className="quiz-result-card">
                <div className="quiz-result-content">
                  <div className="result-medal">
                    {score >= quizQuestions.length * 0.8 ? '🥇' : score >= quizQuestions.length * 0.5 ? '🥈' : '🥉'}
                  </div>
                  <h3>Quiz Complete!</h3>
                  <div className="result-score">
                    <span className="score-value">{score}</span>
                    <span className="score-divider">/</span>
                    <span className="score-total">{quizQuestions.length}</span>
                  </div>
                  <p className="result-message">
                    {score >= quizQuestions.length * 0.8 
                      ? "Excellent! You're a health knowledge champion! 🎉" 
                      : score >= quizQuestions.length * 0.5 
                        ? "Good job! Keep learning to improve further! 💪" 
                        : "Keep practicing! Every attempt makes you smarter! 📚"}
                  </p>
                  <div className="result-actions">
                    <Button variant="primary" onClick={startQuiz}>
                      🔄 Try Again
                    </Button>
                    <Button variant="outline" onClick={resetQuiz}>
                      ← Back to Start
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="health-videos">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>🎬 Health Video Library</h2>
            
            {/* Category Filter */}
            <div className="video-categories">
              {videoCategories.map(cat => (
                <button
                  key={cat}
                  className={`video-category-btn ${videoCategory === cat ? 'active' : ''}`}
                  onClick={() => setVideoCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Grid */}
            <div className="video-grid">
              {filteredVideos.map((video, index) => (
                <Card 
                  key={video.id}
                  hover
                  className="video-card fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="video-play-overlay">
                      <span className="play-icon">▶</span>
                    </div>
                    <span className="video-duration">{video.duration}</span>
                  </div>
                  <div className="video-info">
                    <Badge style={{ background: video.color, color: 'white' }}>{video.category}</Badge>
                    <h4>{video.title}</h4>
                    <p>{video.description}</p>
                    <div className="video-meta">
                      <span>👁️ {video.views} views</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
              <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
                <div className="video-modal" onClick={e => e.stopPropagation()}>
                  <button className="video-modal-close" onClick={() => setSelectedVideo(null)}>✕</button>
                  <h3>{selectedVideo.title}</h3>
                  <div className="video-iframe-container">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="video-modal-desc">{selectedVideo.description}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Emergency Tab */}
        {activeTab === 'emergency' && (
          <div className="health-emergency">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>🚨 Emergency Services & Contacts</h2>
            
            {/* Emergency Alert */}
            <Card className="emergency-alert-card">
              <div className="emergency-alert-content">
                <span className="alert-icon">⚠️</span>
                <div className="alert-text">
                  <h4>In Case of Emergency</h4>
                  <p>Stay calm, assess the situation, and call the appropriate emergency number immediately.</p>
                </div>
              </div>
            </Card>

            {/* Emergency Numbers Grid */}
            <div className="emergency-numbers-grid">
              {emergencyNumbers.map((em, index) => (
                <a 
                  key={em.number}
                  href={`tel:${em.number}`}
                  className="emergency-number-card fade-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    borderColor: em.color
                  }}
                >
                  <div className="em-card-icon" style={{ background: `${em.color}15`, color: em.color }}>
                    {em.icon}
                  </div>
                  <div className="em-card-info">
                    <h3 style={{ color: em.color }}>{em.number}</h3>
                    <h4>{em.label}</h4>
                    <p>{em.desc}</p>
                  </div>
                  <div className="em-call-btn" style={{ background: em.color }}>
                    📞 Call Now
                  </div>
                </a>
              ))}
            </div>

            {/* First Aid Quick Reference */}
            <Card className="first-aid-card">
              <h3>🩹 First Aid Quick Reference</h3>
              <div className="first-aid-grid">
                <div className="first-aid-item">
                  <h4>🔥 Burns</h4>
                  <ol>
                    <li>Cool the burn under running water for 10-20 minutes</li>
                    <li>Cover with a sterile dressing</li>
                    <li>Seek medical help for severe burns</li>
                  </ol>
                </div>
                <div className="first-aid-item">
                  <h4>🩸 Bleeding</h4>
                  <ol>
                    <li>Apply direct pressure with a clean cloth</li>
                    <li>Elevate the injured area if possible</li>
                    <li>Call for help if bleeding doesn't stop</li>
                  </ol>
                </div>
                <div className="first-aid-item">
                  <h4>😰 Choking</h4>
                  <ol>
                    <li>Encourage the person to cough</li>
                    <li>Give 5 back blows between shoulder blades</li>
                    <li>Perform abdominal thrusts if needed</li>
                  </ol>
                </div>
                <div className="first-aid-item">
                  <h4>⚡ Shock</h4>
                  <ol>
                    <li>Lay the person down, elevate legs</li>
                    <li>Keep them warm with a blanket</li>
                    <li>Call emergency services immediately</li>
                  </ol>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
