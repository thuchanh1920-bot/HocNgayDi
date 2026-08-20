"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import thêm useRouter để điều hướng bảo mật

interface Exam {
  id: number;
  tenDe: string;
  khoi: string;
  thoiGian?: number;
  soCau?: number;
}

export default function DanhSachDeHocSinh() {
  const router = useRouter();
  const [hocSinh, setHocSinh] = useState<{ fullName: string; khoi: string } | null>(null);
  const [danhSachDe, setDanhSachDe] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [diemSoCuaToi, setDiemSoCuaToi] = useState<Record<number, number>>({});

  useEffect(() => {
    // 1. KIỂM TRA BẢO MẬT: Nếu chưa đăng nhập hoặc đã đăng xuất, chuyển hướng ngay về trang đăng nhập
    const userStr = localStorage.getItem('user');
    const fullNameStr = localStorage.getItem('fullName');

    if (!userStr && !fullNameStr) {
      router.push('/dang-nhap');
      return;
    }

    const userKhoi = localStorage.getItem('userKhoi') || '10';
    const userFullName = fullNameStr || JSON.parse(userStr || '{}').fullName || 'Học sinh';
    setHocSinh({ fullName: userFullName, khoi: userKhoi });

    // Lấy điểm cao nhất của học sinh từ kho lưu trữ tổng hoặc examScores
    const currentUser = JSON.parse(userStr || '{}');
    const userEmail = currentUser.email || userFullName || 'hoc_sinh_mac_dinh';
    const allStudentScores = JSON.parse(localStorage.getItem('allStudentScores') || '{}');
    const scoresForUser = allStudentScores[userEmail] || JSON.parse(localStorage.getItem('examScores') || '{}');
    
    setDiemSoCuaToi(scoresForUser);

    const cleanKhoi = String(userKhoi).replace(/khối/gi, '').trim();

    fetch(`/api/de-kiem-tra?khoi=${cleanKhoi}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDanhSachDe(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải đề:", err);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#E4E4E7', backgroundColor: '#18181B', minHeight: '100vh' }}>Đang tải danh sách bài kiểm tra...</div>;
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1000px', margin: '0 auto', color: '#E4E4E7' }}>
      <div style={{ backgroundColor: '#18181B', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #3F3F46', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#38BDF8', marginBottom: '0.25rem' }}>Kho Đề Ôn Tập Trực Tuyến</h1>
        <p style={{ color: '#A1A1AA', margin: 0 }}>
          Xin chào <strong style={{ color: 'white' }}>{hocSinh?.fullName}</strong> — Khối <span style={{ color: '#FACC15' }}>{hocSinh?.khoi}</span>. 
          <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.9rem', color: '#34D399' }}>ℹ️ Điều kiện mở khóa: Cần đạt từ 9.0 điểm trở lên ở bài trước để mở bài tiếp theo.</span>
        </p>
      </div>

      {danhSachDe.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#18181B', borderRadius: '12px', border: '1px dashed #3F3F46' }}>
          <p style={{ fontSize: '1.1rem', color: '#A1A1AA' }}>Chưa có đề ôn tập nào được phân bổ cho khối của bạn.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {danhSachDe.map((de, index) => {
            const tenHienThi = `Đề ôn tập số ${index + 1}`;
            
            // Logic kiểm tra mở khóa: Bài đầu mở, các bài sau yêu cầu bài ngay trước đó phải đạt >= 9.0 điểm kỷ lục
            let isUnlocked = true;
            if (index > 0) {
              for (let i = 0; i < index; i++) {
                const prevScore = diemSoCuaToi[danhSachDe[i].id] || 0;
                if (prevScore < 9.0) {
                  isUnlocked = false;
                  break;
                }
              }
            }

            const diemHienTai = diemSoCuaToi[de.id];

            return (
              <div key={de.id} style={{ backgroundColor: '#18181B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #3F3F46', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: isUnlocked ? 1 : 0.6 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ backgroundColor: '#0284C7', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      Khối {de.khoi}
                    </span>
                    {diemHienTai !== undefined && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: diemHienTai >= 9 ? '#34D399' : '#F87171' }}>
                        Điểm cao nhất: {diemHienTai}/10
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'white', margin: '0 0 0.5rem 0' }}>{tenHienThi}</h3>
                  <p style={{ color: '#A1A1AA', fontSize: '0.9rem', margin: '0 0 1.25rem 0' }}>
                    ⏱ Thời gian: {de.thoiGian || 45} phút | 📝 Số câu: {de.soCau || 'N/A'}
                  </p>
                </div>

                {isUnlocked ? (
                  <Link href={`/hoc-sinh/lam-bai/${de.id}`} style={{ textDecoration: 'none' }}>
                    <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Bắt Đầu Làm Bài ➔
                    </button>
                  </Link>
                ) : (
                  <button disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: '#3F3F46', color: '#9CA3AF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'not-allowed' }}>
                    🔒 Cần đạt ≥ 9.0 điểm bài trước để mở
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}