'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, Database, X, Printer, Download } from 'lucide-react';

export default function ViewResponsesPage() {
    const { id } = useParams();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [formParams, setFormParams] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Document View States
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);

    useEffect(() => {
        if (id) {
            Promise.all([
                axios.get(`http://localhost:5000/api/forms/${id}`),
                axios.get(`http://localhost:5000/api/forms/${id}/submissions`)
            ]).then(([formRes, subRes]) => {
                if (formRes.data && formRes.data.data) {
                    setFormParams(formRes.data.data);
                }
                if (subRes.data && subRes.data.data) {
                    setSubmissions(subRes.data.data);
                }
            })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const getHeaders = () => {
        if (!formParams || !formParams.task_data) return ['Tarih', 'Veri'];
        const excludeElements = [
            'Header', 'Paragraph', 'LineBreak', 'Image', 'Label',
            'TwoColumnRow', 'ThreeColumnRow', 'FourColumnRow'
        ];

        const fields = formParams.task_data.filter((f: any) =>
            excludeElements.indexOf(f.element) === -1
        );
        // Add empty header for Actions column
        return ['Gönderim Tarihi', ...fields.map((f: any) => f.label || f.text || 'Soru'), 'Islemler'];
    };

    const getRowData = (submission: any) => {
        const row = [new Date(submission.createdAt).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        })];

        if (!formParams || !formParams.task_data) {
            return row.concat([JSON.stringify(submission.data)]);
        }

        const excludeElements = [
            'Header', 'Paragraph', 'LineBreak', 'Image', 'Label',
            'TwoColumnRow', 'ThreeColumnRow', 'FourColumnRow'
        ];

        const fields = formParams.task_data.filter((f: any) =>
            excludeElements.indexOf(f.element) === -1
        );

        fields.forEach((field: any) => {
            const answer = submission.data.find((a: any) => a.name === field.field_name || a.id === field.id);
            let val = answer ? answer.value : '-';

            // Helper to find label for a value
            const findOptionLabel = (v: string) => {
                if (!field.options) return v;
                const option = field.options.find((o: any) => o.value === v || o.key === v);
                return option ? option.text : v;
            };

            if (Array.isArray(val)) {
                // Handle Checkboxes / Multiple Choice
                val = val.map(findOptionLabel).join(', ');
            } else if (field.options && val !== '-') {
                // Handle Radio / Dropdown
                val = findOptionLabel(val);
            }

            row.push(val);
        });
        return row;
    };

    const handleViewDocument = (submission: any) => {
        setSelectedSubmission(submission);
        setShowDocumentModal(true);
    };

    const headers = getHeaders();

    if (loading) return (
        <div className="loading-state">
            <div className="spinner"></div>
            <p>Yanıtlar Yükleniyor...</p>
        </div>
    );

    return (
        <div className="container">
            <div className="header-glass">
                <div className="header-inner">
                    <Link href="/saved-forms" className="back-link">
                        <ArrowLeft size={18} />
                        <span>Geri</span>
                    </Link>
                    <div className="title-section">
                        <h1>{formParams?.title}</h1>
                        <span className="badge">{submissions.length} Yanıt</span>
                    </div>
                </div>
            </div>

            <div className="content-wrapper">
                {submissions.length === 0 ? (
                    <div className="empty-state">
                        <Database size={48} className="empty-icon" />
                        <h3>Henüz Yanıt Yok</h3>
                        <p>Bu form henüz kimse tarafından doldurulmadı.</p>
                    </div>
                ) : (
                    <div className="table-card">
                        <div className="table-responsive">
                            <table className="apple-table">
                                <thead>
                                    <tr>
                                        {headers.map((h: string, i: number) => (
                                            <th key={i}>
                                                <div className="th-content">
                                                    {i === 0 && <Calendar size={14} />}
                                                    {i > 0 && i < headers.length - 1 && <FileText size={14} />}
                                                    {h === 'Islemler' ? '' : h}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub: any) => {
                                        const rowData = getRowData(sub);
                                        return (
                                            <tr key={sub._id}>
                                                {rowData.map((cell: any, i: number) => (
                                                    <td key={i}>{cell}</td>
                                                ))}
                                                {/* Action Column */}
                                                <td style={{ width: '80px', textAlign: 'center' }}>
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => handleViewDocument(sub)}
                                                        title="Belge Olarak Görüntüle"
                                                    >
                                                        <FileText size={18} />
                                                        <span>Belge</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Document View Modal */}
            {showDocumentModal && selectedSubmission && formParams && (
                <div className="doc-modal-overlay" onClick={() => setShowDocumentModal(false)}>
                    <div className="doc-modal" onClick={e => e.stopPropagation()}>
                        <div className="doc-header">
                            <div className="doc-title">
                                <h2>{formParams.title}</h2>
                                <span className="doc-date">
                                    {new Date(selectedSubmission.createdAt).toLocaleDateString('tr-TR', {
                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <div className="doc-actions">
                                <button className="icon-btn" onClick={() => window.print()} title="Yazdır">
                                    <Printer size={20} />
                                </button>
                                <button className="icon-btn close" onClick={() => setShowDocumentModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="doc-body">
                            {(() => {
                                const excludeElements = [
                                    'Header', 'Paragraph', 'LineBreak', 'Image', 'Label',
                                    'TwoColumnRow', 'ThreeColumnRow', 'FourColumnRow'
                                ];
                                const fields = formParams.task_data.filter((f: any) =>
                                    excludeElements.indexOf(f.element) === -1
                                );

                                return fields.map((field: any, idx: number) => {
                                    const answer = selectedSubmission.data.find((a: any) => a.name === field.field_name || a.id === field.id);
                                    let val = answer ? answer.value : '-';

                                    // Same formatting logic
                                    const findOptionLabel = (v: string) => {
                                        if (!field.options) return v;
                                        const option = field.options.find((o: any) => o.value === v || o.key === v);
                                        return option ? option.text : v;
                                    };

                                    if (Array.isArray(val)) {
                                        val = val.map(findOptionLabel).join(', ');
                                    } else if (field.options && val !== '-') {
                                        val = findOptionLabel(val);
                                    }

                                    return (
                                        <div className="doc-item" key={idx}>
                                            <label>{field.label || field.text || 'Soru'}</label>
                                            <div className="doc-value">{val}</div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                body {
                  background-color: #f5f5f7;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  color: #1d1d1f;
                  margin: 0;
                }

                .header-glass {
                  background: rgba(255,255,255,0.85);
                  backdrop-filter: blur(20px);
                  border-bottom: 1px solid rgba(0,0,0,0.1);
                  position: sticky;
                  top: 0;
                  z-index: 100;
                  padding: 20px 0;
                }

                .header-inner {
                   max-width: 1200px;
                   margin: 0 auto;
                   padding: 0 20px;
                   display: flex;
                   align-items: center;
                   gap: 20px;
                }

                .back-link {
                   display: flex;
                   align-items: center;
                   gap: 5px;
                   text-decoration: none;
                   color: #86868b;
                   font-weight: 500;
                   transition: color 0.2s;
                }
                .back-link:hover { color: #1d1d1f; }

                .title-section {
                   display: flex;
                   align-items: center;
                   gap: 15px;
                }

                h1 {
                   margin: 0;
                   font-size: 20px;
                   font-weight: 600;
                }

                .badge {
                   background: #e3f2fd;
                   color: #0071e3;
                   padding: 4px 10px;
                   border-radius: 12px;
                   font-size: 12px;
                   font-weight: 600;
                }

                .content-wrapper {
                   max-width: 1200px;
                   margin: 40px auto;
                   padding: 0 20px;
                }

                .table-card {
                   background: white;
                   border-radius: 18px;
                   box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                   overflow: hidden;
                   border: 1px solid rgba(0,0,0,0.05);
                }

                .table-responsive {
                   overflow-x: auto;
                }

                .apple-table {
                   width: 100%;
                   border-collapse: collapse;
                   font-size: 14px;
                }

                .apple-table th {
                   background: #fafafc;
                   padding: 15px 20px;
                   text-align: left;
                   font-weight: 600;
                   color: #86868b;
                   border-bottom: 1px solid #e5e5ea;
                   white-space: nowrap;
                }

                .th-content {
                   display: flex;
                   align-items: center;
                   gap: 8px;
                }

                .apple-table td {
                   padding: 15px 20px;
                   border-bottom: 1px solid #f5f5f7;
                   color: #1d1d1f;
                   vertical-align: middle;
                }

                .apple-table tr:last-child td { border-bottom: none; }
                .apple-table tr:hover { background-color: #f5f9ff; }

                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: white;
                    border: 1px solid #d2d2d7;
                    border-radius: 12px;
                    color: #1d1d1f;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-btn:hover {
                    background: #f5f5f7;
                    border-color: #86868b;
                }

                /* Document Modal */
                .doc-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(5px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.2s;
                }

                .doc-modal {
                    width: 100%;
                    max-width: 700px;
                    max-height: 90vh;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    animation: slideUp 0.3s;
                    overflow: hidden;
                }

                .doc-header {
                    padding: 20px 30px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    background: #fafafc;
                }

                .doc-title h2 { margin: 0; font-size: 24px; color: #1d1d1f; }
                .doc-date { font-size: 14px; color: #86868b; margin-top: 5px; display: block; }
                
                .doc-actions { display: flex; gap: 10px; }
                .icon-btn {
                    width: 36px; height: 36px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%;
                    border: 1px solid #e5e5ea;
                    background: white;
                    color: #1d1d1f;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .icon-btn:hover { background: #f5f5f7; }
                .icon-btn.close { color: #ff3b30; border-color: #ff3b30; }
                .icon-btn.close:hover { background: #fff0f0; }

                .doc-body {
                    padding: 40px;
                    overflow-y: auto;
                }

                .doc-item {
                    margin-bottom: 30px;
                }
                .doc-item label {
                    display: block;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #86868b;
                    margin-bottom: 8px;
                    font-weight: 600;
                }
                .doc-value {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #1d1d1f;
                    border-left: 3px solid #0071e3;
                    padding-left: 15px;
                }

                /* Print Styles */
                /* Print Styles */
                @media print {
                    .doc-modal-overlay { 
                        position: absolute; 
                        top: 0; left: 0;
                        width: 100%; 
                        height: auto; 
                        background: white; 
                        z-index: 10000;
                        backdrop-filter: none;
                        display: block;
                    }
                    .doc-modal { 
                        box-shadow: none; 
                        max-width: none; 
                        width: 100%;
                        max-height: none; 
                        border: none;
                        overflow: visible;
                    }
                    .doc-body { padding: 0; overflow: visible; }
                    .doc-actions, .header-glass, .content-wrapper, .back-link { display: none !important; }
                    body { background: white; overflow: visible; }
                }

                .loading-state, .empty-state {
                   text-align: center;
                   padding: 80px 0;
                   color: #86868b;
                }

                .spinner {
                   width: 30px; height: 30px;
                   border: 3px solid #e5e5ea;
                   border-top-color: #0071e3;
                   border-radius: 50%;
                   animation: spin 1s linear infinite;
                   margin: 0 auto 15px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .empty-icon {
                   color: #d2d2d7;
                   margin-bottom: 15px;
                }
                
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
