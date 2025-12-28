'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit3, Trash2, FileText, BarChart2, Folder } from 'lucide-react';

export default function SavedFormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/forms');
      setForms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      alert('Formlar yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu formu silmek istediğinize emin misiniz?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/forms/${id}`);
      setForms(forms.filter(f => f._id !== id));
    } catch (error) {
      console.error("Delete error", error);
      alert("Silme işlemi başarısız.");
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/?id=${id}`);
  };

  return (
    <div className="page-container">
      <div className="header-glass">
        <div className="header-content">
          <div className="title-area">
            <div className="icon-wrapper">
              <Folder size={24} color="#007bff" />
            </div>
            <h1>Kayıtlı Formlar</h1>
          </div>
          <Link href="/" className="btn-primary">
            <Plus size={18} />
            <span>Yeni Form</span>
          </Link>
        </div>
      </div>

      <div className="content-area">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Yükleniyor...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>Henüz form yok</h3>
            <p>İlk formunuzu oluşturmak için yukarıdaki butonu kullanın.</p>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map((form) => (
              <div key={form._id} className="form-card">
                <div className="card-content">
                  <h3 className="form-title">{form.title || 'İsimsiz Form'}</h3>
                  <div className="form-meta">
                    <span className="meta-badge">ID: {form._id.substring(0, 8)}...</span>
                    <span className="meta-date">
                      {form.createdAt ? new Date(form.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih yok'}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <Link href={`/forms/${form._id}/view`} className="action-btn btn-view" title="Doldur">
                    <FileText size={16} />
                    <span>Doldur</span>
                  </Link>
                  <Link href={`/forms/${form._id}/responses`} className="action-btn btn-responses" title="Yanıtlar">
                    <BarChart2 size={16} />
                    <span>Yanıtlar</span>
                  </Link>
                  <button onClick={() => handleEdit(form._id)} className="action-btn btn-edit" title="Düzenle">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(form._id)} className="action-btn btn-delete" title="Sil">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        body {
          background-color: #f5f5f7;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1d1d1f;
        }

        .page-container {
          min-height: 100vh;
        }

        /* Header with Glassmorphism */
        .header-glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 20px 0;
        }

        .header-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title-area {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .icon-wrapper {
          background: #e3f2fd;
          padding: 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h1 {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #0071e3;
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0, 113, 227, 0.2);
        }

        .btn-primary:hover {
          background-color: #0077ed;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 113, 227, 0.3);
        }

        .content-area {
          max-width: 1000px;
          margin: 40px auto;
          padding: 0 20px;
        }

        /* Forms Grid */
        .forms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .form-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
        }

        .form-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .card-content {
          padding: 25px;
          flex: 1;
        }

        .form-title {
          margin: 0 0 10px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1d1d1f;
        }

        .form-meta {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 12px;
          color: #86868b;
        }

        .meta-badge {
          background: #f5f5f7;
          padding: 2px 8px;
          border-radius: 4px;
          align-self: flex-start;
          font-family: monospace;
          color: #6e6e73;
        }

        .card-actions {
          padding: 15px 25px;
          background: #fafafc;
          border-top: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .btn-view {
          background: #e8f5e9;
          color: #2e7d32;
          flex: 1;
          justify-content: center;
        }
        .btn-view:hover { background: #c8e6c9; }

        .btn-responses {
          background: #e3f2fd;
          color: #1565c0;
          flex: 1;
          justify-content: center;
        }
        .btn-responses:hover { background: #bbdefb; }

        .btn-edit, .btn-delete {
          padding: 8px;
          width: 34px;
          height: 34px;
          justify-content: center;
        }

        .btn-edit {
          background: #f5f5f7;
          color: #1d1d1f;
        }
        .btn-edit:hover { background: #e5e5ea; }

        .btn-delete {
          background: #fff0f0;
          color: #d70015;
        }
        .btn-delete:hover { background: #ffcccc; }

        /* Loading & Empty States */
        .loading-state, .empty-state {
          text-align: center;
          padding: 60px 0;
          color: #86868b;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #e5e5ea;
          border-top-color: #0071e3;
          border-radius: 50%;
          margin: 0 auto 15px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
