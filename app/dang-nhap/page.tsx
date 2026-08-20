"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DangNhapPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Kiểm tra tài khoản Quản trị viên (Admin)
    if (username.trim() === 'admin' && password === 'adminnqdieu12@') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('username', 'admin');
      localStorage.setItem('fullName', 'Quản Trị Viên');
      localStorage.removeItem('userKhoi');
      
      alert('Đăng nhập thành công với quyền Quản trị viên!');
      router.push('/de-kiem-tra'); // Điều hướng chuẩn về trang Quản lý đề
      return;
    }

    // 2. Xác thực tài khoản Học sinh qua API cơ sở dữ liệu
    try {
      const res = await fetch('/api/auth/dang-nhap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userRole', data.role || 'STUDENT');
        localStorage.setItem('username', data.email);
        localStorage.setItem('fullName', data.fullName);
        localStorage.setItem('userKhoi', data.khoi || '10'); // Lưu khối lớp của học sinh

        alert(`Chào mừng học sinh ${data.fullName} (Khối ${data.khoi}) đã đăng nhập thành công!`);
        router.push('/hoc-sinh/de-kiem-tra'); // Điều hướng chuẩn vào danh sách đề ôn tập của học sinh
      } else {
        setError(data.error || 'Tên tài khoản hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ.');
    }
  };

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '450px', margin: '0 auto', color: '#E4E4E7' }}>
      <h1 style={{ color: '#38BDF8', marginBottom: '0.5rem', textAlign: 'center' }}>Đăng Nhập Hệ Thống</h1>
      <p style={{ color: '#A1A1AA', marginBottom: '2rem', textAlign: 'center' }}>Nhập thông tin tài khoản và mật khẩu của bạn.</p>
      
      <div style={{ backgroundColor: '#18181B', padding: '2rem', borderRadius: '12px', border: '1px solid #3F3F46' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tên tài khoản / Email</label>
            <input 
              type="text" 
              placeholder="Nhập tài khoản..." 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#27272A', border: '1px solid #3F3F46', color: 'white', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="Nhập mật khẩu..." 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#27272A', border: '1px solid #3F3F46', color: 'white', outline: 'none' }} 
            />
          </div>

          {error && <p style={{ color: '#EF4444', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

          <button 
            type="submit" 
            style={{ width: '100%', padding: '1rem', backgroundColor: '#FACC15', color: '#09090B', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            Đăng Nhập
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#A1A1AA', marginTop: '1rem' }}>
            Chưa có tài khoản học sinh? <Link href="/dang-ky" style={{ color: '#38BDF8', textDecoration: 'none' }}>Đăng ký ngay</Link>
          </p>
        </form>
      </div>
    </div>
  );
}