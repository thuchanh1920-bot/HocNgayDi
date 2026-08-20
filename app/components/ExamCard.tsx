"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamCard({ de }: { de: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đề "${de.tenDe}" không? Tất cả câu hỏi bên trong sẽ bị xóa vĩnh viễn.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/de-kiem-tra/${de.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh(); // Làm mới lại danh sách ngay lập tức
      } else {
        alert('Lỗi khi xóa đề.');
        setIsDeleting(false);
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ.');
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#18181B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27272A', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ backgroundColor: '#0284C7', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
  {/* Tự động làm sạch để chỉ hiển thị đúng một chữ "Khối" duy nhất */}
          Khối {String(de.khoi).replace(/khối/gi, '').trim()}
          </span>
          <span style={{ color: de.trangThai === 'Chưa mở' ? '#F59E0B' : '#10B981', fontSize: '0.875rem', fontWeight: 'bold' }}>
            {de.trangThai}
          </span>
        </div>
        
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'white', lineHeight: '1.4' }}>
          {de.tenDe}
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', color: '#A1A1AA', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <span>⏱ {de.thoiGian} phút</span>
          <span>|</span>
          <span>📝 {de.soCau} câu hỏi</span>
        </div>
      </div>

      {/* Cụm nút bấm: Chi tiết và Xóa */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link href={`/de-kiem-tra/${de.id}`} style={{ textDecoration: 'none', display: 'block' }}>
          <button 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '6px', 
              border: '1px solid #3F3F46', 
              backgroundColor: '#27272A', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            Chi tiết / Thêm câu hỏi
          </button>
        </Link>

        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ 
            width: '100%', 
            padding: '0.6rem', 
            borderRadius: '6px', 
            border: '1px solid #7F1D1D', 
            backgroundColor: isDeleting ? '#451A03' : 'transparent', 
            color: '#EF4444', 
            cursor: isDeleting ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          {isDeleting ? '⏳ Đang xóa...' : '🗑 Xóa đề kiểm tra'}
        </button>
      </div>
    </div>
  );
}