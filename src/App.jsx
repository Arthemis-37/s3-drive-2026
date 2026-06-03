import React, { useState } from 'react';
import { S3Provider, useS3 } from './S3Context';
import { ConfigForm } from './components/ConfigForm';
import { FileManager } from './components/FileManager';
import { FileUploader } from './components/FileUploader';

function MainApp() {
  const { selectedBucket } = useS3();
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>☁️ Mon S3 Cloud Drive</h1>
      
      <ConfigForm />
      
      {selectedBucket ? (
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>
            Contenu du bucket : <span style={{ color: '#0070f3' }}>{selectedBucket}</span>
          </h2>
          
          {/* Module d'envoi de fichier */}
          <FileUploader onUploadSuccess={triggerRefresh} />
          
          {/* Tableau d'affichage, de téléchargement et de suppression */}
          <FileManager key={refreshKey} />
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          Veuillez configurer vos accès et indiquer un nom du bucket pour commencer.
        </p>
      )}
    </div>
  );
}

function App() {
  return (
    <S3Provider>
      <MainApp />
    </S3Provider>
  );
}

export default App;