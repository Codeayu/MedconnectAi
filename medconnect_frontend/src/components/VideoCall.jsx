import { useState, useEffect, useRef, useCallback } from 'react'
import { connect, createLocalTracks } from 'twilio-video'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { api } from '../api'

export default function VideoCall({ consultationId, consultation, onEnd, isDoctor = false }) {
  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [roomStatus, setRoomStatus] = useState(null)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localTracksRef = useRef([])
  const timerRef = useRef(null)

  // Check room status periodically
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await api.getVideoRoomStatus(consultationId)
        setRoomStatus(status)
      } catch (err) {
        console.error('Failed to get room status:', err)
      }
    }
    
    checkStatus()
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [consultationId])

  // Timer for call duration
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isConnected])

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Attach tracks to DOM
  const attachTrack = (track, container) => {
    if (container && track) {
      const element = track.attach()
      element.style.width = '100%'
      element.style.height = '100%'
      element.style.objectFit = 'cover'
      element.style.borderRadius = '12px'
      container.innerHTML = ''
      container.appendChild(element)
    }
  }

  // Handle participant connected
  const participantConnected = useCallback((participant) => {
    console.log('Participant connected:', participant.identity)
    setParticipants(prev => [...prev, participant])

    participant.tracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        if (publication.track.kind === 'video') {
          attachTrack(publication.track, remoteVideoRef.current)
        }
      }
    })

    participant.on('trackSubscribed', track => {
      if (track.kind === 'video') {
        attachTrack(track, remoteVideoRef.current)
      }
    })

    participant.on('trackUnsubscribed', track => {
      track.detach().forEach(element => element.remove())
    })
  }, [])

  // Handle participant disconnected
  const participantDisconnected = useCallback((participant) => {
    console.log('Participant disconnected:', participant.identity)
    setParticipants(prev => prev.filter(p => p !== participant))
    if (remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 1.2rem;">
          ${isDoctor ? 'Patient' : 'Doctor'} disconnected
        </div>
      `
    }
  }, [isDoctor])

  // Connect to video room
  const connectToRoom = async () => {
    setIsConnecting(true)
    setError('')

    try {
      // For doctor, create room first if needed
      if (isDoctor) {
        try {
          await api.createVideoRoom(consultationId)
        } catch (err) {
          // Room might already exist, that's ok
          console.log('Room creation:', err.message)
        }
      }

      // Get token
      const tokenData = await api.getVideoToken(consultationId)
      
      // Create local tracks
      const localTracks = await createLocalTracks({
        audio: true,
        video: { width: 640, height: 480 }
      })
      
      localTracksRef.current = localTracks

      // Attach local video
      const localVideoTrack = localTracks.find(track => track.kind === 'video')
      if (localVideoTrack && localVideoRef.current) {
        attachTrack(localVideoTrack, localVideoRef.current)
      }

      // Connect to room
      const videoRoom = await connect(tokenData.token, {
        name: tokenData.room_name,
        tracks: localTracks
      })

      setRoom(videoRoom)
      setIsConnected(true)

      // Handle existing participants
      videoRoom.participants.forEach(participantConnected)

      // Handle new participants
      videoRoom.on('participantConnected', participantConnected)
      videoRoom.on('participantDisconnected', participantDisconnected)

      // Handle room disconnect
      videoRoom.on('disconnected', (room, error) => {
        console.log('Disconnected from room:', error?.message)
        cleanup()
      })

    } catch (err) {
      console.error('Connection error:', err)
      setError(err.message || 'Failed to connect to video call')
      cleanup()
    } finally {
      setIsConnecting(false)
    }
  }

  // Cleanup function
  const cleanup = () => {
    localTracksRef.current.forEach(track => {
      track.stop()
      track.detach().forEach(element => element.remove())
    })
    localTracksRef.current = []
    
    if (room) {
      room.disconnect()
    }
    
    setRoom(null)
    setIsConnected(false)
    setParticipants([])
  }

  // End call
  const endCall = async () => {
    try {
      await api.endVideoCall(consultationId)
    } catch (err) {
      console.error('Error ending call:', err)
    }
    cleanup()
    if (onEnd) {
      onEnd(callDuration)
    }
  }

  // Leave call (without ending for other participant)
  const leaveCall = async () => {
    try {
      await api.leaveVideoCall(consultationId)
    } catch (err) {
      console.error('Error leaving call:', err)
    }
    cleanup()
    if (onEnd) {
      onEnd(callDuration)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    localTracksRef.current.forEach(track => {
      if (track.kind === 'audio') {
        if (isMuted) {
          track.enable()
        } else {
          track.disable()
        }
      }
    })
    setIsMuted(!isMuted)
  }

  // Toggle video
  const toggleVideo = () => {
    localTracksRef.current.forEach(track => {
      if (track.kind === 'video') {
        if (isVideoOff) {
          track.enable()
        } else {
          track.disable()
        }
      }
    })
    setIsVideoOff(!isVideoOff)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#1a1a2e',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 2rem',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📹</span>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>
              Video Consultation
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>
              {isDoctor ? `Patient: ${consultation?.patient_name || 'Patient'}` : `Dr. ${consultation?.doctor_name || 'Doctor'}`}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isConnected && (
            <Badge variant="success" style={{ background: '#00BFA5', color: 'white' }}>
              🔴 LIVE • {formatDuration(callDuration)}
            </Badge>
          )}
          {roomStatus?.room && (
            <Badge variant={roomStatus.room.status === 'ACTIVE' ? 'success' : 'warning'}>
              {roomStatus.room.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Video Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        gap: '1rem',
        position: 'relative'
      }}>
        {!isConnected ? (
          <Card style={{
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '500px',
            background: 'rgba(255,255,255,0.95)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📹</div>
            <h2 style={{ marginBottom: '0.5rem' }}>
              {isDoctor ? 'Start Video Consultation' : 'Join Video Consultation'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {isDoctor 
                ? 'Click below to start the video call with your patient'
                : 'The doctor will start the call. Click below to join when ready.'
              }
            </p>

            {error && (
              <div style={{
                background: '#FFEBEE',
                color: '#C62828',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button
                variant="primary"
                onClick={connectToRoom}
                disabled={isConnecting}
                style={{ padding: '1rem 2rem' }}
              >
                {isConnecting ? '⏳ Connecting...' : `📹 ${isDoctor ? 'Start Call' : 'Join Call'}`}
              </Button>
              <Button
                variant="outline"
                onClick={() => onEnd && onEnd(0)}
                style={{ padding: '1rem 2rem' }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Remote Video (Large) */}
            <div style={{
              flex: 1,
              maxWidth: '900px',
              height: '100%',
              background: '#2a2a3e',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div
                ref={remoteVideoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                {participants.length === 0 && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Waiting for {isDoctor ? 'patient' : 'doctor'} to join...</p>
                  </div>
                )}
              </div>
              
              {/* Remote participant name */}
              {participants.length > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  {isDoctor ? '👤 Patient' : '👨‍⚕️ Doctor'}
                </div>
              )}
            </div>

            {/* Local Video (Small, floating) */}
            <div style={{
              position: 'absolute',
              bottom: '120px',
              right: '2rem',
              width: '200px',
              height: '150px',
              background: '#3a3a4e',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <div
                ref={localVideoRef}
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '0.5rem',
                left: '0.5rem',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}>
                You {isMuted && '🔇'} {isVideoOff && '📵'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      {isConnected && (
        <div style={{
          padding: '1.5rem',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={toggleMute}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: 'none',
              background: isMuted ? '#EF5350' : 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>

          <button
            onClick={toggleVideo}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: 'none',
              background: isVideoOff ? '#EF5350' : 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? '📵' : '📹'}
          </button>

          <button
            onClick={endCall}
            style={{
              width: '80px',
              height: '60px',
              borderRadius: '30px',
              border: 'none',
              background: '#EF5350',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="End Call"
          >
            📞
          </button>

          {!isDoctor && (
            <button
              onClick={leaveCall}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Leave Call"
            >
              🚪
            </button>
          )}
        </div>
      )}
    </div>
  )
}
