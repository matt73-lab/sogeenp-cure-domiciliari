// components/ui/FileUpload.js - Componente per upload e gestione PDF
import { useState, useRef } from 'react';
import Button from './Button';

export default function FileUpload({ 
  onFileUpload, 
  onFileDelete, 
  currentFile = null,
  acceptedTypes = ".pdf",
  maxSize = 10 * 1024 * 1024, // 10MB default
  label = "Carica documento",
  description = "PDF fino a 10MB"
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError(null);
    
    // Validazione tipo file
    if (!file.type.includes('pdf')) {
      setError('Solo file PDF sono supportati');
      return;
    }

    // Validazione dimensione
    if (file.size > maxSize) {
      setError(`File troppo grande. Massimo ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    setUploading(true);

    try {
      // Simula upload (in produzione qui ci sarebbe la chiamata API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file) // In produzione sarebbe l'URL del server
      };

      onFileUpload(fileData);
    } catch (err) {
      setError('Errore durante l\'upload del file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    if (currentFile) {
      onFileDelete();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Area Upload */}
      {!currentFile && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-3">
            <div className="text-4xl">📄</div>
            <div>
              <p className="text-lg font-medium text-gray-900">{label}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Caricamento in corso...</span>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                icon="📁"
              >
                Seleziona File
              </Button>
            )}
          </div>
        </div>
      )}

      {/* File Caricato */}
      {currentFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📄</div>
              <div>
                <p className="font-medium text-green-800">{currentFile.name}</p>
                <p className="text-sm text-green-600">
                  {formatFileSize(currentFile.size)} • 
                  Caricato il {formatDate(currentFile.uploadDate)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                icon="👁️"
                onClick={() => window.open(currentFile.url, '_blank')}
              >
                Visualizza
              </Button>
              <Button
                size="sm"
                variant="outline"
                icon="📥"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = currentFile.url;
                  link.download = currentFile.name;
                  link.click();
                }}
              >
                Scarica
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon="🗑️"
                onClick={handleDelete}
              >
                Elimina
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Errori */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">⚠️</div>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Area di sostituzione quando c'è già un file */}
      {currentFile && (
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">Sostituisci documento:</p>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={acceptedTypes}
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Caricamento in corso...</span>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">Trascina un nuovo file qui o</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Seleziona Nuovo File
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
