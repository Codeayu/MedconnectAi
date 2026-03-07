import { useState, useRef, useEffect } from "react"
import { symptomList } from "../data/symptomList"

// Comprehensive symptom categories with proper medical icons
const symptomCategories = {
  "Head & Brain": ["headache", "dizziness", "memory", "seizure", "migraine", "confusion", "fainting", "vertigo"],
  "Eyes": ["vision", "eye", "blind", "double vision", "lacrimation", "eyelid"],
  "Ears": ["hearing", "ear", "tinnitus", "ringing"],
  "Nose & Sinus": ["nasal", "nose", "sinus", "sneez", "smell"],
  "Throat & Mouth": ["throat", "swallow", "voice", "hoarse", "mouth", "tongue", "lip", "gum", "tooth"],
  "Respiratory": ["breath", "cough", "wheez", "lung", "chest tight", "asthma"],
  "Heart & Cardiovascular": ["heart", "palpitation", "pulse", "blood pressure", "circulation"],
  "Digestive": ["stomach", "abdominal", "nausea", "vomit", "diarrhea", "constip", "bowel", "bloat", "gas", "flatulence", "indigestion", "heartburn"],
  "Musculoskeletal": ["joint", "muscle", "bone", "back", "neck", "shoulder", "knee", "hip", "ankle", "wrist", "elbow", "stiff"],
  "Skin & Hair": ["rash", "itch", "skin", "acne", "swelling", "hair", "scalp", "nail"],
  "Mental Health": ["anxiety", "depression", "stress", "sleep", "insomnia", "fatigue", "mood", "nervous", "panic"],
  "Urinary": ["urin", "bladder", "kidney"],
  "Reproductive": ["menstrual", "vaginal", "penis", "sexual", "fertility"],
  "General": ["fever", "chill", "sweat", "weight", "appetite", "weak", "tired", "pain"]
}

// Get appropriate medical icon for symptom
function getCategoryIcon(symptom) {
  const s = symptom.toLowerCase()
  
  // Head & Brain
  if (["headache", "migraine", "dizziness", "memory", "seizure", "confusion", "fainting", "vertigo"].some(k => s.includes(k))) 
    return "🧠"
  
  // Eyes
  if (["vision", "eye", "blind", "double vision", "lacrimation", "eyelid", "pupil"].some(k => s.includes(k))) 
    return "👁️"
  
  // Ears
  if (["hearing", "ear", "tinnitus", "ringing", "deaf"].some(k => s.includes(k))) 
    return "👂"
  
  // Nose & Sinus
  if (["nasal", "nose", "sinus", "sneez", "smell", "nostril"].some(k => s.includes(k))) 
    return "👃"
  
  // Throat & Mouth
  if (["throat", "swallow", "voice", "hoarse", "mouth", "tongue", "lip", "gum", "tooth", "tonsil"].some(k => s.includes(k))) 
    return "👄"
  
  // Respiratory & Chest
  if (["breath", "cough", "wheez", "lung", "asthma", "respiratory", "pneumonia"].some(k => s.includes(k))) 
    return "🫁"
  
  // Heart & Cardiovascular
  if (["heart", "palpitation", "pulse", "cardiac", "circulation", "blood pressure", "heartbeat"].some(k => s.includes(k))) 
    return "❤️"
  
  // Chest (general)
  if (["chest"].some(k => s.includes(k))) 
    return "🫀"
  
  // Digestive - Fixed icons!
  if (["stomach", "abdominal", "gastric", "belly"].some(k => s.includes(k))) 
    return "🤢"
  if (["nausea", "vomit", "regurgitation"].some(k => s.includes(k))) 
    return "🤮"
  if (["diarrhea", "bowel", "stool", "constip"].some(k => s.includes(k))) 
    return "🚽"
  if (["bloat", "gas", "flatulence", "indigestion", "heartburn"].some(k => s.includes(k))) 
    return "💨"
  
  // Musculoskeletal
  if (["back", "spine", "lumbar"].some(k => s.includes(k))) 
    return "🦴"
  if (["joint", "arthrit"].some(k => s.includes(k))) 
    return "🦿"
  if (["muscle", "cramp", "spasm"].some(k => s.includes(k))) 
    return "💪"
  if (["leg", "foot", "toe", "ankle", "knee", "hip"].some(k => s.includes(k))) 
    return "🦵"
  if (["arm", "hand", "finger", "wrist", "elbow", "shoulder"].some(k => s.includes(k))) 
    return "💪"
  if (["neck"].some(k => s.includes(k))) 
    return "🦴"
  
  // Skin & Hair
  if (["rash", "skin", "acne", "pimple", "lesion", "wart", "mole"].some(k => s.includes(k))) 
    return "🩹"
  if (["itch", "scratch"].some(k => s.includes(k))) 
    return "😣"
  if (["swelling", "edema", "swell"].some(k => s.includes(k))) 
    return "🎈"
  if (["hair", "scalp", "bald"].some(k => s.includes(k))) 
    return "💇"
  
  // Mental Health
  if (["anxiety", "nervous", "panic", "stress", "fear", "phobia"].some(k => s.includes(k))) 
    return "😰"
  if (["depression", "sad", "mood", "emotional"].some(k => s.includes(k))) 
    return "😔"
  if (["sleep", "insomnia", "dream", "nightmare"].some(k => s.includes(k))) 
    return "😴"
  if (["fatigue", "tired", "exhaust", "weak"].some(k => s.includes(k))) 
    return "🥱"
  
  // Urinary
  if (["urin", "bladder", "kidney", "pee"].some(k => s.includes(k))) 
    return "🚿"
  
  // Reproductive
  if (["menstrual", "period", "vaginal", "uterus", "ovary"].some(k => s.includes(k))) 
    return "🩸"
  if (["penis", "testicle", "scrotum", "prostate"].some(k => s.includes(k))) 
    return "🩺"
  
  // General symptoms
  if (["fever", "temperature"].some(k => s.includes(k))) 
    return "🌡️"
  if (["chill", "cold", "shiver"].some(k => s.includes(k))) 
    return "🥶"
  if (["sweat", "perspir"].some(k => s.includes(k))) 
    return "💦"
  if (["weight"].some(k => s.includes(k))) 
    return "⚖️"
  if (["appetite", "hunger", "eating"].some(k => s.includes(k))) 
    return "🍽️"
  if (["pain", "ache", "sore", "hurt", "tender"].some(k => s.includes(k))) 
    return "⚡"
  if (["bleeding", "blood"].some(k => s.includes(k))) 
    return "🩸"
  if (["jaundice", "yellow"].some(k => s.includes(k))) 
    return "🟡"
  if (["allerg"].some(k => s.includes(k))) 
    return "🤧"
  
  // Default medical icon
  return "🔵"
}

export default function SymptomSelector({ selectedSymptoms, onSymptomsChange }) {
  const [searchText, setSearchText] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Filter symptoms based on search text
  const filteredSymptoms = symptomList.filter(symptom => 
    symptom.toLowerCase().includes(searchText.toLowerCase()) &&
    !selectedSymptoms.includes(symptom)
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset highlighted index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0)
  }, [searchText])

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.children
      if (items[highlightedIndex + 1]) { // +1 because of header
        items[highlightedIndex + 1].scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  function handleKeyDown(e) {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < Math.min(filteredSymptoms.length - 1, 49) ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
        break
      case "Enter":
        e.preventDefault()
        if (filteredSymptoms[highlightedIndex]) {
          addSymptom(filteredSymptoms[highlightedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        break
      case "Backspace":
        if (!searchText && selectedSymptoms.length > 0) {
          removeSymptom(selectedSymptoms[selectedSymptoms.length - 1])
        }
        break
    }
  }

  function addSymptom(symptom) {
    onSymptomsChange([...selectedSymptoms, symptom])
    setSearchText("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  function removeSymptom(symptomToRemove) {
    onSymptomsChange(selectedSymptoms.filter(s => s !== symptomToRemove))
  }

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Main Input Container */}
      <div 
        style={{
          background: "white",
          borderRadius: "16px",
          border: `2px solid ${isFocused ? 'var(--primary)' : 'var(--gray-200)'}`,
          padding: "0.75rem",
          transition: "all 0.3s ease",
          boxShadow: isFocused 
            ? '0 0 0 4px rgba(0, 102, 204, 0.1), 0 10px 40px -10px rgba(0, 0, 0, 0.1)' 
            : '0 4px 20px -10px rgba(0, 0, 0, 0.05)',
          minHeight: "60px"
        }}
      >
        {/* Selected Symptoms Tags */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center"
        }}>
          {selectedSymptoms.map((symptom, index) => (
            <span
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.85rem",
                background: "linear-gradient(135deg, #0066CC 0%, #0088EE 100%)",
                color: "white",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 500,
                animation: "popIn 0.2s ease-out",
                boxShadow: "0 2px 8px -2px rgba(0, 102, 204, 0.3)"
              }}
            >
              <span style={{ fontSize: "0.85rem" }}>{getCategoryIcon(symptom)}</span>
              <span style={{ textTransform: "capitalize" }}>{symptom}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeSymptom(symptom)
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.25)",
                  border: "none",
                  borderRadius: "6px",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "14px",
                  padding: 0,
                  lineHeight: 1,
                  transition: "background 0.2s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"}
                aria-label={`Remove ${symptom}`}
              >
                ×
              </button>
            </span>
          ))}

          {/* Search Input */}
          <div style={{ 
            flex: 1, 
            minWidth: "200px",
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            {selectedSymptoms.length === 0 && !searchText && (
              <span style={{
                position: "absolute",
                left: "0.5rem",
                fontSize: "1.1rem",
                pointerEvents: "none",
                opacity: 0.5
              }}>
                🔍
              </span>
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder={selectedSymptoms.length === 0 
                ? "   Search symptoms... (e.g., headache, fever)" 
                : "Add more symptoms..."}
              value={searchText}
              onChange={e => {
                setSearchText(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => {
                setIsOpen(true)
                setIsFocused(true)
              }}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "1rem",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--text-primary)"
              }}
            />
          </div>
        </div>
      </div>

      {/* Dropdown List */}
      {isOpen && filteredSymptoms.length > 0 && (
        <div 
          ref={listRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "0.75rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            maxHeight: "320px",
            overflowY: "auto",
            zIndex: 1000,
            animation: "slideDown 0.2s ease-out"
          }}
        >
          {/* Header */}
          <div style={{
            padding: "0.85rem 1.25rem",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            borderBottom: "1px solid var(--gray-100)",
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            borderRadius: "16px 16px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1
          }}>
            <span>
              <strong style={{ color: "var(--primary)" }}>{filteredSymptoms.length}</strong> symptom{filteredSymptoms.length !== 1 ? 's' : ''} found
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              ↑↓ to navigate • Enter to select
            </span>
          </div>

          {/* Symptom Items */}
          {filteredSymptoms.slice(0, 50).map((symptom, index) => (
            <div
              key={symptom}
              onClick={() => addSymptom(symptom)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={{
                padding: "1rem 1.25rem",
                cursor: "pointer",
                background: index === highlightedIndex 
                  ? "linear-gradient(135deg, #E6F2FF 0%, #F0F9FF 100%)" 
                  : "transparent",
                borderLeft: index === highlightedIndex 
                  ? "3px solid var(--primary)" 
                  : "3px solid transparent",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              <span style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: index === highlightedIndex 
                  ? "linear-gradient(135deg, var(--primary) 0%, #0099FF 100%)" 
                  : "var(--gray-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                transition: "all 0.15s ease",
                color: index === highlightedIndex ? "white" : "var(--text-secondary)"
              }}>
                {getCategoryIcon(symptom)}
              </span>
              <div style={{ flex: 1 }}>
                <span style={{
                  textTransform: "capitalize",
                  color: index === highlightedIndex ? "var(--primary)" : "var(--text-primary)",
                  fontWeight: index === highlightedIndex ? 600 : 500,
                  fontSize: "0.95rem"
                }}>
                  {symptom}
                </span>
              </div>
              {index === highlightedIndex && (
                <span style={{
                  padding: "0.25rem 0.6rem",
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 600
                }}>
                  Enter ↵
                </span>
              )}
            </div>
          ))}

          {/* More Results Indicator */}
          {filteredSymptoms.length > 50 && (
            <div style={{
              padding: "1rem",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              textAlign: "center",
              background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
              borderRadius: "0 0 16px 16px",
              borderTop: "1px solid var(--gray-100)"
            }}>
              <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                +{filteredSymptoms.length - 50}
              </span> more results • Type to narrow down
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchText && filteredSymptoms.length === 0 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: "0.75rem",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.15)",
          padding: "2rem",
          textAlign: "center",
          zIndex: 1000,
          animation: "slideDown 0.2s ease-out"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            margin: "0 auto 1rem",
            background: "var(--gray-100)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem"
          }}>
            🔎
          </div>
          <h4 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            No symptoms found
          </h4>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Try searching for "{searchText.split(' ')[0]}" or related terms
          </p>
        </div>
      )}

      {/* Selected Count & Hint */}
      {selectedSymptoms.length > 0 && (
        <div style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <span style={{
              background: "linear-gradient(135deg, var(--primary) 0%, #0099FF 100%)",
              color: "white",
              padding: "0.4rem 0.85rem",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 700,
              boxShadow: "0 4px 12px -3px rgba(0, 102, 204, 0.3)"
            }}>
              {selectedSymptoms.length}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          {selectedSymptoms.length >= 3 && (
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.85rem",
              background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
              borderRadius: "10px",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#2E7D32"
            }}>
              ✓ Good for analysis
            </span>
          )}
        </div>
      )}

      {/* Quick Select Suggestions (when empty) */}
      {selectedSymptoms.length === 0 && !searchText && !isOpen && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ 
            fontSize: "0.85rem", 
            color: "var(--text-muted)", 
            marginBottom: "0.75rem" 
          }}>
            Common symptoms:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["headache", "fever", "cough", "fatigue", "nausea", "dizziness"].map(symptom => (
              <button
                key={symptom}
                onClick={() => addSymptom(symptom)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--gray-100)",
                  border: "1px solid var(--gray-200)",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--primary-light)"
                  e.currentTarget.style.borderColor = "var(--primary)"
                  e.currentTarget.style.color = "var(--primary)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "var(--gray-100)"
                  e.currentTarget.style.borderColor = "var(--gray-200)"
                  e.currentTarget.style.color = "var(--text-secondary)"
                }}
              >
                + {symptom}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
