'use client';

import { useState } from 'react';
import { ReactFormBuilder } from 'react-form-builder2';
import axios from 'axios';
import 'react-form-builder2/dist/app.css';

const FormBuilderArea = () => {
  const [formTitle, setFormTitle] = useState('My Form');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: any) => {
    setIsSaving(true);

    try {
      const payload = {
        title: formTitle,
        task_data: data.task_data
      };

      const response = await axios.post('http://localhost:5000/api/forms', payload);

      if (response.data.success) {
        alert('Form saved successfully!');
        console.log('Saved form:', response.data.data);
      } else {
        alert('Failed to save form');
        console.error('Save failed:', response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Error saving form: ${errorMessage}`);
      console.error('Error saving form:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-builder-container">
      <div className="header-section">
        <h1>Form Builder</h1>
        <div className="form-title-input">
          <label htmlFor="formTitle">Form Title:</label>
          <input
            id="formTitle"
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Enter form title"
            className="form-control"
          />
        </div>
      </div>

      <div className="builder-section">
        <ReactFormBuilder
          onPost={handleSave}
          saveUrl="#"
          saveAlways={false}
        />
      </div>

      {isSaving && (
        <div className="saving-indicator">
          Saving form...
        </div>
      )}

      <style jsx>{`
        .form-builder-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .header-section {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .header-section h1 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-title-input {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-title-input label {
          font-weight: 600;
          color: #555;
        }

        .form-title-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .builder-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .saving-indicator {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #007bff;
          color: white;
          padding: 15px 25px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default FormBuilderArea;
