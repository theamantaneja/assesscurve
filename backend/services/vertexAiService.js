const { spawn } = require('child_process');
const path = require('path');
const process = require('process'); // For getting environment vars

// Service to run a Python script for evaluating a PDF using Vertex AI
const { spawn } = require('child_process');
const path = require('path');

// Service to run Python script for evaluating a PDF using Vertex AI
const runVertexAIPdfEvaluation = (pdfFilePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['backend/python-scripts/vertexAiScript.py', pdfFilePath]);

    let output = '';

    // Capture the output from the Python script (stdout)
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString(); // Accumulate stdout data
    });

    // Capture errors from the Python script (stderr)
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python process: ${data.toString()}`);
      reject(new Error(`Error during PDF evaluation: ${data.toString()}`));
    });

    // When the process finishes
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          // Parse the JSON output from the Python script
          const result = JSON.parse(output); 
          resolve(result);  // Resolve with the evaluation results
        } catch (error) {
          reject(new Error('Failed to parse Python script output as JSON.'));
        }
      } else {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
};

module.exports = { runVertexAIPdfEvaluation };

module.exports = { runVertexAIPdfEvaluation };