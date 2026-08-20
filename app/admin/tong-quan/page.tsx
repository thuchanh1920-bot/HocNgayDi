"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TongQuanAdmin() {
  const [students, setStudents] = useState<any[]>([]);
  const [examsMap, setExamsMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Tải danh sách đề thi để map ID sang Tên đề
        const examsRes = await fetch('/api/de-kiem-tra');
        const examsData = await examsRes.json();
        const map: Record<number, string> = {};
        if (Array.isArray(examsData)) {
          examsData.forEach((ex: any) => {
            map[ex.id] = ex.tenDe || `Đề ${ex.id}`;
          });
        }
        setExamsMap(map);

        // 2. Tải danh sách học sinh từ CSDL
        const studentsRes = await fetch('/api/hoc-sinh');
        const studentsData = await studentsRes.json();
        
        if (Array.isArray(studentsData)) {
          const allStudentScores = JSON.parse(localStorage.getItem('allStudentScores') || '{}');

          const formatted = studentsData.map((s: any) => {
            const studentScores = allStudentScores[s.email] || allStudentScores[s.fullName] || {};
            const completedCount = Object.keys(studentScores).length;

            return {
              id: s.id,
              fullName: s.fullName || s.email,
              khoi: s.khoi || '10',
              lop: s.lop || 'Chưa cập nhật',
              studyTime: completedCount > 0 ? `${completedCount * 15} phút` : '0 phút',
              scores: studentScores
            };
          });
          setStudents(formatted);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu tổng quan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteStudent = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản của học sinh "${name}" khỏi CSDL không?`)) return;

    try {
      const res = await fetch(`/api/hoc-sinh?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Đã xóa học sinh thành công!');
        // Tải lại trang sau khi xóa
        window.location.reload();
      } else {
        alert('Không thể xóa học sinh này.');
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', fontSize: '1.1rem' }}>Đang tải dữ liệu hệ thống...</div>;
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', color: '#18181B' }}>
      <button 
        onClick={() => router.push('/de-kiem-tra')}
        style={{ marginBottom: '1.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#E4E4E7', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#3F3F46' }}
      >
        ← Quay lại quản lý đề
      </button>

      <div style={{ backgroundColor: '#18181B', color: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#38BDF8', margin: 0, marginBottom: '0.5rem' }}>Quản Trị Hệ Thống — Danh Sách Học Sinh</h1>
        <p style={{ margin: 0, color: '#A1A1AA', fontSize: '1.05rem' }}>
          Theo dõi tiến độ, lớp, khối và kết quả thi theo tên đề thực tế của từng học sinh.
        </p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E4E4E7', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.9rem' }}>
              <th style={{ padding: '1rem' }}>STT</th>
              <th style={{ padding: '1rem' }}>Họ và Tên</th>
              <th style={{ padding: '1rem' }}>Lớp</th>
              <th style={{ padding: '1rem' }}>Khối Lớp</th>
              <th style={{ padding: '1rem' }}>Thời Gian Học</th>
              <th style={{ padding: '1rem' }}>Số Bài Đã Hoàn Thành</th>
              <th style={{ padding: '1rem' }}>Điểm Số Theo Tên Đề</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#71717A' }}>
                  Chưa có học sinh nào trong cơ sở dữ liệu.
                </td>
              </tr>
            ) : (
              students.map((student, index) => {
                const scoresObj = student.scores || {};
                const completedCount = Object.keys(scoresObj).length;

                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid #E2E8F0', fontSize: '0.95rem', color: '#334155' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{index + 1}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#2563EB' }}>{student.fullName}</td>
                    <td style={{ padding: '1rem' }}>{student.lop}</td>
                    <td style={{ padding: '1rem' }}>Khối {student.khoi}</td>
                    <td style={{ padding: '1rem', color: completedCount > 0 ? '#D97706' : '#71717A', fontWeight: '500' }}>
                      {student.studyTime}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ backgroundColor: completedCount > 0 ? '#EFF6FF' : '#F1F5F9', color: completedCount > 0 ? '#1D4ED8' : '#64748B', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {completedCount > 0 ? `${completedCount} đề` : 'Chưa làm bài'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flexDirection: 'column' }}>
                        {completedCount > 0 ? (
                          Object.entries(scoresObj).map(([examIdStr, sc]: [string, any]) => {
                            const examIdNum = Number(examIdStr);
                            const examTitle = examsMap[examIdNum] || `Đề số ${examIdStr}`;

                            return (
                              <span key={examIdStr} style={{ fontSize: '0.85rem', backgroundColor: Number(sc) >= 9 ? '#F0FDF4' : '#FEF2F2', color: Number(sc) >= 9 ? '#166534' : '#991B1B', padding: '0.3rem 0.6rem', borderRadius: '6px', border: `1px solid ${Number(sc) >= 9 ? '#BBF7D0' : '#FECACA'}`, width: 'fit-content' }}>
                                <strong>{examTitle}</strong>: {sc}đ
                              </span>
                            );
                          })
                        ) : (
                          <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Chưa có bài nộp</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteStudent(student.id, student.fullName)}
                        style={{ padding: '0.4rem 0.8rem', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}