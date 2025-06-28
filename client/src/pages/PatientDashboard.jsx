import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorAssistant from "./DoctorAssistant"; 

const PatientDashboard = () => {
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState({});
  const [doctors, setDoctors] = useState([]);
  
  const [videoRoomId, setVideoRoomId] = useState(generateRoomId());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [activeTab, setActiveTab] = useState("records");
  const [expandedRecord, setExpandedRecord] = useState(null);
  const ws = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Generate random room ID
  function generateRoomId() {
    return Math.random().toString(36).substring(2, 10);
  }

  // Handle video call initiation
  const startVideoCall = () => {
    const roomId = videoRoomId;
    const email = user?.email || 'patient@example.com';
    window.location.href = `http://localhost:3000?email=${email}&room=${roomId}&role=patient`;
  };

  // Generate new room ID
  const generateNewRoomId = () => {
    setVideoRoomId(generateRoomId());
  };

   useEffect(() => {
    if (userId) {
      fetchRecords(userId);
    }
  }, [userId]);

useEffect(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  ws.current = new WebSocket(`${protocol}://${API_BASE_URL.replace(/^https?:\/\//, '')}`);

  ws.current.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.current.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.type === 'noteAdded') {
        setNotes(prev => ({
          ...prev,
          [data.recordId]: [...(prev[data.recordId] || []), data.note]
        }));
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  };

  ws.current.onerror = (err) => {
    console.error('WebSocket error:', err);
  };

  ws.current.onclose = (e) => {
    console.log('WebSocket closed:', e.code, e.reason);
  };

  return () => ws.current?.close();
}, []);

 

  const fetchRecords = async (uid) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/records/${uid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      setMessage("Failed to load records");
      console.error("Error:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users?role=doctor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
      if (res.data.length > 0) {
        setSelectedDoctor(res.data[0]._id);
      }
    } catch (err) {
      setMessage("Failed to load doctors");
      console.error("Error:", err);
    }
  };

 

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

  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   if (!file || !userId) {
  //     setMessage("Please select a file");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     setLoading(true);
  //     setMessage("");
  //     setError(null);
      
  //     const res = await axios.post(
  //       `${API_BASE_URL}/api/records/upload`, 
  //       formData,
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'multipart/form-data'
  //         }
  //       }
  //     );

  //     setMessage("Upload successful!");
  //     fetchRecords(userId);
  //   } catch (err) {
  //     setMessage(err.response?.data?.error || "Upload failed");
  //     console.error("Error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleUpload = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  if (!userId) {
    setMessage("Login failed or incomplete. Please login again.");
    return;
  }

  if (!file) {
    setMessage("Please select a file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setLoading(true);
    setMessage("");
    setError(null);

    const res = await axios.post(
      `${API_BASE_URL}/api/records/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessage("Upload successful!");
    fetchRecords(userId);
  } catch (err) {
    setMessage(err.response?.data?.error || "Upload failed");
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};


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

  return (
    <div className="patient-dashboard" style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Medical Portal</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>Welcome, {user?.name}</span>
         <button 
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/");
                }}
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
            Medical Records
          </button>
          <button 
            style={activeTab === "doctor" ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab("doctor")}
          >
            Doctor Assistant
          </button>
          <button 
            style={activeTab === "upload" ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab("upload")}
          >
            Upload Records
          </button>
          <button 
            style={activeTab === "video" ? styles.activeNavButton : styles.navButton}
            onClick={() => setActiveTab("video")}
          >
            Video Consultation
          </button>
        </nav>

        {message && (
          <div style={message.includes("success") ? styles.successAlert : styles.errorAlert}>
            {message}
            <button onClick={() => setMessage("")} style={styles.alertCloseButton}>×</button>
          </div>
        )}

        {error && (
          <div style={styles.errorAlert}>
            {error}
            <button onClick={() => setError(null)} style={styles.alertCloseButton}>×</button>
          </div>
        )}

        {activeTab === "upload" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Upload Medical Records</h2>
            <form onSubmit={handleUpload} style={styles.uploadForm}>
              <div style={styles.fileInputContainer}>
                <label style={styles.fileInputLabel}>
                  Choose File
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    disabled={loading}
                    style={styles.fileInput}
                  />
                </label>
                {file && <span style={styles.fileName}>{file.name}</span>}
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={loading ? styles.uploadButtonDisabled : styles.uploadButton}
              >
                {loading ? "Uploading..." : "Upload File"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "doctor" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Doctor AI Assistant</h2>
            <div style={{ height: "600px" }}>
              <DoctorAssistant />
            </div>
          </div>
        )}

        {activeTab === "records" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Your Medical Records</h2>
            {records.length === 0 ? (
              <p style={styles.noRecords}>No medical records found.</p>
            ) : (
              <div style={styles.recordsGrid}>
                {records.map(rec => (
                  <div 
                    key={rec._id} 
                    style={expandedRecord === rec._id ? styles.expandedRecordCard : styles.recordCard}
                  >
                    <div 
                      style={styles.recordHeader}
                      onClick={() => toggleRecordExpansion(rec._id)}
                    >
                      <h3 style={styles.recordTitle}>{rec.filename}</h3>
                      <span style={styles.recordType}>{rec.fileType}</span>
                      <button 
                        style={styles.viewButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFile(rec._id);
                        }}
                      >
                        View File
                      </button>
                    </div>
                    
                    {expandedRecord === rec._id && (
                      <div style={styles.recordDetails}>
                        <div style={styles.textPreview}>
                          <h4 style={styles.previewTitle}>Content Preview:</h4>
                          <p>{rec.text?.substring(0, 500)}...</p>
                        </div>
                        
                        <div style={styles.notesSection}>
                          <h4 style={styles.notesTitle}>Doctor's Notes:</h4>
                          {(notes[rec._id] || []).length > 0 ? (
                            notes[rec._id].map(note => (
                              <div key={note._id} style={styles.note}>
                                <div style={styles.noteHeader}>
                                  <strong style={styles.noteAuthor}>Dr. {note.doctorId?.name || 'Unknown'}</strong>
                                  <span style={styles.noteDate}>{formatDate(note.createdAt)}</span>
                                </div>
                                <p style={styles.noteContent}>{note.note}</p>
                              </div>
                            ))
                          ) : (
                            <p style={styles.noNotes}>No notes available for this record.</p>
                          )}
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
                Click the button below to start a video consultation with your doctor.
                Share this Room ID with your doctor: 
                <strong style={styles.roomId}>{videoRoomId}</strong>
              </p>
              <div style={styles.videoCallActions}>
                <button 
                  onClick={startVideoCall}
                  style={styles.videoCallButton}
                >
                  Start Video Call
                </button>
                <button 
                  onClick={generateNewRoomId}
                  style={styles.newRoomButton}
                >
                  Generate New Room ID
                </button>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );


};



// Styles object
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
  subSectionTitle: {
    color: '#2c3e50',
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  uploadForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '600px',
  },
  fileInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  fileInputLabel: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-block',
    transition: 'background-color 0.2s',
  },
  fileInput: {
    display: 'none',
  },
  fileName: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
  },
  uploadButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s',
  },
  uploadButtonDisabled: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '1rem',
    alignSelf: 'flex-start',
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
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'background-color 0.2s',
  },
  recordDetails: {
    padding: '1rem',
  },
  textPreview: {
    marginBottom: '1.5rem',
    color: '#555',
    lineHeight: '1.6',
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

  formGroup: {
    marginBottom: '1rem',
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  formSelect: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  formInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  bookButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  },
  bookButtonDisabled: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '1rem',
  },
  joinButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  },
  successAlert: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  roomId: {
    display: 'inline-block',
    padding: '5px 10px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    marginLeft: '8px',
    fontFamily: 'monospace',
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
  },
  // videoCallButton:hover: {
  //   backgroundColor: red,
  // },
};

  


export default PatientDashboard;