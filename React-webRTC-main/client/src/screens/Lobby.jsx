import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      
      if (!email.trim() || !room.trim()) {
        setError("Please fill in both email and room number");
        return;
      }
      
      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }
      
      setError("");
      setIsConnecting(true);
      socket.emit("room:join", { email: email.trim(), room: room.trim() });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      setIsConnecting(false);
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  const handleJoinError = useCallback((error) => {
    setIsConnecting(false);
    setError(error.message || "Failed to join room. Please try again.");
  }, []);

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    socket.on("room:join:error", handleJoinError);
    
    return () => {
      socket.off("room:join", handleJoinRoom);
      socket.off("room:join:error", handleJoinError);
    };
  }, [socket, handleJoinRoom, handleJoinError]);

  const generateRandomRoom = () => {
    const randomRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoom(randomRoom);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "400px",
        maxWidth: "90%"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ 
            color: "#343a40", 
            marginBottom: "10px",
            fontSize: "28px"
          }}>
            Video Call Lobby
          </h1>
          <p style={{ 
            color: "#6c757d", 
            margin: "0",
            fontSize: "16px"
          }}>
            Enter your details to join or create a room
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitForm}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="email" style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#495057"
            }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isConnecting}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ced4da",
                borderRadius: "5px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="room" style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#495057"
            }}>
              Room Number
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                disabled={isConnecting}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
                required
              />
              <button
                type="button"
                onClick={generateRandomRoom}
                disabled={isConnecting}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  whiteSpace: "nowrap"
                }}
              >
                Random
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: isConnecting ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isConnecting ? "not-allowed" : "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
          >
            {isConnecting ? "Joining..." : "Join Room"}
          </button>
        </form>

        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#e9ecef",
          borderRadius: "5px"
        }}>
          <h4 style={{ 
            margin: "0 0 10px 0", 
            color: "#495057",
            fontSize: "16px"
          }}>
            How it works:
          </h4>
          <ul style={{ 
            margin: "0", 
            paddingLeft: "20px",
            color: "#6c757d",
            fontSize: "14px"
          }}>
            <li>Enter your email and a room code</li>
            <li>Share the room code with others to join</li>
            <li>Start video calling once connected</li>
            <li>Use "Random" to generate a unique room code</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;