"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TaoDeMoiPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tenDe: '',
    khoi: 'Khối 10',
    thoiGian: 45,
    soCau: 10,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/de-kiem-tra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenDe: formData.tenDe,
          khoi: formData.khoi,
          thoiGian: Number(formData.thoiGian) || 45,
          soCau: Number(formData.soCau) || 10,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        alert('Tạo đề kiểm tra thành công!');
        window.location.href = data.id ? `/de-kiem-tra/${data.id}` : '/de-kiem-tra';
      } else {
        alert(data.error || 'Không thể tạo đề kiểm tra.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert('Không thể kết nối tới máy chủ!');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto', color: '#E4E4E7' }}>
      <h1 style={{ fontSize: '2rem', color: '#38BDF8', marginBottom: '0.5rem' }}>Tạo Đề Kiểm Tra Mới</h1>
      <p style={{ color: '#A1A1AA', marginBottom: '2rem' }}>Thiết lập các thông số cơ bản cho bài kiểm tra trắc nghiệm.</p>

      <div style={{ backgroundColor: '#18181B', padding: '2rem', borderRadius: '12px', border: '1px solid #3F3F46' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tên đề kiểm tra</label>
            <input 
              type="text" 
              required 
              placeholder="VD: Đề ôn tập số 1..."
              value={formData.tenDe}
              onChange={e => setFormData({...formData, tenDe: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#27272A', border: '1px solid #3F3F46', color: 'white', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Dành cho Khối</label>
            <select 
              value={formData.khoi}
              onChange={e => setFormData({...formData, khoi: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#27272A', border: '1px solid #3F3F46', color: 'white', outline: 'none' }}>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>⏱ Thời gian làm bài (phút)</label>
              <input 
                type="number" 
                min="1" 
                required 
                value={formData.thoiGian}
                onChange={e => setFormData({...formData, thoiGian: parseInt(e.target.value) || 0})}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#27272A', border: '1px solid #3F3F46', color: 'white', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>📝 Số lượng câu hỏi</label>
              <input 
                type="number" 
                min="1" 
                required 
                value={formData.soCau}
                onChange={e => setFormData({...formData, soCau: parseInt(e.target.value) || 0})}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#27272A', border: '1px solid #3F3F46', color: 'white', outline: 'none' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            style={{ width: '100%', padding: '1rem', backgroundColor: '#2563EB', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}
          >
            {submitting ? '⏳ Đang lưu và chuyển hướng...' : 'Lưu Đề Kiểm Tra'}
          </button>
        </form>
      </div>
    </div>
  );
}