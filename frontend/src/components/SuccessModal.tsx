'use client';

import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message = 'İşlem Başarılı!' }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="success-modal-overlay">
            <div className="success-modal-content">
                <div className="icon-circle">
                    <Check size={32} color="white" />
                </div>
                <h3>Başarılı</h3>
                <p>{message}</p>
            </div>

            <style jsx>{`
        .success-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .success-modal-content {
          background: white;
          padding: 30px 50px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          transform: scale(0.9);
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          background: #34c759; /* Apple Success Green */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(52, 199, 89, 0.3);
        }

        h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1d1d1f;
        }

        p {
          margin: 0;
          color: #86868b;
          font-size: 15px;
        }

        @keyframes popIn {
          to {
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default SuccessModal;
