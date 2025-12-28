'use client';

import React, { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-form-builder2/dist/app.css';

// KRİTİK DÜZELTME: Next.js SSR hatasını önlemek için Dynamic Import
const ReactFormBuilder = dynamic(
  () => import('react-form-builder2').then((mod) => mod.ReactFormBuilder),
  { 
    ssr: false, // Sunucuda çalıştırma, sadece tarayıcıda çalıştır
    loading: () => <div className="p-5 text-center">Form Yükleniyor...</div>
  }
);

const FormBuilderArea = () => {
  const [formTitle, setFormTitle] = useState('My Form');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: any) => {
    setIsSaving(true);

    try {
      // Form Builder bazen task_data içinde bazen direkt array döner, kontrol edelim
      const taskData = data.task_data ? data.task_data : data;

      const payload = {
        title: formTitle,
        task_data: taskData
      };

      const response = await axios.post('http://localhost:5000/api/forms', payload);

      // Backend direkt oluşturulan objeyi (ve _id'sini) döner
      if (response.status === 201 || response.data._id) {
        alert(`Form başarıyla kaydedildi! ID: ${response.data._id}`);
        console.log('Saved form:', response.data);
      } else {
        alert('Form kaydedilemedi.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Bilinmeyen bir hata oluştu';
      alert(`Hata: ${errorMessage}`);
      console.error('Save error:', error);
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
          url="" // Boş bırakıyoruz ki eski data çekmeye çalışmasın
          saveUrl="" 
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
          border: 1px solid #dee2e6;
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
          min-width: 100px;
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
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border: 1px solid #dee2e6;
        }

        .saving-indicator {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #28a745;
          color: white;
          padding: 15px 25px;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          font-weight: 600;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FormBuilderArea;
