# Build
react-scripts build

# Deploy
# Copy build folder to genai-query-builder bucket in GCS
# Open Cloud Shell
# Run the following commands
mkdir genai-query-builder
gsutil rsync -r gs://genai-react-app ./genai-query-builder
cd genai-query-builder
gcloud app deploy