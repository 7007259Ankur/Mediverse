import React, { useState, useEffect, useRef } from "react";
import { getAllRecords } from "../services/vaultService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  // State management
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeNote, setActiveNote] = useState("");
  const [notes, setNotes] = useState({});
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("records");
  const [roomId, setRoomId] = useState("");
  const [socketStatus, setSocketStatus] = useState("disconnected");

  // Refs and hooks
  const ws = useRef(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // WebSocket connection management
  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimer;
    let pingInterval;

    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(`ws://${API_BASE_URL.replace(/^https?:\/\//, '')}`);

        ws.current.onopen = () => {
          console.log("WebSocket connected");
          setSocketStatus("connected");
          reconnectAttempts = 0;
        };

        ws.current.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.type === 'noteAdded') {
              setNotes(prev => {
                const existingNotes = prev[data.recordId] || [];
                return {
                  ...prev,
                  [data.recordId]: [...existingNotes, data.note]
                };
              });
            }
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
          }
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setSocketStatus("error");
        };

        ws.current.onclose = () => {
          console.log("WebSocket disconnected");
          setSocketStatus("disconnected");
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(1000 * reconnectAttempts, 10000);
            reconnectTimer = setTimeout(connectWebSocket, delay);
          }
        };

      } catch (err) {
        console.error("WebSocket initialization error:", err);
        setSocketStatus("error");
      }
    };

    connectWebSocket();

    // Setup ping interval
    pingInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    // Cleanup function
    return () => {
      clearTimeout(reconnectTimer);
      clearInterval(pingInterval);
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [API_BASE_URL]);

  // Fetch patient records on component mount
  useEffect(() => {
    const fetchAllPatientRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllRecords(token);
        
        if (!res) throw new Error("No response from server");
        if (res.error) throw new Error(res.error);
        
        if (res?.patients) {
          setPatients(res.patients);
          if (res.patients.length > 0) {
            setSelectedPatientId(res.patients[0]._id);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load patient records');
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPatientRecords();
  }, [token]);

  // Update records when patient selection changes
  useEffect(() => {
    if (selectedPatientId) {
      const selected = patients.find((p) => p._id === selectedPatientId);
      setPatientRecords(selected?.records || []);
      selected?.records?.forEach(record => fetchNotes(record._id));
    }
  }, [selectedPatientId, patients]);

  // Fetch notes for a specific record
  const fetchNotes = async (recordId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/records/${recordId}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prev => ({ ...prev, [recordId]: res.data }));
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  // View original medical file
  const handleViewFile = async (recordId) => {
    try {
      setError(null);
      const tokenRes = await axios.get(
        `${API_BASE_URL}/api/records/file-token/${recordId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.open(
        `${API_BASE_URL}/api/records/file/${recordId}?token=${tokenRes.data.token}`,
        '_blank',
        'noopener,noreferrer'
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to access file");
      console.error("Error viewing file:", err);
    }
  };

  // Add new note with WebSocket fallback to HTTP
  const handleAddNote = async (recordId) => {
    if (!activeNote.trim()) return;

    // Try WebSocket first
    if (socketStatus === 'connected' && ws.current?.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify({
          action: 'addNote',
          recordId,
          content: activeNote,
          userId: user._id
        }));
        setActiveNote("");
        return;
      } catch (err) {
        console.error("WebSocket send error:", err);
      }
    }

    // Fallback to HTTP API
    try {
      setError("Using fallback method (realtime unavailable)...");
      await axios.post(`${API_BASE_URL}/api/notes`, {
        recordId,
        note: activeNote,
        doctorId: user._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveNote("");
      setError(null);
    } catch (err) {
      setError("Failed to save note. Please try again later.");
      console.error("Error saving note:", err);
    }
  };

  // Video call functions
  const generateRoomId = () => Math.random().toString(36).substring(2, 10);

  const joinVideoCall = () => {
    if (!roomId) {
      setError("Please enter a Room ID");
      return;
    }
    const email = user?.email || 'doctor@example.com';
    window.location.href = `http://localhost:3000?email=${email}&room=${roomId}&role=doctor`;
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // UI helper functions
  const toggleRecordExpansion = (recordId) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null);
    } else {
      setExpandedRecord(recordId);
      if (!notes[recordId]) {
        fetchNotes(recordId);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter records based on search term
  const filteredRecords = patientRecords.filter(record => 
    record.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Doctor Portal</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>Welcome, Dr. {user?.name}</span>
          <button 
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={styles.contentContainer}>
        <nav style={styles.nav}>
          <button 
            style={activeTab === "records" ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab("records")}
          >
            Patient Records
          </button>
          <button 
            style={activeTab === "video" ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab("video")}
          >
            Video Consultation
          </button>
        </nav>

        {error && (
          <div style={styles.errorAlert}>
            {error}
            <button onClick={() => setError(null)} style={styles.alertCloseButton}>×</button>
          </div>
        )}

        {activeTab === "records" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Patient Records</h2>
            
            <div style={styles.controlsRow}>
              <div style={styles.patientSelector}>
                <label style={styles.label}>Select Patient:</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  disabled={loading}
                  style={styles.select}
                >
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            {loading ? (
              <div style={styles.loading}>Loading records...</div>
            ) : filteredRecords.length === 0 ? (
              <div style={styles.noRecords}>No records found for selected patient</div>
            ) : (
              <div style={styles.recordsGrid}>
                {filteredRecords.map((record) => (
                  <div 
                    key={record._id} 
                    style={expandedRecord === record._id ? styles.expandedRecordCard : styles.recordCard}
                  >
                    <div 
                      style={styles.recordHeader}
                      onClick={() => toggleRecordExpansion(record._id)}
                    >
                      <h3 style={styles.recordTitle}>{record.filename}</h3>
                      <span style={styles.recordType}>{record.fileType}</span>
                      <button 
                        style={styles.viewButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFile(record._id);
                        }}
                      >
                        View File
                      </button>
                    </div>
                    
                    {expandedRecord === record._id && (
                      <div style={styles.recordDetails}>
                        <div style={styles.textPreview}>
                          <h4 style={styles.previewTitle}>Extracted Text:</h4>
                          <pre style={styles.preText}>{record.text}</pre>
                        </div>
                        
                        <div style={styles.notesSection}>
                          <h4 style={styles.notesTitle}>Doctor's Notes:</h4>
                          {(notes[record._id] || []).length > 0 ? (
                            notes[record._id].map(note => (
                              <div key={note._id} style={styles.note}>
                                <div style={styles.noteHeader}>
                                  <strong style={styles.noteAuthor}>Dr. {note.doctorId?.name || 'You'}</strong>
                                  <span style={styles.noteDate}>{formatDate(note.createdAt)}</span>
                                </div>
                                <p style={styles.noteContent}>{note.note}</p>
                              </div>
                            ))
                          ) : (
                            <p style={styles.noNotes}>No notes available for this record.</p>
                          )}
                          
                          <div style={styles.noteEditor}>
                            <textarea
                              value={activeNote}
                              onChange={(e) => setActiveNote(e.target.value)}
                              placeholder="Add your clinical notes..."
                              style={styles.textarea}
                            />
                            <button 
                              onClick={() => handleAddNote(record._id)}
                              style={styles.addNoteButton}
                              disabled={!activeNote.trim()}
                            >
                              Add Note
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "video" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Video Consultation</h2>
            <div style={styles.videoCallContainer}>
              <p style={styles.videoCallInstructions}>
                Enter the Room ID provided by your patient or generate a new one
              </p>
              <div style={styles.roomIdInput}>
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  style={styles.roomIdField}
                />
                <button 
                  onClick={() => setRoomId(generateRoomId())}
                  style={styles.generateButton}
                >
                  Generate New ID
                </button>
              </div>
              <button 
                onClick={joinVideoCall}
                disabled={!roomId}
                style={roomId ? styles.videoCallButton : styles.videoCallButtonDisabled}
              >
                Join Video Call
              </button>
            </div>
          </div>
        )}

        {/* Connection status indicator */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 15px',
          backgroundColor: socketStatus === 'connected' ? '#4CAF50' : '#F44336',
          color: 'white',
          borderRadius: '4px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: socketStatus === 'connected' ? 'white' : 'yellow',
            marginRight: '8px',
            animation: socketStatus === 'connected' ? 'none' : 'pulse 1.5s infinite'
          }} />
          {socketStatus === 'connected' ? 'Realtime connected' : 'Realtime disconnected'}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    color: '#333',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontSize: '1rem',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem',
  },
  navButton: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#7f8c8d',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  activeNavButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
    marginBottom: '2rem',
  },
  sectionTitle: {
    color: '#2c3e50',
    marginTop: 0,
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  patientSelector: {
    flex: 1,
    minWidth: '300px',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  searchContainer: {
    flex: 1,
    minWidth: '300px',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  recordsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  recordCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s',
    cursor: 'pointer',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  expandedRecordCard: {
    border: '1px solid #3498db',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s',
    cursor: 'pointer',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(52, 152, 219, 0.2)',
    gridColumn: '1 / -1',
  },
  recordHeader: {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e0e0e0',
  },
  recordTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '500',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  recordType: {
    backgroundColor: '#e0e0e0',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    margin: '0 1rem',
  },
  viewButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    flexShrink: 0,
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  recordDetails: {
    padding: '1rem',
  },
  textPreview: {
    marginBottom: '1.5rem',
    color: '#555',
    lineHeight: '1.6',
  },
  preText: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontFamily: 'inherit',
    margin: 0,
    padding: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  previewTitle: {
    marginTop: 0,
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#2c3e50',
  },
  notesSection: {
    borderTop: '1px solid #eee',
    paddingTop: '1rem',
  },
  notesTitle: {
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '1rem',
    color: '#2c3e50',
  },
  note: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  noteAuthor: {
    color: '#2c3e50',
  },
  noteDate: {
    color: '#7f8c8d',
    fontSize: '0.8rem',
  },
  noteContent: {
    margin: 0,
    color: '#555',
    lineHeight: '1.5',
  },
  noRecords: {
    color: '#7f8c8d',
    textAlign: 'center',
    padding: '2rem',
  },
  noNotes: {
    color: '#7f8c8d',
    textAlign: 'center',
    padding: '1rem',
  },
  noteEditor: {
    marginTop: '1.5rem',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    resize: 'vertical',
  },
  addNoteButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#219653',
    },
    ':disabled': {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
    },
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d',
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertCloseButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: 0,
    marginLeft: '1rem',
  },
  videoCallContainer: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  videoCallInstructions: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#333',
  },
  roomIdInput: {
    display: 'flex',
    marginBottom: '20px',
  },
  roomIdField: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  generateButton: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '0 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
    fontSize: '14px',
    ':hover': {
      backgroundColor: '#e67e22',
    },
  },
  videoCallButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '100%',
    ':hover': {
      backgroundColor: '#218838',
    },
  },
  videoCallButtonDisabled: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'not-allowed',
    width: '100%',
  },
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 }
  }
};

export default DoctorDashboard;