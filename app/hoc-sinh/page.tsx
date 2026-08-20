"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HocSinhDashboard() {
  const [user, setUser] = useState({ fullName: '...', khoi: '...', lop: '...' });
  const [completedExams, setCompletedExams] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // 1. Lấy thông tin user đang đăng nhập từ localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const fullName = userData.fullName || localStorage.getItem('fullName') || 'Học sinh';
    const khoi = userData.khoi || localStorage.getItem('userKhoi') || '10';
    const lop = userData.lop || localStorage.getItem('userLop') || 'Chưa cập nhật';

    setUser({ fullName, khoi, lop });

    // 2. Lấy danh sách đề và điểm số riêng của học sinh này
    const allStudentScores = JSON.parse(localStorage.getItem('allStudentScores') || '{}');
    const myScores = allStudentScores[userData.email] || allStudentScores[fullName] || {};
    
    // Lấy thêm danh sách đề kiểm tra trong hệ thống
    const examsList = JSON.parse(localStorage.getItem('examsList') || '[]');

    let scoreSum = 0;
    const examsData = Object.entries(myScores).map(([examId, score]: [string, any]) => {
      scoreSum += Number(score || 0);
      const foundExam = examsList.find((ex: any) => String(ex.id) === String(examId));
      const examName = foundExam ? foundExam.tenDe : `Đề ôn tập số ${examId}`;

      return {
        id: examId,
        name: examName,
        score: Number(score || 0),
        timeSpent: 15 // Thời gian làm bài giả lập cho mỗi đề
      };
    });

    setCompletedExams(examsData);
    setTotalScore(scoreSum);
  }, []);

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Nút quay lại */}
      <button 
        onClick={() => router.push('/hoc-sinh/de-kiem-tra')}
        style={{ marginBottom: '1.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#E4E4E7', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#3F3F46' }}
      >
        ← Quay lại kho đề ôn tập
      </button>

      {/* Khung chào mừng cá nhân hóa chính xác */}
      <div style={{ backgroundColor: '#18181B', padding: '2rem', borderRadius: '12px', color: 'white', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, color: '#38BDF8', marginBottom: '0.5rem' }}>Trang Tổng Quan Học Tập</h1>
        <p style={{ fontSize: '1.2rem', margin: 0, color: '#E4E4E7' }}>
          Xin chào, <span style={{ fontWeight: 'bold', color: '#FACC15' }}>{user.fullName}</span> — Lớp {user.lop} (Khối {user.khoi}). 
          Chúc bạn một ngày học tập hiệu quả!
        </p>
      </div>

      {/* Thẻ thống kê tổng quan thực tế */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '0.5rem', marginTop: 0 }}>Đề Ôn Tập Đã Hoàn Thành</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#2563EB', margin: 0 }}>{completedExams.length} đề</p>
        </div>
        
        <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '0.5rem', marginTop: 0 }}>Tổng Điểm Tích Lũy</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#16A34A', margin: 0 }}>{totalScore.toFixed(1)} điểm</p>
        </div>
      </div>

      {/* Lịch sử và kết quả chi tiết từng bài đã làm */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#18181B', marginTop: 0, marginBottom: '1.5rem' }}>📚 Lịch Sử Đề Đã Hoàn Thành</h3>
        
        {completedExams.length === 0 ? (
          <p style={{ color: '#71717A', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0', margin: 0 }}>
            Bạn chưa hoàn thành bài kiểm tra nào. Hãy vào kho đề để bắt đầu làm bài nhé!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {completedExams.map((item, index) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ backgroundColor: '#2563EB', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {index + 1}
                  </span>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', color: '#1E293B', fontSize: '1rem' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>⏱️ Thời gian làm bài: {item.timeSpent} phút</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ backgroundColor: item.score >= 8 ? '#DCFCE7' : '#FEE2E2', color: item.score >= 8 ? '#166534' : '#991B1B', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Điểm: {item.score}đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}