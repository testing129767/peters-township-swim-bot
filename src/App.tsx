import React from 'react';
import { MobileChatInterface } from './components/MobileChatInterface';

export default function App() {
  const fetchDocContent = async (): Promise<string> => {
    try {
      const response = await fetch('/api/doc-content');
      if (!response.ok) {
        throw new Error('Failed to fetch doc content from /api/doc-content');
      }
      const data = await response.json();
      return data.text || '';
    } catch (err) {
      console.error('Error fetching doc content in App:', err);
      return '';
    }
  };

  return <MobileChatInterface fetchDocContent={fetchDocContent} />;
}

