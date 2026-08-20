"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const fullName = localStorage.getItem('fullName');

    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch {
        setUserInfo({ fullName: fullName || 'Thành viên' });
      }
    } else if (fullName) {
      setUserInfo({ fullName: fullName });
    } else {
      setUserInfo(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userKhoi');
    localStorage.removeItem('userLop');
    setUserInfo(null);
    router.push('/dang-nhap');
  };

  // KIỂM TRA QUYỀN GIÁO VIÊN / ADMIN HOẶC TÀI KHOẢN QUẢN TRỊ
  const isTeacherOrAdmin = 
    userInfo?.role === 'teacher' || 
    userInfo?.role === 'admin' || 
    userInfo?.email?.includes('admin') || 
    userInfo?.email?.includes('gv') || 
    userInfo?.fullName?.toLowerCase().includes('quản trị');

  // PHÂN HƯỚNG LINK TỔNG QUAN LINH HOẠT
  const tongQuanLink = isTeacherOrAdmin ? "/admin/tong-quan" : "/hoc-sinh/tong-quan";

  // HÀM XỬ LÝ KHI BẤM VÀO KHO ĐỀ ÔN TẬP
  const handleKhoDeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isAuthenticated = !!currentUser.email || !!localStorage.getItem('fullName');

    if (isAuthenticated) {
      router.push('/hoc-sinh/de-kiem-tra');
    } else {
      alert('⚠️ Vui lòng đăng nhập tài khoản để truy cập Kho đề ôn tập.');
      router.push('/dang-nhap');
    }
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#18181B', color: 'white', alignItems: 'center', borderBottom: '1px solid #3F3F46' }}>
      
      {/* LOGO: HOA HƯỚNG DƯƠNG SÁT CHỮ XANH, BỎ DẤU ! */}
      <div 
        onClick={() => router.push('/')} 
        style={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
      >
        <span>🌻</span>
        <span style={{ color: '#38BDF8' }}>Học Ngay Đi</span>
        <span>🌻</span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href={tongQuanLink} style={{ color: '#E4E4E7', textDecoration: 'none', fontSize: '0.95rem' }}>
          Tổng quan
        </Link>
        
        <Link href="/kho-bai-giang" style={{ color: '#E4E4E7', textDecoration: 'none', fontSize: '0.95rem' }}>
          Kho bài giảng
        </Link>

        {!isTeacherOrAdmin && (
          <a 
            href="/hoc-sinh/de-kiem-tra" 
            onClick={handleKhoDeClick}
            style={{ color: '#E4E4E7', textDecoration: 'none', fontSize: '0.95rem', cursor: 'pointer' }}
          >
            Kho đề ôn tập
          </a>
        )}

        {isTeacherOrAdmin && (
          <Link href="/de-kiem-tra" style={{ color: '#38BDF8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>
            Quản lý đề (GV)
          </Link>
        )}

        {userInfo ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem' }}>
            <span style={{ color: '#4ADE80', fontWeight: 'bold', fontSize: '0.95rem' }}>
              👤 Chào, {userInfo.fullName || userInfo.email || 'Học sinh'}
            </span>
            <button 
              onClick={handleLogout}
              style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '1rem' }}>
            <Link href="/dang-ky" style={{ background: '#2563EB', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
              Đăng ký
            </Link>
            <Link href="/dang-nhap" style={{ background: '#FACC15', color: 'black', padding: '0.4rem 0.8rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}