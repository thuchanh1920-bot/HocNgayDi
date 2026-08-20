"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DangKy() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Thêm state mật khẩu
  const [khoi, setKhoi] = useState('10');
  const [lop, setLop] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !lop) {
      alert('Vui lòng điền đầy đủ thông tin, bao gồm cả Mật khẩu và Lớp!');
      return;
    }

    try {
      const res = await fetch('/api/dang-ky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName, 
          email, 
          password, // Truyền thêm password xuống API
          khoi, 
          lop, 
          role: 'STUDENT' 
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('userKhoi', khoi);
        localStorage.setItem('userLop', lop);
        localStorage.setItem('userRole', 'STUDENT');

        alert('Đăng ký tài khoản thành công!');
        router.push('/hoc-sinh/de-kiem-tra');
      } else {
        alert(`Lỗi đăng ký: ${data.error || 'Email đã tồn tại!'}`);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert('Lỗi kết nối tới máy chủ.');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto', padding: '2.5rem', backgroundColor: '#18181B', borderRadius: '12px', color: 'white', border: '1px solid #3F3F46' }}>
      <h2 style={{ color: '#38BDF8', textAlign: 'center', marginBottom: '1.5rem' }}>Đăng Ký Tài Khoản Học Sinh</h2>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Họ và tên:</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)} 
            placeholder="Ví dụ: Nguyễn Văn A"
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #52525B', backgroundColor: '#27272A', color: 'white' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="name@example.com"
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #52525B', backgroundColor: '#27272A', color: 'white' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Mật khẩu:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #52525B', backgroundColor: '#27272A', color: 'white' }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Khối lớp:</label>
            <select 
              value={khoi} 
              onChange={e => setKhoi(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #52525B', backgroundColor: '#27272A', color: 'white' }}
            >
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Lớp:</label>
            <input 
              type="text" 
              value={lop} 
              onChange={e => setLop(e.target.value)} 
              placeholder="VD: 10A1"
              style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #52525B', backgroundColor: '#27272A', color: 'white' }}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          style={{ marginTop: '1rem', padding: '0.8rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
        >
          Đăng Ký Ngay
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#A1A1AA' }}>
        Đã có tài khoản? <Link href="/dang-nhap" style={{ color: '#FACC15', textDecoration: 'none', fontWeight: 'bold' }}>Đăng nhập</Link>
      </p>
    </div>
  );
}