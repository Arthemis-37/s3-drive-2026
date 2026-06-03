import React, { createContext, useContext, useState, useEffect } from 'react';
import { S3Client } from "@aws-sdk/client-s3";

const S3Context = createContext(null);

export const S3Provider = ({ children }) => {
  const [credentials, setCredentials] = useState({
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
    region: import.meta.env.VITE_AWS_REGION || 'eu-west-3'
  });

  const [s3Client, setS3Client] = useState(null);
  const [selectedBucket, setSelectedBucket] = useState('');

  useEffect(() => {
    if (credentials.accessKeyId && credentials.secretAccessKey) {
      try {
        const client = new S3Client({
          region: credentials.region,
          credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
          },
        });
        setS3Client(client);
      } catch (error) {
        console.error("Erreur d'initialisation S3 Client:", error);
        setS3Client(null);
      }
    } else {
      setS3Client(null);
    }
  }, [credentials]);

  return (
    <S3Context.Provider value={{ s3Client, credentials, setCredentials, selectedBucket, setSelectedBucket }}>
      {children}
    </S3Context.Provider>
  );
};

export const useS3 = () => useContext(S3Context);