'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, Database } from 'lucide-react';

export default function ViewResponsesPage() {
    const { id } = useParams();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [formParams, setFormParams] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        return ['Gönderim Tarihi', ...fields.map((f: any) => f.label || f.text || 'Soru')];
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

            if (field.options && val !== '-') {
                const findOptionLabel = (v: string) => {
                    const option = field.options.find((o: any) => o.value === v || o.key === v);
                    return option ? option.text : v;
                };

                if (Array.isArray(val)) {
                    val = val.map(findOptionLabel).join(', ');
                } else {
                    val = findOptionLabel(val);
                }
            }
            row.push(val);
        });
        return row;
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
                                                    {i > 0 && <FileText size={14} />}
                                                    {h}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub: any) => (
                                        <tr key={sub._id}>
                                            {getRowData(sub).map((cell: any, i: number) => (
                                                <td key={i}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

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
                }

                .apple-table tr:last-child td { border-bottom: none; }
                .apple-table tr:hover { background-color: #f5f9ff; }

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
            `}</style>
        </div>
    );
}
