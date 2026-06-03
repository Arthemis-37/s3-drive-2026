import React, { useState } from 'react';
import { useS3 } from '../S3Context';

export const ConfigForm = () => {
  const { credentials, setCredentials, setSelectedBucket } = useS3();
  const [bucketInput, setBucketInput] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleConnect = (e) => {
    e.preventDefault();
    if (!bucketInput.trim()) {
      alert("Veuillez saisir un nom de bucket valide.");
      return;
    }
    setSelectedBucket(bucketInput.trim());
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#1e1e1e', color: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>⚙️ Configuration Connexion AWS</h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <input
          type="text"
          name="accessKeyId"
          placeholder="AWS Access Key ID"
          value={credentials.accessKeyId}
          onChange={handleChange}
          style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
        />
        <input
          type="password"
          name="secretAccessKey"
          placeholder="AWS Secret Access Key"
          value={credentials.secretAccessKey}
          onChange={handleChange}
          style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
        />
        <input
          type="text"
          name="region"
          placeholder="Region (ex: eu-west-3)"
          value={credentials.region}
          onChange={handleChange}
          style={{ padding: '8px', width: '120px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
        />
      </div>

      <div style={{ marginTop: '15px', borderTop: '1px solid #444', paddingTop: '15px' }}>
        <form onSubmit={handleConnect} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ marginRight: '10px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              📁 Nom du Bucket S3 :
            </label>
            <input
              type="text"
              placeholder="Ex: s3-drive-2026"
              value={bucketInput}
              onChange={(e) => setBucketInput(e.target.value)}
              style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔌 Se connecter au Bucket
          </button>
        </form>
      </div>
    </div>
  );
};