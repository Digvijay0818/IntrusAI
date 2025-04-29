import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile]     = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) return alert("Please select a CSV file first.");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData,file);

    try {
      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
      console.log("Request sent");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Hybrid IDS Demo</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Detecting…" : "Upload & Detect"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Result</h2>
          <p><strong>Class:</strong> {result.class_name}</p>
          <p><strong>Model:</strong> {result.model_used}</p>
          <p><strong>Confidence:</strong> {result?.confidence ? result.confidence.toFixed(2) : 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
