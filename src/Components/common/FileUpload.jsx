import React, { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ 
  onFileSelect, 
  acceptedFormats = ['.csv', '.xlsx', '.json'],
  maxSizeMB = 10,
  title = "Upload Your Data",
  description = "Drag and drop your file here, or click to browse"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    // Check file format
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      return `File format not supported. Please upload ${acceptedFormats.join(', ')}`;
    }

    return null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    simulateUpload(selectedFile);
  };

  const simulateUpload = (file) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setSuccess(true);
          if (onFileSelect) {
            onFileSelect(file);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <h3 className="file-upload-title">{title}</h3>
      
      <div
        className={`file-upload-dropzone ${dragActive ? 'active' : ''} ${error ? 'error' : ''} ${success ? 'success' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!file && !uploading ? handleInputClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-upload-input"
          accept={acceptedFormats.join(',')}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          style={{ display: 'none' }}
        />

        {!file && !uploading && !success && (
          <div className="file-upload-prompt">
            <div className="upload-icon">📁</div>
            <p className="upload-description">{description}</p>
            <button type="button" className="upload-browse-btn">
              Browse Files
            </button>
            <p className="upload-formats">
              Supported formats: {acceptedFormats.join(', ')} (Max {maxSizeMB}MB)
            </p>
          </div>
        )}

        {file && !error && (
          <div className="file-upload-preview">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{formatFileSize(file.size)}</p>
            </div>
            
            {uploading && (
              <div className="upload-progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="progress-text">{uploadProgress}% uploaded</p>
              </div>
            )}

            {success && (
              <div className="upload-success">
                <span className="success-icon">✓</span>
                <p className="success-text">Upload complete!</p>
              </div>
            )}

            {success && (
              <button 
                type="button" 
                className="upload-reset-btn"
                onClick={handleReset}
              >
                Upload Another File
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="file-upload-error">
            <div className="error-icon">⚠️</div>
            <p className="error-text">{error}</p>
            <button 
              type="button" 
              className="upload-retry-btn"
              onClick={handleReset}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="file-upload-help">
        <h4>Need help formatting your data?</h4>
        <p>
          Download our <a href="#" className="sample-link">sample template</a> to ensure your data uploads correctly.
        </p>
        <details className="format-details">
          <summary>View required data format</summary>
          <ul className="format-list">
            <li><strong>Date:</strong> YYYY-MM-DD format</li>
            <li><strong>Emission Source:</strong> Text (e.g., Diesel, Electricity)</li>
            <li><strong>Quantity:</strong> Numeric value</li>
            <li><strong>Unit:</strong> Text (e.g., Litres, kWh, tCO₂e)</li>
            <li><strong>Location:</strong> Optional text field</li>
          </ul>
        </details>
      </div>
    </div>
  );
};

export default FileUpload;
