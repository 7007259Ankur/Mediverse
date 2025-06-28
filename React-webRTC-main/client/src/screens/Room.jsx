import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";

const MedicalConsultationRoom = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const { roomId } = useParams();
  
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [userRole, setUserRole] = useState(""); // "doctor" or "patient"
  const [remoteUserRole, setRemoteUserRole] = useState("");
  const [remoteUserName, setRemoteUserName] = useState("");
  const [myName, setMyName] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting to consultation room...");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [consultationStartTime, setConsultationStartTime] = useState(null);
  const [consultationDuration, setConsultationDuration] = useState(0);

  // Timer for consultation duration
  useEffect(() => {
    let interval;
    if (consultationStartTime && isCallActive) {
      interval = setInterval(() => {
        setConsultationDuration(Date.now() - consultationStartTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [consultationStartTime, isCallActive]);

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const handleUserJoined = useCallback(({ name, role, id }) => {
    console.log(`${role} ${name} joined consultation`);
    setRemoteSocketId(id);
    setRemoteUserName(name);
    setRemoteUserRole(role);
    setConnectionStatus(`${role === 'doctor' ? 'Dr.' : ''} ${name} joined the consultation`);
  }, []);

  const handleUserLeft = useCallback(({ name, role }) => {
    console.log(`${role} ${name} left consultation`);
    setRemoteSocketId(null);
    setRemoteUserName("");
    setRemoteUserRole("");
    setRemoteStream(null);
    setConnectionStatus(`${role === 'doctor' ? 'Dr.' : ''} ${name} left the consultation`);
    setIsCallActive(false);
  }, []);

  const initializeStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setConnectionStatus("Failed to access camera/microphone");
      return null;
    }
  }, []);

  useEffect(() => {
    // Get user info from localStorage or props
    const userData = JSON.parse(localStorage.getItem('medicalUserData') || '{}');
    setUserRole(userData.role || 'patient');
    setMyName(userData.name || 'User');
    
    initializeStream();
    
    return () => {
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initializeStream]);

  const startConsultation = useCallback(async () => {
    if (!myStream) {
      const stream = await initializeStream();
      if (!stream) return;
    }
    
    setIsCallActive(true);
    setConsultationStartTime(Date.now());
    setConnectionStatus("Starting consultation...");
    
    const offer = await peer.getOffer();
    socket.emit("consultation:start", { to: remoteSocketId, offer, role: userRole });
  }, [remoteSocketId, socket, myStream, userRole, initializeStream]);

  const handleIncomingConsultation = useCallback(
    async ({ from, offer, role }) => {
      setRemoteSocketId(from);
      setIsCallActive(true);
      setConsultationStartTime(Date.now());
      setConnectionStatus("Joining consultation...");
      
      if (!myStream) {
        const stream = await initializeStream();
        if (!stream) return;
      }
      
      console.log(`Incoming consultation from ${role}`);
      const ans = await peer.getAnswer(offer);
      socket.emit("consultation:accepted", { to: from, ans, role: userRole });
    },
    [socket, myStream, userRole, initializeStream]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
      setConnectionStatus("Consultation connected successfully");
    }
  }, [myStream]);

  const handleConsultationAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Consultation accepted!");
      setConnectionStatus("Consultation in progress");
      sendStreams();
    },
    [sendStreams]
  );

  const endConsultation = useCallback(() => {
    socket.emit("consultation:ended", { to: remoteSocketId, role: userRole });
    setRemoteStream(null);
    setIsCallActive(false);
    setConsultationStartTime(null);
    setConnectionStatus(remoteSocketId ? `Connected with ${remoteUserRole}` : "Waiting for participant...");
    
    peer.peer.close();
    peer.createPeer();
  }, [socket, remoteSocketId, userRole, remoteUserRole]);

  const leaveConsultation = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    
    peer.peer.close();
    
    socket.emit("consultation:leave", { 
      room: roomId, 
      role: userRole, 
      name: myName 
    });
    
    navigate("/dashboard");
  }, [myStream, socket, roomId, userRole, myName, navigate]);

  const toggleAudio = useCallback(() => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  }, [myStream]);

  const toggleVideo = useCallback(() => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  }, [myStream]);

  const sendChatMessage = useCallback(() => {
    if (currentMessage.trim() && remoteSocketId) {
      const message = {
        text: currentMessage,
        sender: userRole,
        senderName: myName,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now()
      };
      
      setChatMessages(prev => [...prev, message]);
      socket.emit("consultation:message", { 
        to: remoteSocketId, 
        message 
      });
      setCurrentMessage("");
    }
  }, [currentMessage, remoteSocketId, userRole, myName, socket]);

  const handleMessageReceived = useCallback(({ message }) => {
    setChatMessages(prev => [...prev, message]);
  }, []);

  // WebRTC handlers
  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("Received remote stream");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("user:left", handleUserLeft);
    socket.on("consultation:incoming", handleIncomingConsultation);
    socket.on("consultation:accepted", handleConsultationAccepted);
    socket.on("consultation:ended", () => setIsCallActive(false));
    socket.on("consultation:message", handleMessageReceived);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("user:left", handleUserLeft);
      socket.off("consultation:incoming", handleIncomingConsultation);
      socket.off("consultation:accepted", handleConsultationAccepted);
      socket.off("consultation:ended");
      socket.off("consultation:message", handleMessageReceived);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleUserLeft,
    handleIncomingConsultation,
    handleConsultationAccepted,
    handleMessageReceived,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
  ]);

  const getDoctorVideoStyle = () => ({
    border: "3px solid #28a745",
    borderRadius: "15px",
    padding: "15px",
    backgroundColor: "#f8fff9",
    boxShadow: "0 4px 12px rgba(40, 167, 69, 0.2)"
  });

  const getPatientVideoStyle = () => ({
    border: "3px solid #007bff",
    borderRadius: "15px",
    padding: "15px",
    backgroundColor: "#f8fbff",
    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)"
  });

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div>
          <h1 style={{ margin: "0", color: "#2c3e50" }}>
            🏥 Medical Consultation - Room {roomId}
          </h1>
          <p style={{ margin: "5px 0 0 0", color: "#7f8c8d" }}>
            {userRole === 'doctor' ? '👨‍⚕️ Doctor Dashboard' : '👤 Patient Dashboard'}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          {isCallActive && consultationStartTime && (
            <div style={{ 
              fontSize: "18px", 
              fontWeight: "bold", 
              color: "#e74c3c",
              marginBottom: "5px"
            }}>
              ⏱️ {formatDuration(consultationDuration)}
            </div>
          )}
          <button 
            onClick={leaveConsultation}
            style={{
              padding: "12px 24px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            Leave Consultation
          </button>
        </div>
      </div>

      {/* Status */}
      <div style={{ 
        marginBottom: "20px", 
        padding: "15px",
        backgroundColor: isCallActive ? "#d4edda" : "#fff3cd",
        border: `1px solid ${isCallActive ? "#c3e6cb" : "#ffeaa7"}`,
        borderRadius: "8px"
      }}>
        <h4 style={{ margin: "0", color: isCallActive ? "#155724" : "#856404" }}>
          📡 Status: {connectionStatus}
        </h4>
        {remoteUserName && (
          <p style={{ margin: "5px 0 0 0", color: "#6c757d" }}>
            Connected with: <strong>
              {remoteUserRole === 'doctor' ? 'Dr. ' : ''}
              {remoteUserName}
            </strong>
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 300px)" }}>
        {/* Video Section */}
        <div style={{ flex: "2" }}>
          {/* Control Buttons */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            {remoteSocketId && !isCallActive && (
              <button 
                onClick={startConsultation}
                style={{
                  padding: "15px 30px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "15px",
                  fontSize: "18px",
                  fontWeight: "bold"
                }}
              >
                🎥 Start Consultation
              </button>
            )}
            
            {isCallActive && (
              <>
                <button 
                  onClick={endConsultation}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginRight: "10px",
                    fontSize: "16px"
                  }}
                >
                  📞 End Call
                </button>
                
                <button 
                  onClick={toggleAudio}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: isAudioMuted ? "#dc3545" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginRight: "10px",
                    fontSize: "16px"
                  }}
                >
                  {isAudioMuted ? "🔇 Unmute" : "🔊 Mute"}
                </button>
                
                <button 
                  onClick={toggleVideo}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: isVideoMuted ? "#dc3545" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginRight: "10px",
                    fontSize: "16px"
                  }}
                >
                  {isVideoMuted ? "📹 Turn On" : "📷 Turn Off"}
                </button>

                {myStream && !remoteStream && (
                  <button 
                    onClick={sendStreams}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#ffc107",
                      color: "black",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    📡 Send Stream
                  </button>
                )}
              </>
            )}
          </div>

          {/* Video Windows */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "20px",
            height: "400px"
          }}>
            {/* Doctor Video Window */}
            <div style={getDoctorVideoStyle()}>
              <h3 style={{ 
                margin: "0 0 15px 0", 
                color: "#28a745",
                textAlign: "center",
                fontSize: "18px"
              }}>
                👨‍⚕️ Doctor's Video
                {userRole === 'doctor' && " (You)"}
              </h3>
              
              {((userRole === 'doctor' && myStream) || (remoteUserRole === 'doctor' && remoteStream)) ? (
                <ReactPlayer
                  playing
                  muted={userRole === 'doctor'}
                  height="100%"
                  width="100%"
                  url={userRole === 'doctor' ? myStream : remoteStream}
                  style={{ borderRadius: "8px" }}
                />
              ) : (
                <div style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e8f5e8",
                  borderRadius: "8px",
                  color: "#28a745",
                  fontSize: "16px"
                }}>
                  {userRole === 'doctor' ? 
                    "Please enable your camera" : 
                    "Waiting for doctor to join..."
                  }
                </div>
              )}
              
              {userRole === 'doctor' && (
                <div style={{ marginTop: "10px", fontSize: "14px", color: "#28a745" }}>
                  Audio: {isAudioMuted ? "Muted" : "On"} | Video: {isVideoMuted ? "Off" : "On"}
                </div>
              )}
            </div>

            {/* Patient Video Window */}
            <div style={getPatientVideoStyle()}>
              <h3 style={{ 
                margin: "0 0 15px 0", 
                color: "#007bff",
                textAlign: "center",
                fontSize: "18px"
              }}>
                👤 Patient's Video
                {userRole === 'patient' && " (You)"}
              </h3>
              
              {((userRole === 'patient' && myStream) || (remoteUserRole === 'patient' && remoteStream)) ? (
                <ReactPlayer
                  playing
                  muted={userRole === 'patient'}
                  height="100%"
                  width="100%"
                  url={userRole === 'patient' ? myStream : remoteStream}
                  style={{ borderRadius: "8px" }}
                />
              ) : (
                <div style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e8f4fd",
                  borderRadius: "8px",
                  color: "#007bff",
                  fontSize: "16px"
                }}>
                  {userRole === 'patient' ? 
                    "Please enable your camera" : 
                    "Waiting for patient to join..."
                  }
                </div>
              )}
              
              {userRole === 'patient' && (
                <div style={{ marginTop: "10px", fontSize: "14px", color: "#007bff" }}>
                  Audio: {isAudioMuted ? "Muted" : "On"} | Video: {isVideoMuted ? "Off" : "On"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Chat */}
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            flex: "1",
            display: "flex",
            flexDirection: "column"
          }}>
            <h4 style={{ margin: "0 0 15px 0", color: "#495057" }}>💬 Consultation Chat</h4>
            
            <div style={{
              flex: "1",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "15px",
              overflowY: "auto",
              maxHeight: "200px",
              backgroundColor: "#f8f9fa"
            }}>
              {chatMessages.length === 0 ? (
                <p style={{ color: "#6c757d", fontStyle: "italic", margin: "0" }}>
                  No messages yet. Start the conversation!
                </p>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} style={{ marginBottom: "10px" }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: msg.sender === 'doctor' ? "#28a745" : "#007bff",
                      fontWeight: "bold"
                    }}>
                      {msg.sender === 'doctor' ? '👨‍⚕️' : '👤'} {msg.senderName} - {msg.timestamp}
                    </div>
                    <div style={{ color: "#495057" }}>{msg.text}</div>
                  </div>
                ))
              )}
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type your message..."
                style={{
                  flex: "1",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "14px"
                }}
              />
              <button
                onClick={sendChatMessage}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Notes (Doctor Only) */}
          {userRole === 'doctor' && (
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ margin: "0 0 15px 0", color: "#495057" }}>📝 Consultation Notes</h4>
              <textarea
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Write your consultation notes here..."
                style={{
                  width: "100%",
                  height: "120px",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "14px",
                  resize: "vertical",
                  boxSizing: "border-box"
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalConsultationRoom;