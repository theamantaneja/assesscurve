import React, { useState } from 'react';
import axios from './axiosConfig';  // Ensure axios is configured

const PdfUpload = () => {
  const [questionPaper, setQuestionPaper] = useState(null);
  const [answersPDF, setAnswersPDF] = useState(null);
  const [result, setResult] = useState(null);
  
  const handleFileUpload = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!questionPaper || !answersPDF) {
      alert("Please upload both PDFs!");
      return;
    }

    const formData = new FormData();
    formData.append('questionPaper', questionPaper);
    formData.append('answersPDF', answersPDF);

    try {
      const response = await axios.post('/api/teacher/evaluate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting the PDFs", error);
    }
  };

  return (
    <div className="pdf-upload-container">
      <h2>Upload PDFs for Evaluating Answer Sheets</h2>
      <input type="file" onChange={(e) => handleFileUpload(e, setQuestionPaper)} />
      <input type="file" onChange={(e) => handleFileUpload(e, setAnswersPDF)} />
      <button onClick={handleSubmit}>Submit for Evaluation</button>

      {result && <div>Result: {result}</div>}
    </div>
  );
};

export default PdfUpload;