import { useState } from 'react';

const DatabaseExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Fetch from the new endpoint you just created
      const response = await fetch('http://localhost:5000/api/export-db', {
        method: 'GET',
        // headers: {
        //   'Authorization': `Bearer ${yourAdminTokenHere}` 
        // }
      });

      if (!response.ok) {
        throw new Error('Failed to export database');
      }

      // Convert the response to a Blob (binary large object)
      const blob = await response.blob();
      
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      
      // Set the file name with today's date
      const dateString = new Date().toISOString().split('T')[0];
      link.download = `database_backup_${dateString}.json`;
      
      // Append, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Export Error:", error);
      alert("An error occurred while exporting the database.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={isExporting}
      style={{
        padding: '10px 20px',
        backgroundColor: isExporting ? '#ccc' : '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: isExporting ? 'not-allowed' : 'pointer'
      }}
    >
      {isExporting ? 'Exporting Data...' : 'Export Full Database'}
    </button>
  );
};

export default DatabaseExportButton;