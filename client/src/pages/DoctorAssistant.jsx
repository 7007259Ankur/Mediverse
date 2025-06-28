import React, { useEffect } from "react";

const DoctorAssistant = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{
      fontFamily: "Segoe UI, sans-serif",
      background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      color: "#fff",
      minHeight: "100vh",
      padding: "20px",
      textAlign: "center"
    }}>
      <header style={{ marginTop: "50px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "3rem" }}>Doctor AI</h1>
        <p style={{ fontSize: "1.2rem", color: "#ccc", maxWidth: "600px", margin: "0 auto" }}>
          Your personal AI-powered medical assistant is here to help you with your health queries.
        </p>
      </header>

      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "15px 20px",
        borderRadius: "10px",
        margin: "20px auto 40px",
        width: "90%",
        maxWidth: "600px",
        textAlign: "left"
      }}>
        <h2 style={{
          color: "#fff",
          fontSize: "1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          paddingBottom: "5px",
          marginBottom: "10px"
        }}>Example Questions:</h2>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", color: "#ddd" }}>
          <li>What medicine should I take for fever?</li>
          <li>What are the symptoms of dengue fever?</li>
          <li>Can you tell me about diabetes precautions?</li>
          <li>What’s the dosage for Paracetamol for adults?</li>
          <li>How can I prevent malaria?</li>
          <li>What are the side effects of Metformin?</li>
          <li>Suggest medicine for a sore throat.</li>
          <li>Is headache a symptom of COVID-19?</li>
        </ul>
      </div>

      <main style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
      }}>
        <elevenlabs-convai
          agent-id="agent_01jxh557s0e1v9z8ww42krrx3n"
          style={{ width: "350px", height: "500px", maxWidth: "90%" }}
        ></elevenlabs-convai>
      </main>
    </div>
  );
};

export default DoctorAssistant;
