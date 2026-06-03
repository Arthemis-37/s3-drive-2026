import React, { useEffect, useState, useCallback } from 'react';
import { useS3 } from '../S3Context'; // Vérifié : un seul point pour remonter dans src/
import { ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const FileManager = () => {
  const { s3Client, selectedBucket } = useS3();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFiles = useCallback(async () => {
    if (!s3Client || !selectedBucket) return;

    setLoading(true);
    setError('');
    try {
      const command = new ListObjectsV2Command({
        Bucket: selectedBucket,
      });
      const response = await s3Client.send(command);
      setFiles(response.Contents || []);
    } catch (err) {
      setError('Erreur lors de la récupération des fichiers. Vérifiez les permissions IAM ou le CORS.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [s3Client, selectedBucket]);
  const handleDownload = async (fileKey) => {
    try {
      const command = new GetObjectCommand({
        Bucket: selectedBucket,
        Key: fileKey,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      window.open(url, '_blank');
    } catch (err) {
      alert("Impossible de générer le lien de téléchargement.");
      console.error(err);
    }
  };

  const handleDelete = async (fileKey) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer "${fileKey}" ?`)) return;

    try {
      const command = new DeleteObjectCommand({
        Bucket: selectedBucket,
        Key: fileKey,
      });
      await s3Client.send(command);
      alert("Fichier supprimé avec succès !");
      fetchFiles(); // Rafraîchit la liste
    } catch (err) {
      alert("Erreur lors de la suppression.");
      console.error(err);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Octet';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getExtension = (filename) => {
    if (!filename) return 'Inconnu';
    return filename.split('.').pop().toUpperCase() || 'Inconnu';
  };

  return (
    <div style={{ marginTop: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>📄 Fichiers du Drive</h3>
        <button 
          onClick={fetchFiles} 
          style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
        >
          🔄 Rafraîchir
        </button>
      </div>

      {loading && <p>Chargement des fichiers...</p>}
      {error && <p style={{ color: '#ff4a4a', fontWeight: 'bold' }}>{error}</p>}

      {!loading && !error && files.length === 0 && (
        <p style={{ textAlign: 'center', color: '#aaa', padding: '30px', border: '1px dashed #555', borderRadius: '8px', backgroundColor: '#222' }}>
          Ce bucket est vide. Utilisez le module d'upload ci-dessus pour ajouter votre premier fichier !
        </p>
      )}

      {!loading && !error && files.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#222', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#333', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #444' }}>Nom</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #444' }}>Type</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #444' }}>Taille</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #444' }}>Dernière modification</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #444', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.Key} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '12px' }}>{file.Key}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{getExtension(file.Key)}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{formatSize(file.Size)}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{new Date(file.LastModified).toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDownload(file.Key)} 
                    style={{ marginRight: '8px', backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ⬇️ Télécharger
                  </button>
                  <button 
                    onClick={() => handleDelete(file.Key)} 
                    style={{ backgroundColor: '#c62828', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};