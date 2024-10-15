import React, { useState } from 'react';
import axios from './axiosConfig'; // Axios should be configured to match the backend URL

const PdfUpload = () => {
  const [questionPaper, setQuestionPaper] = useState(null); // Question paper
  const [answersPDF, setAnswersPDF] = useState(null);       // Answer PDF
  const [result, setResult] = useState(null);               // Evaluation result

  // File upload handler for question paper and answers
  const handleFileUpload = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  // Submission handler for both PDFs
  const handleSubmit = async () => {
    if (!questionPaper || !answersPDF) {
      alert("Please upload both the question paper and answer sheet PDFs!");
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
      setResult(response.data); // Assuming the server responds with the evaluation
    } catch (error) {
      console.error("Error submitting the PDFs", error);
    }
  };

  return (
    <div className="pdf-upload-container">
      <h2>Upload PDFs for Evaluating Answer Sheets</h2>
      
      {/* Input for Question Paper PDF */}
      <label>Upload Question Paper (PDF):</label>
      <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, setQuestionPaper)} />
      
      {/* Input for Answers PDF */}
      <label>Upload Answer Sheet (PDF):</label>
      <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, setAnswersPDF)} />
      
      {/* Button to trigger evaluation */}
      <button onClick={handleSubmit}>Submit for Evaluation</button>

      {/* Display the evaluation result after submission (if available) */}
      {result && (
        <div className="evaluation-result">
          <h3>Evaluation Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;