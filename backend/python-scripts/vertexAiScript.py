import os
import sys
import vertexai
from vertexai.generative_models import GenerativeModel, Part

# Set up the Google Cloud credentials path
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/credentials/assesscurve-6d6c42083e0c.json"

# Initialize the project ID and location
PROJECT_ID = "assesscurve"
vertexai.init(project=PROJECT_ID, location="us-central1")

# Get the PDF file path from command line arguments
pdf_file_path = sys.argv[1]

# Load the Gemini model for evaluation
model = GenerativeModel(model_name="gemini-1.5-flash-002")

# Create a prompt that instructs Gemini on how to evaluate the PDF
prompt = (
    "You are provided with a set of questions and their corresponding answers from an exam.\n"
    "1. Parse all the question-and-answer pairs from the PDF.\n"
    "2. Evaluate each answer against the corresponding question, and provide the following for each pair:\n"
    "   a. A score out of the maximum marks that might be allocated to that question.\n"
    "   b. Detailed feedback based on the accuracy, completeness, and clarity of the answer.\n"
    "3. Provide a summary of the performance of the answer sheet with an overall score based on individual question evaluations."
)

# Load the PDF file as a `Part` object for the model's input
pdf_file = Part.from_file(pdf_file_path, mime_type="application/pdf")

# Provide the PDF and the prompt to the model for content generation
contents = [pdf_file, prompt]
response = model.generate_content(contents)

# Output the evaluation results (this will be sent to the Node.js process)
print(response.text)