import React, { useState } from 'react';

function ImageAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState('Describe what you see in this image in detail.');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResult('');

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('prompt', prompt);

      const response = await fetch('http://localhost:8080/auth/image/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
      }

      const data = await response.text();
      setResult(data);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Upload failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult('');
    setError(null);
    // Keep the prompt text as it might be reused
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
        
        {/* Title Section */}
        <h1 className="text-3xl font-semibold text-center text-white mb-6 bg-green-600 py-4 rounded-md">
          Image Analysis
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          Upload an image and get AI-powered analysis using Anthropic's Claude API
        </p>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="file-upload-section space-y-4">
            <label htmlFor="file-upload" className="block text-lg font-medium text-gray-700 cursor-pointer">
              {preview ? 'Change Image' : 'Choose Image'}
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input w-full text-gray-700 py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {preview && (
              <div className="image-preview-container relative mt-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="image-preview w-48 h-48 object-cover rounded-lg shadow-lg" 
                />
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="prompt-section">
            <label htmlFor="prompt" className="block text-lg font-medium text-gray-700">Prompt:</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Enter your prompt for image analysis"
              className="w-full h-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="action-buttons">
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>
        </form>

        {error && <div className="error-message mt-4 text-center text-red-600">{error}</div>}

        {result && (
          <div className="result-section mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Analysis Result</h2>
            <div className="result-content mt-4 text-gray-700">
              {result.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageAnalysis;
