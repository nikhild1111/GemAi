// UploadResume.jsx
import React, { useState } from 'react';
import axios from 'axios';

import { getAuthHeaders } from "../utils/authHeader";
const Backend_url = import.meta.env.VITE_BACKEND_URL;

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(`${Backend_url }/api/resume/upload`, formData);
      setUploadMessage("Resume uploaded and processed! Questions generated.");
      console.log(res.data); // contains the generated questions
      // Navigate to QnA page or store questions in context
    } catch (err) {
      setUploadMessage("Upload failed. Try again.");
    }
  };

  return (
    <div className="p-4">
      <h2>Upload Your Resume</h2>
      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload & Generate Questions</button>
      <p>{uploadMessage}</p>
    </div>
  );
};

export default UploadResume;
