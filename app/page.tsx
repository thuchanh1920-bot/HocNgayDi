"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user && user.email) {
      if (user.role === 'hoc-sinh' || !user.role) {
        router.push('/hoc-sinh/tong-quan');
      } else if (user.role === 'admin') {
        router.push('/admin/tong-quan');
      }
    }
  }, [router]);

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: 'calc(100vh - 60px)', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center', 
      fontFamily: 'sans-serif', 
      backgroundColor: '#09090B', 
      color: 'white',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      
      {/* Lớp nền chứa hình chữ P vàng in chìm */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/chu-p-bg.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.12, // Độ mờ in chìm
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Nội dung trang chủ */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#38BDF8', fontWeight: 'bold' }}>
          Chào mừng đến với Học Ngay Đi
        </h1>
        
        {/* Dòng thông báo thứ hai đã tăng cỡ chữ và đổi nội dung */}
        <p style={{ color: '#E4E4E7', fontSize: '1.4rem', fontWeight: '600', marginBottom: '2.5rem', lineHeight: '1.5' }}>
          HỆ THỐNG ÔN TẬP KIẾN THỨC TIN HỌC LỚP 10, 11, 12
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={() => router.push('/dang-nhap')}
            style={{ padding: '0.9rem 2rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}
          >
            Đăng Nhập
          </button>
          <button 
            onClick={() => router.push('/dang-ky')}
            style={{ padding: '0.9rem 2rem', backgroundColor: '#3F3F46', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}
          >
            Đăng Ký
          </button>
        </div>
      </div>
    </div>
  );
}