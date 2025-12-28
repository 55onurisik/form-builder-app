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

const ReactFormGenerator = dynamic(
  () => import('react-form-builder2').then((mod) => mod.ReactFormGenerator),
  {
    ssr: false,
    loading: () => <div className="p-5 text-center">Preview Yükleniyor...</div>
  }
);

const FormBuilderArea = () => {
  const [formTitle, setFormTitle] = useState('My Form');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const formBuilderRef = React.useRef<any>(null);

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
      if (response.status === 201 || response.data.data?._id) {
        alert(`Form başarıyla kaydedildi! ID: ${response.data.data._id}`);
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

  const handleBuilderPost = (data: any) => {
    // ReactFormBuilder'ın kendi save butonu tıklandığında buraya düşer
    const taskData = data.task_data ? data.task_data : data;
    setFormData(taskData);
    handleSave(data);
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

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${!showPreview ? 'active' : ''}`}
          onClick={() => setShowPreview(false)}
        >
          📝 Form Designer
        </button>
        <button
          className={`tab-button ${showPreview ? 'active' : ''}`}
          onClick={() => setShowPreview(true)}
          disabled={formData.length === 0}
        >
          👁️ Preview & Test {formData.length === 0 && '(Önce form elemanı ekleyin)'}
        </button>
      </div>

      {/* Builder Section */}
      {!showPreview && (
        <div className="builder-section">
          <p className="builder-info">
            ℹ️ <strong>Nasıl Kullanılır:</strong><br/>
            1. Sağdaki araç çubuğundan form elemanlarını sol tarafa sürükleyip bırakın<br/>
            2. Elemanlar üzerine tıklayarak özelliklerini düzenleyin<br/>
            3. Toolbar'daki <strong>Save</strong> butonuna tıklayarak MongoDB'ye kaydedin<br/>
            4. <strong>Preview & Test</strong> sekmesine geçerek formunuzu test edin
          </p>
          <ReactFormBuilder
            onPost={handleBuilderPost}
          />
        </div>
      )}

      {/* Preview Section */}
      {showPreview && (
        <div className="preview-section">
          {formData.length > 0 ? (
            <>
              <h3>Form Preview - Test Your Form</h3>
              <p className="preview-note">
                👉 Burada formunuzu test edebilirsiniz. Yazabilir, seçim yapabilirsiniz.
              </p>
              <ReactFormGenerator
                data={formData}
                onSubmit={(data: any) => {
                  console.log('Form submitted with data:', data);
                  alert('Form test edildi! Console\'a bakın.');
                }}
              />
            </>
          ) : (
            <div className="empty-preview">
              <p>Henüz form elemanı eklemediniz.</p>
              <p>Form Designer sekmesine gidip sürükle-bırak ile eleman ekleyin.</p>
            </div>
          )}
        </div>
      )}

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
          margin-bottom: 20px;
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

        .tab-navigation {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .tab-button {
          flex: 1;
          padding: 12px 20px;
          border: 2px solid #dee2e6;
          background: white;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-button:hover {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .tab-button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .save-button {
          padding: 12px 30px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .save-button:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .save-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .builder-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border: 1px solid #dee2e6;
          min-height: 500px;
        }

        .builder-info {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 4px;
          color: #856404;
        }

        .preview-section {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border: 1px solid #dee2e6;
          min-height: 500px;
        }

        .preview-section h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .preview-note {
          background: #e7f3ff;
          border-left: 4px solid #007bff;
          padding: 12px;
          margin-bottom: 25px;
          border-radius: 4px;
          color: #004085;
        }

        .empty-preview {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .empty-preview p {
          font-size: 18px;
          margin: 10px 0;
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
