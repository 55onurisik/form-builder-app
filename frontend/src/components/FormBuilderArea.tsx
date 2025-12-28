'use client';

import SuccessModal from './SuccessModal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, Eye, Edit2, Folder, Layout, ArrowLeft, PlusCircle, X, Check, Trash2 } from 'lucide-react';
import 'react-form-builder2/dist/app.css';

const ReactFormBuilder = dynamic(
  () => import('react-form-builder2').then((mod) => mod.ReactFormBuilder),
  {
    ssr: false,
    loading: () => <div className="p-5 text-center">Yükleniyor...</div>
  }
);

const ReactFormGenerator = dynamic(
  () => import('react-form-builder2').then((mod) => mod.ReactFormGenerator),
  {
    ssr: false,
    loading: () => <div className="p-5 text-center">Yükleniyor...</div>
  }
);

const FormBuilderArea = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get('id');

  const [formTitle, setFormTitle] = useState('Başlıksız Form');
  const [formData, setFormData] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Custom Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingElement, setEditingElement] = useState<any>(null);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load form if ID is present
  useEffect(() => {
    if (formId) {
      const loadForm = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/forms/${formId}`);
          if (response.data && response.data.data) {
            const loadedForm = response.data.data;
            setFormTitle(loadedForm.title);
            setFormData(loadedForm.task_data || []);
            setRefreshKey(prev => prev + 1);
          }
        } catch (error) {
          console.error('Error loading form:', error);
          alert('Form yüklenemedi!');
        }
      };
      loadForm();
    }
  }, [formId]);

  const handleEditElement = (element: any, index: number) => {
    setEditingElement({ ...element, _index: index });
    setShowEditModal(true);
  };

  const handleSaveElement = () => {
    if (editingElement && typeof editingElement._index === 'number') {
      let updatedData = [...formData];
      const { _index, ...dataToSave } = editingElement;

      // Auto-generate field_name if empty
      if (!dataToSave.field_name) {
        const sourceText = dataToSave.label || dataToSave.content || `field_${Date.now()}`;
        const slug = sourceText
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9_]/g, '_') // Replace non-alphanumeric with underscore
          .replace(/_+/g, '_')         // Collapse multiple underscores
          .replace(/^_|_$/g, '');      // Trim leading/trailing underscores

        dataToSave.field_name = slug;
      }

      updatedData[_index] = dataToSave;

      const seen = new Set();
      updatedData = updatedData.filter(item => {
        const key = item.id || item.uuid || JSON.stringify(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setFormData(updatedData);
      setRefreshKey(prev => prev + 1);
      setShowEditModal(false);
      setEditingElement(null);

    }
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      const taskData = data.task_data ? data.task_data : data;
      const payload = {
        title: formTitle,
        task_data: taskData
      };

      const response = await axios.post('http://localhost:5000/api/forms', payload);

      if (response.status === 201 || response.data.data?._id) {
        setShowSuccessModal(true); // Show Success Modal
      } else {
        alert('Form kaydedilemedi.');
      }
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBuilderPost = (data: any) => {
    const taskData = data.task_data ? data.task_data : data;
    const uniqueData = taskData.filter((item: any, index: number, self: any[]) =>
      index === self.findIndex((t) => (t.id === item.id))
    );
    setFormData(uniqueData);
  };

  // Hijack Edit Button to use Custom Apple Modal & Bypass Standard Modal
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicked element is an edit button
      const btn = target.closest('.btn.is-isolated');
      if (!btn) return;

      // Check if it is the EDIT button (pencil icon)
      const isEditBtn = btn.querySelector('.fa-pencil') ||
        btn.querySelector('.fa-edit') ||
        btn.querySelector('.fa-pencil-square-o') ||
        btn.querySelector('.edit-icon'); // Our custom icon if any

      if (isEditBtn) {
        // Find the parent item
        const item = btn.closest('.rfb-item');
        if (item) {
          // Stop the library from seeing this click
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Find index to map to formData
          // We select all .rfb-item elements in the document to find the index of the clicked one
          const allItems = Array.from(document.querySelectorAll('.rfb-item'));
          const index = allItems.indexOf(item as Element);

          if (index !== -1 && formData[index]) {
            console.log('Hijacking edit for index:', index);
            handleEditElement(formData[index], index);
          }
        }
      }
    };

    // Use capture: true to intercept the event BEFORE React or the Library sees it
    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [formData]);


  return (
    <div className="apple-builder-container">
      {/* Header */}
      <div className="builder-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => router.push('/saved-forms')} title="Kayıtlı Formlar">
            <ArrowLeft size={20} />
          </button>
          <div className="title-input-wrapper">
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="title-input"
            />
            <Edit2 size={14} className="edit-icon" />
          </div>
        </div>

        <div className="header-controls">
          <div className="segmented-control">
            <button
              className={`segment-btn ${!showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(false)}
            >
              <Layout size={16} />
              <span>Düzenle</span>
            </button>
            <button
              className={`segment-btn ${showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(true)}
              disabled={formData.length === 0}
            >
              <Eye size={16} />
              <span>Önizle</span>
            </button>
          </div>

          <button
            className="save-btn-primary"
            onClick={() => handleSave({ task_data: formData })}
            disabled={isSaving || formData.length === 0}
          >
            {isSaving ? <div className="spinner-sm"></div> : <Save size={18} />}
            <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      <div className="builder-workspace">
        {!showPreview ? (
          <div className="canvas-area">
            <ReactFormBuilder
              onPost={handleBuilderPost}
              data={formData}
              key={refreshKey}
            />
          </div>
        ) : (
          <div className="preview-area">
            <div className="preview-card">
              <div className="preview-header">
                <h3>Önizleme Modu</h3>
                <p>Kullanıcılar formu bu şekilde görecek.</p>
              </div>
              <ReactFormGenerator
                data={formData}
                onSubmit={(data: any) => alert('Test Gönderimi Başarılı!')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modern Edit Modal */}
      {showEditModal && editingElement && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Elemanı Düzenle</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {/* Field Name (Key) */}
              <div className="form-item">
                <label>Alan Adı (Değişken İsmi)</label>
                <input
                  type="text"
                  value={editingElement.field_name || ''}
                  onChange={(e) => {
                    // Auto-generate slug if empty? No, let user type.
                    // Maybe restrict chars? For now allow all, but usually underscore specific.
                    setEditingElement({ ...editingElement, field_name: e.target.value })
                  }}
                  placeholder="örn: user_email"
                />
                <small style={{ color: '#86868b', fontSize: '11px' }}>Bu alan form verilerinin veritabanında saklanacağı anahtar kelimedir.</small>
              </div>

              {/* Label / Text */}
              <div className="form-item">
                <label>{['Header', 'Paragraph', 'Label'].includes(editingElement.element) ? 'İçerik Metni' : 'Etiket (Label)'}</label>
                {['Header', 'Paragraph', 'Label'].includes(editingElement.element) ? (
                  <textarea
                    value={editingElement.content || ''}
                    onChange={(e) => setEditingElement({ ...editingElement, content: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <input
                    type="text"
                    value={editingElement.label || ''}
                    onChange={(e) => setEditingElement({ ...editingElement, label: e.target.value })}
                  />
                )}
              </div>

              {/* Placeholder */}
              {!['Header', 'Paragraph', 'LineBreak', 'RadioButtons', 'Checkboxes', 'Label'].includes(editingElement.element) && (
                <div className="form-item">
                  <label>Placeholder (İpucu)</label>
                  <input
                    type="text"
                    value={editingElement.placeholder || ''}
                    onChange={(e) => setEditingElement({ ...editingElement, placeholder: e.target.value })}
                  />
                </div>
              )}

              {/* Options List */}
              {['Dropdown', 'Checkboxes', 'RadioButtons', 'Tags'].includes(editingElement.element) && (
                <div className="form-item">
                  <label>Seçenekler</label>
                  <div className="options-container">
                    {(editingElement.options || []).map((opt: any, idx: number) => (
                      <div key={idx} className="option-row">
                        <input
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...editingElement.options];
                            newOpts[idx] = { ...newOpts[idx], text: e.target.value, value: e.target.value };
                            setEditingElement({ ...editingElement, options: newOpts });
                          }}
                        />
                        <button className="icon-btn-danger" onClick={() => {
                          const newOpts = editingElement.options.filter((_: any, i: number) => i !== idx);
                          setEditingElement({ ...editingElement, options: newOpts });
                        }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button className="add-option-btn" onClick={() => {
                      const newOpts = [...(editingElement.options || []), { key: `opt_${Date.now()}`, text: 'Yeni Seçenek', value: 'Yeni Seçenek' }];
                      setEditingElement({ ...editingElement, options: newOpts });
                    }}>
                      <PlusCircle size={16} />
                      <span>Seçenek Ekle</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>İptal</button>
              <button className="btn-primary" onClick={handleSaveElement}>
                <Check size={16} />
                <span>Değişiklikleri Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Form başarıyla kaydedildi!"
      />

      <style jsx global>{`
         /* GLOBAL FONT AWESOME FIX */
         /* The library uses FA5 classes (.fas) but we only have FA4 loaded */
         :global(.fas), :global(.far) {
            font-family: 'FontAwesome' !important;
            font-weight: normal;
            font-style: normal;
         }
         
         /* Ensure icon content is visible */
         :global(.fas::before), :global(.far::before) {
            opacity: 1 !important;
         }

         /* Fix for Drag Handle Icon (FA5 -> FA4 mapping) */
         :global(.fa-grip-vertical::before) {
            content: "\f0c9" !important; /* fa-bars (single backslash for JS string) */
            font-family: 'FontAwesome' !important;
         }

         /* FORCE VISIBILITY & FIX LAYOUT OF STANDARD BUTTONS */
         :global(.rfb-item .toolbar-header) {
            opacity: 1 !important;
            visibility: visible !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            position: absolute !important;
            right: 15px !important;
            top: 15px !important;
            background: transparent !important;
            width: auto !important; /* Fix width constraint */
            z-index: 100 !important;
         }

         :global(.rfb-item .toolbar-header-buttons) {
            display: flex !important;
            gap: 8px !important;
            position: relative !important;
            right: auto !important;
            top: auto !important;
            width: auto !important;
         }

         /* Hide the label badge to clean up UI */
         :global(.rfb-item .toolbar-header .label) {
            display: none !important; 
         }

         /* Style the buttons (Edit, Delete, Drag) */
         :global(.rfb-item .toolbar-header .btn.is-isolated) {
           background: white !important;
           border: 1px solid #e5e5ea !important;
           border-radius: 8px !important;
           width: 32px !important;
           height: 32px !important;
           padding: 0 !important;
           display: flex !important;
           align-items: center !important;
           justify-content: center !important;
           box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
           transition: all 0.2s !important;
           cursor: pointer !important;
         }

         /* Specific Icons */
         :global(.rfb-item .toolbar-header .btn.is-isolated i) {
            color: #0071e3 !important; /* Apple Blue */
            font-size: 14px !important;
         }

         :global(.rfb-item .toolbar-header .btn.is-isolated:hover) {
           transform: scale(1.1) !important;
           box-shadow: 0 4px 12px rgba(0,113,227,0.2) !important;
           border-color: #0071e3 !important;
         }
         
         /* Delete Button Specifics - Red */
         :global(.rfb-item .toolbar-header .btn.is-isolated:has(.fa-trash)) {
            /* Optional: make delete button red on hover */
         }
         :global(.rfb-item .toolbar-header .btn.is-isolated:has(.fa-trash):hover i) {
            color: #d70015 !important;
         }

         :global(.rfb-item) {
           position: relative !important;
           overflow: visible !important;
         }

         /* Soft Rounded Toolbox & Sticky */
         :global(.react-form-builder) {
            overflow: visible !important;
         }

         :global(.react-form-builder-toolbar) {
            border-radius: 16px !important;
            border: 1px solid #e5e5ea !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;

            /* Fixed Positioning - Scroll ile birlikte hareket eder */
            position: fixed !important;
            top: 145px !important;
            right: 200px !important;
            width: 250px !important;
            max-height: calc(100vh - 110px) !important;
            overflow-y: auto !important;
            z-index: 900 !important;
            background: white !important;
            display: block !important;
         }
         
         /* Ensure the parent allows for sticky height */
         :global(.react-form-builder-body) {
           position: relative !important;
           min-height: 100vh; /* Ensure container is tall enough */
         }


      `}</style>

      <style jsx>{`
        .apple-builder-container {
          min-height: 100vh;
          background: #f5f5f7;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .builder-header {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .back-btn {
          background: none;
          border: none;
          color: #1d1d1f;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .back-btn:hover { background: #e5e5ea; }

        .title-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .title-input {
          font-size: 18px;
          font-weight: 600;
          color: #1d1d1f;
          border: none;
          background: transparent;
          padding: 5px 10px;
          border-radius: 6px;
          min-width: 200px;
          transition: background 0.2s;
        }
        .title-input:hover, .title-input:focus {
          background: #e5e5ea;
          outline: none;
        }

        .edit-icon {
          position: absolute;
          right: 10px;
          color: #86868b;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .title-input-wrapper:hover .edit-icon { opacity: 1; }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .segmented-control {
          background: #e5e5ea;
          padding: 4px;
          border-radius: 8px;
          display: flex;
          gap: 4px;
        }

        .segment-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #1d1d1f;
          cursor: pointer;
          transition: all 0.2s;
        }

        .segment-btn.active {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .save-btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0071e3;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 2px 4px rgba(0, 113, 227, 0.2);
        }
        .save-btn-primary:hover:not(:disabled) {
          background: #0077ed;
        }
        .save-btn-primary:disabled {
          background: #999;
          cursor: not-allowed;
        }

        .builder-workspace {
          flex: 1;
          padding: 40px;
          display: flex;
          justify-content: center;
          overflow: visible !important; /* Critical for sticky to work */
        }

        .canvas-area {
          width: 100%;
          max-width: 1200px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          padding: 20px;
          overflow: visible !important; /* Critical for sticky to work */
        }

        .preview-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          padding: 40px;
          margin: 0 auto;
        }

        .preview-header {
           text-align: center;
           margin-bottom: 30px;
           border-bottom: 1px solid #f0f0f0;
           padding-bottom: 20px;
        }
        .preview-header h3 { margin: 0; color: #1d1d1f; }
        .preview-header p { color: #86868b; font-size: 14px; }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .apple-modal {
          background: white;
          width: 90%;
          max-width: 450px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          overflow: hidden;
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
          padding: 15px 20px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fafafc;
        }
        .modal-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
        
        .close-btn {
          background: none;
          border: none;
          color: #86868b;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .form-item { margin-bottom: 20px; }
        .form-item label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #86868b;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .apple-modal input, .apple-modal textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e5ea;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .apple-modal input:focus, .apple-modal textarea:focus {
          border-color: #0071e3;
          outline: none;
        }

        .options-container {
          background: #fafafc;
          border-radius: 8px;
          padding: 10px;
          border: 1px solid #f0f0f0;
        }
        
        .option-row {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
        }
        
        .icon-btn-danger {
          background: #fff0f0;
          color: #d70015;
          border: none;
          border-radius: 6px;
          width: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-option-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          background: white;
          border: 1px dashed #ccc;
          border-radius: 6px;
          color: #0071e3;
          font-size: 13px;
          cursor: pointer;
        }
        .add-option-btn:hover { border-color: #0071e3; background: #f5f9ff; }

        .modal-footer {
          padding: 15px 20px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          background: #fafafc;
        }

        .btn-secondary {
           background: white;
           border: 1px solid #e5e5ea;
           color: #1d1d1f;
           padding: 8px 16px;
           border-radius: 8px;
           font-size: 14px;
           cursor: pointer;
        }

        .btn-primary {
           background: #0071e3;
           color: white;
           border: none;
           padding: 8px 16px;
           border-radius: 8px;
           font-size: 14px;
           font-weight: 500;
           display: flex;
           align-items: center;
           gap: 6px;
           cursor: pointer;
        }
        .btn-primary:hover { background: #0077ed; }

        .spinner-sm {
           width: 16px; height: 16px;
           border: 2px solid rgba(255,255,255,0.3);
           border-top-color: white;
           border-radius: 50%;
           animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FormBuilderArea;
