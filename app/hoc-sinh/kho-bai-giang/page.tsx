"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. Component nội dung chính chứa logic useSearchParams
function KhoBaiGiangContent() {
  const searchParams = useSearchParams();
  const khoi = searchParams.get('khoi') || '10';

  const [baiHocs, setBaiHocs] = useState<any[]>([]);

  useEffect(() => {
    // Lấy đúng danh sách bài học do quản trị viên đã cấu hình cho khối này
    const saved = localStorage.getItem(`baiHoc_khoi_${khoi}`);
    if (saved) {
      setBaiHocs(JSON.parse(saved));
    } else {
      setBaiHocs([
        { id: 1, tenBai: 'Bài 1: Thông tin và xử lý thông tin', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]);
    }
  }, [khoi]);

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto', color: '#E4E4E7', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', color: '#38BDF8', marginBottom: '2rem' }}>Danh Sách Bài Học - Khối {khoi}</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {baiHocs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#71717A', fontStyle: 'italic', padding: '2rem 0' }}>Chưa có bài học nào trong khối này.</p>
        ) : (
          baiHocs.map((bai) => (
            <div key={bai.id} style={{ backgroundColor: '#18181B', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #3F3F46', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>{bai.tenBai}</h3>
              </div>
              
              <a href={bai.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Học bài ngay ➔
                </button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 2. Component xuất chính (Default Export) được bọc trong Suspense
export default function HocSinhKhoBaiGiang() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', color: '#E4E4E7' }}>Đang tải danh sách bài học...</div>}>
      <KhoBaiGiangContent />
    </Suspense>
  );
}