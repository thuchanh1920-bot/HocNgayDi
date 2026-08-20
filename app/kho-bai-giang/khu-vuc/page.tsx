"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. Chuyển toàn bộ logic hiện tại vào component con này
function KhoBaiGiangKhuVucContent() {
  const searchParams = useSearchParams();
  const khoi = searchParams.get('khoi') || '10';

  const [baiHocs, setBaiHocs] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [tenBai, setTenBai] = useState('');
  const [url, setUrl] = useState('');

  const tenKhoiMap: Record<string, string> = {
    '10': 'Tin học 10 - Kết nối tri thức với cuộc sống',
    '11': 'Tin học 11 - Kết nối tri thức với cuộc sống',
    '12': 'Tin học 12 - Kết nối tri thức với cuộc sống'
  };

  const tieuDeKhoi = tenKhoiMap[khoi] || `Tin học ${khoi} - Kết nối tri thức với cuộc sống`;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || localStorage.getItem('userRole');
    if (role === 'admin' || role === 'quan-tri' || user.email?.includes('admin')) {
      setIsAdmin(true);
    }

    const saved = localStorage.getItem(`baiHoc_khoi_${khoi}`);
    if (saved) {
      setBaiHocs(JSON.parse(saved));
    } else {
      const defaultData = [
        { id: 1, tenBai: 'Bài 1: Thông tin và xử lý thông tin', youtubeUrl: 'https://www.youtube.com/' },
        { id: 2, tenBai: 'Bài 2: Thông tin và dữ liệu', youtubeUrl: 'https://www.youtube.com/' }
      ];
      setBaiHocs(defaultData);
      localStorage.setItem(`baiHoc_khoi_${khoi}`, JSON.stringify(defaultData));
    }
  }, [khoi]);

  const handleThemBai = () => {
    if (!tenBai || !url) return alert("Vui lòng nhập tên bài và đường dẫn!");
    const newBai = { id: Date.now(), tenBai, youtubeUrl: url };
    const newList = [...baiHocs, newBai];
    setBaiHocs(newList);
    localStorage.setItem(`baiHoc_khoi_${khoi}`, JSON.stringify(newList));
    setTenBai(''); setUrl(''); setShowForm(false);
  };

  const handleXoaBai = (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài học này không?")) return;
    const newList = baiHocs.filter(bai => bai.id !== id);
    setBaiHocs(newList);
    localStorage.setItem(`baiHoc_khoi_${khoi}`, JSON.stringify(newList));
  };

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto', color: '#E4E4E7', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#38BDF8', margin: 0 }}>Danh Sách Bài Học - {tieuDeKhoi}</h1>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '0.7rem 1.2rem', backgroundColor: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {showForm ? 'Hủy thêm' : '➕ Thêm bài học mới'}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div style={{ backgroundColor: '#27272A', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #4B5563', display: 'flex', gap: '0.5rem' }}>
          <input placeholder="Tên bài học" value={tenBai} onChange={e => setTenBai(e.target.value)} style={{ padding: '0.6rem', flex: 2, borderRadius: '6px', border: '1px solid #4B5563', backgroundColor: '#18181B', color: 'white' }} />
          <input placeholder="Đường dẫn liên kết" value={url} onChange={e => setUrl(e.target.value)} style={{ padding: '0.6rem', flex: 2, borderRadius: '6px', border: '1px solid #4B5563', backgroundColor: '#18181B', color: 'white' }} />
          <button onClick={handleThemBai} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {baiHocs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#71717A', fontStyle: 'italic', padding: '2rem 0' }}>Chưa có bài học nào trong khối này.</p>
        ) : (
          baiHocs.map((bai) => (
            <div key={bai.id} style={{ backgroundColor: '#18181B', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #3F3F46', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>{bai.tenBai}</h3>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <a href={bai.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Học bài ngay ➔</button>
                </a>
                {isAdmin && (
                  <button onClick={() => handleXoaBai(bai.id)} style={{ padding: '0.6rem 0.9rem', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ Xóa</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 2. Component xuất chính bọc trong Suspense
export default function KhoBaiGiangKhuVuc() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', color: '#E4E4E7' }}>Đang tải...</div>}>
      <KhoBaiGiangKhuVucContent />
    </Suspense>
  );
}