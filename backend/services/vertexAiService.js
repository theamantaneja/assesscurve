const { spawn } = require('child_process');
const path = require('path');

// Service to run Python script for evaluating a PDF using Vertex AI
const runVertexAIPdfEvaluation = (pdfFilePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['backend/python-scripts/vertexAiScript.py', pdfFilePath]);

    pythonProcess.stdout.on('data', (data) => {
      resolve(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(`Error: ${data.toString()}`);
    });
  });
};

module.exports = { runVertexAIPdfEvaluation };