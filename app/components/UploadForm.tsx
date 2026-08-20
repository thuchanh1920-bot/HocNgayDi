"use client";
import { useState } from 'react';

export default function UploadForm({ examId }: { examId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage('⚠️ Vui lòng chọn một file Word (.docx)');
      return;
    }
    setIsUploading(true);
    setMessage('⏳ Đang phân tích file Word...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('examId', examId);

    try {
      const res = await fetch('/api/cau-hoi/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Thành công! Đã thêm ${data.count} câu hỏi. Đang chuyển hướng...`);
        
        // Ép trình duyệt chuyển hướng ngay lập tức về trang danh sách đề kiểm tra
        setTimeout(() => {
          window.location.href = '/de-kiem-tra';
        }, 1200);

      } else {
        setMessage(`❌ Lỗi từ máy chủ: ${data.error}`);
        setIsUploading(false);
      }
    } catch (error) {
      setMessage('❌ Đã xảy ra lỗi kết nối khi tải file.');
      setIsUploading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#18181B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #3F3F46', marginBottom: '2rem', color: 'white' }}>
      <p style={{ marginBottom: '1rem', color: '#A1A1AA', fontSize: '0.95rem' }}>
        Tải lên file Word (.docx) chứa ngân hàng câu hỏi theo đúng cấu trúc.
      </p>
      
      <input 
        type="file" 
        accept=".docx" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
        style={{ display: 'block', marginBottom: '1rem', color: 'white' }} 
      />
      
      <button 
        onClick={handleUpload} 
        disabled={isUploading} 
        style={{ 
          padding: '0.75rem 1.5rem', 
          borderRadius: '8px', 
          border: 'none', 
          backgroundColor: isUploading ? '#4B5563' : '#2563EB', 
          color: 'white', 
          fontWeight: 'bold', 
          cursor: isUploading ? 'not-allowed' : 'pointer' 
        }}
      >
        {isUploading ? 'Đang xử lý...' : '🚀 Bắt đầu Upload & Trích xuất'}
      </button>

      {message && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#27272A', borderRadius: '8px', fontWeight: 'bold' }}>
          {message}
        </div>
      )}
    </div>
  );
}