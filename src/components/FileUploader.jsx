import React, { useState } from 'react';
import { useS3 } from '../S3Context';
import { Upload } from '@aws-sdk/lib-storage';

export const FileUploader = ({ onUploadSuccess }) => {
  const { s3Client, selectedBucket } = useS3();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!s3Client || !selectedBucket || !file) return;

    setUploading(true);
    try {
      const parallelUploads3 = new Upload({
        client: s3Client,
        params: {
          Bucket: selectedBucket,
          Key: file.name,
          Body: file,
          ContentType: file.type,
        },
      });

      await parallelUploads3.done();

      alert(`Fichier "${file.name}" téléversé avec succès !`);
      setFile(null); 
      
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Erreur lors de l'upload :", err);
      alert("Une erreur est survenue lors de l'envoi du fichier.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px dashed #0070f3', borderRadius: '8px', backgroundColor: '#1a233a', marginBottom: '20px', color: '#fff' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>📤 Envoyer un nouveau fichier</h4>
      <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          disabled={uploading}
          style={{ padding: '5px', color: '#fff' }}
        />
        <button 
          type="submit" 
          disabled={!file || uploading}
          style={{
            padding: '8px 15px',
            backgroundColor: file && !uploading ? '#0070f3' : '#444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: file && !uploading ? 'pointer' : 'not-allowed'
          }}
        >
          {uploading ? 'Envoi en cours...' : 'Uploader'}
        </button>
      </form>
    </div>
  );
};