"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || '';
    const name = localStorage.getItem('fullName') || localStorage.getItem('username') || '';
    if (role || name) {
      setIsLoggedIn(true);
      setUserRole(role);
      if (name) setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userKhoi');
    localStorage.removeItem('userLop');
    setIsLoggedIn(false);
    alert('Đã đăng xuất thành công!');
    window.location.href = '/';
  };

  // Nhận diện Quản trị viên dựa vào role hoặc tên hiển thị chứa chữ "Quản Trị" / "Admin" / "GV"
  const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin' || userName.toLowerCase().includes('quản trị') || userName.toLowerCase().includes('admin');

  // Điều hướng Tổng quan chuẩn xác
  const tongQuanLink = isTeacherOrAdmin ? "/admin/tong-quan" : "/hoc-sinh/tong-quan";

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', backgroundColor: '#18181B', borderBottom: '1px solid #27272A', fontSize: '1.05rem' }}>
      <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#E4E4E7' }}>
        EduAssess <span style={{ color: '#FACC15' }}>AI</span>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link href={tongQuanLink} style={{ color: '#FACC15', textDecoration: 'none', fontWeight: 'bold' }}>
          Tổng quan
        </Link>

        {isLoggedIn && !isTeacherOrAdmin && (
          <Link href="/hoc-sinh/de-kiem-tra" style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 'bold' }}>
            Đề kiểm tra của tôi
          </Link>
        )}

        {isTeacherOrAdmin && (
          <Link href="/de-kiem-tra" style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 'bold' }}>
            🛠 Quản lý đề (GV)
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isLoggedIn ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#E4E4E7', fontSize: '0.95rem' }}>
              👤 Chào, <strong style={{ color: '#FACC15' }}>{userName || 'Thành viên'}</strong>
            </span>
            <button 
              onClick={handleLogout}
              style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <Link href="/dang-ky" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: 'transparent', color: '#38BDF8', border: '1px solid #38BDF8', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Đăng ký</button>
            </Link>
            <Link href="/dang-nhap" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#FACC15', color: '#09090B', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Đăng nhập</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}