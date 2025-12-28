'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import 'react-form-builder2/dist/app.css';

const ReactFormGenerator = dynamic(
    () => import('react-form-builder2').then((mod) => mod.ReactFormGenerator),
    { ssr: false }
);

export default function ViewFormPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState<any[]>([]);
    const [formTitle, setFormTitle] = useState('Form');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/api/forms/${id}`)
                .then(res => {
                    if (res.data && res.data.data) {
                        setFormData(res.data.data.task_data || []);
                        setFormTitle(res.data.data.title);
                    }
                })
                .catch(err => console.error("Error loading form", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSubmit = (data: any) => {
        axios.post(`http://localhost:5000/api/forms/${id}/submissions`, data)
            .then(() => {
                alert('Form başarıyla gönderildi!');
                router.push('/saved-forms');
            })
            .catch(err => {
                console.error("Submission error", err);
                alert("Gönderim başarısız.");
            });
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Form Yükleniyor...</p>
        </div>
    );

    return (
        <div className="page-wrapper">
            {/* Background decoration */}
            <div className="bg-glow"></div>

            <div className="form-card">
                <div className="card-header">
                    <button onClick={() => router.back()} className="back-link">
                        <ArrowLeft size={16} /> Geri
                    </button>
                    <h1>{formTitle}</h1>
                </div>

                <div className="card-body">
                    <ReactFormGenerator
                        data={formData}
                        action_name="Gönder"
                        form_action="/"
                        form_method="POST"
                        onSubmit={handleSubmit}
                        submitButton={
                            <button type="submit" className="submit-btn primary">
                                <CheckCircle size={18} />
                                <span>Formu Gönder</span>
                            </button>
                        }
                    />
                </div>
            </div>

            <style jsx global>{`
        body {
          margin: 0;
          background-color: #f5f5f7;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1d1d1f;
        }

        .page-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
        }

        .bg-glow {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0,113,227,0.08) 0%, rgba(255,255,255,0) 70%);
          z-index: 0;
          pointer-events: none;
        }

        .form-card {
          width: 100%;
          max-width: 680px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          z-index: 1;
          overflow: hidden;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .card-header {
          padding: 30px 40px;
          border-bottom: 1px solid #f0f0f0;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: #86868b;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 10px;
          padding: 0;
          transition: color 0.2s;
        }
        .back-link:hover { color: #1d1d1f; }

        .card-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .card-body {
          padding: 40px;
        }

        /* Customize React Form Builder Styles Override */
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d2d2d7;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s;
          background: #fafafc;
        }

        .form-control:focus {
          border-color: #0071e3;
          background: white;
          outline: none;
          box-shadow: 0 0 0 4px rgba(0,113,227,0.1);
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #0071e3;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 10px rgba(0,113,227,0.2);
          margin-top: 20px;
        }

        .submit-btn:hover {
          background: #0077ed;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(0,113,227,0.3);
        }

        .loading-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #86868b;
        }
        
        .spinner {
           width: 30px; height: 30px;
           border: 3px solid #e5e5ea;
           border-top-color: #0071e3;
           border-radius: 50%;
           animation: spin 1s linear infinite;
           margin-bottom: 15px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
