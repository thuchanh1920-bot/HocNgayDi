"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function ChiTietDeVaQuanLyCauHoi({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const examId = parseInt(resolvedParams.id);
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State quản lý việc chỉnh sửa câu hỏi trực tiếp
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Tải dữ liệu đề thi và danh sách câu hỏi từ CSDL ngay khi vào trang
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/de-kiem-tra/${examId}`);
      const data = await res.json();
      setExam(data.exam || data);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  // Xử lý upload file Word (.docx) mới để bổ sung/thay thế câu hỏi
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('examId', examId.toString());

    try {
      const res = await fetch(`/api/cau-hoi/upload`, { 
        method: 'POST', 
        body: formData 
      });
      
      const data = await res.json();

      if (res.ok) { 
        alert(data.message || 'Import file Word thành công!'); 
        window.location.reload(); // Tải lại trang để hiện danh sách câu hỏi
      } else {
        alert(`Lỗi: ${data.error || 'Không xác định'}`);
      }
    } catch (err: any) {
      alert(`Lỗi kết nối máy chủ: ${err.message}`);
    }
  };

  // Lưu nội dung chỉnh sửa câu hỏi vào CSDL
  const handleSaveEdit = async (qId: number) => {
    try {
      const res = await fetch(`/api/cau-hoi/${qId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        alert('Cập nhật câu hỏi thành công!');
        setEditingId(null);
        fetchData(); // Load lại danh sách mới nhất
      } else {
        alert('Không thể cập nhật câu hỏi.');
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ.');
    }
  };

  // Xóa câu hỏi
  const handleDeleteQuestion = async (qId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) return;
    try {
      const res = await fetch(`/api/cau-hoi/${qId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Lỗi khi xóa câu hỏi.');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', fontSize: '1.1rem' }}>Đang tải dữ liệu chi tiết đề thi...</div>;
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1000px', margin: '0 auto', color: '#18181B' }}>
      {/* Nút quay về danh sách */}
      <button 
        onClick={() => router.push('/de-kiem-tra')}
        style={{ marginBottom: '1.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#E4E4E7', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#3F3F46' }}
      >
        ← Quay Về Danh Sách Đề Kiểm Tra
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: '#2563EB', margin: 0, marginBottom: '0.3rem' }}>Chi Tiết Đề: {exam?.tenDe || exam?.title}</h1>
          <p style={{ color: '#52525B', margin: 0 }}>Khối: {exam?.khoi} | Thời gian: {exam?.thoiGian} phút</p>
        </div>

        {/* Khu vực chọn file Word để cập nhật/thêm câu hỏi */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#2563EB', marginBottom: '0.3rem' }}>📂 Tải lên / Cập nhật từ file Word (.docx):</label>
          <input type="file" accept=".docx" onChange={handleFileUpload} style={{ fontSize: '0.9rem', cursor: 'pointer' }} />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #E4E4E7', marginBottom: '2rem' }} />

      {/* DANH SÁCH CÂU HỎI ĐÃ ĐƯỢC UPLOAD / LƯU TRỮ */}
      <h2 style={{ color: '#18181B', marginBottom: '1rem', fontSize: '1.25rem' }}>
        Danh Sách Câu Hỏi Hiện Có ({questions.length} câu)
      </h2>

      {questions.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', border: '1px solid #E4E4E7', textAlign: 'center', color: '#71717A' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Chưa có câu hỏi nào trong đề thi này.</p>
          <p style={{ fontSize: '0.9rem' }}>Hãy chọn file Word ở góc trên để hệ thống tự động bóc tách và hiển thị danh sách câu hỏi tại đây.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {questions.map((q, idx) => {
            const isEditing = editingId === q.id;
            
            // Xử lý lấy dữ liệu tương thích cả biến cũ và biến mới từ DB
            const questionText = q.content || q.noiDung || '';
            const qType = q.type || q.loaiCauHoi || 'mcq';
            const isTF = qType === 'dung-sai' || (typeof q.correctAnswer === 'string' && q.correctAnswer.includes('a:'));

            return (
              <div key={q.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E4E4E7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                
                {/* Header của câu hỏi */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#2563EB', fontSize: '1.05rem' }}>
                    Câu {idx + 1} ({isTF ? 'Đúng / Sai' : 'Trắc nghiệm nhiều lựa chọn'})
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!isEditing ? (
                      <>
                        <button 
                          onClick={() => { setEditingId(q.id); setEditForm({ ...q, noiDung: questionText }); }} 
                          style={{ padding: '0.35rem 0.85rem', backgroundColor: '#D97706', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                        >
                          ✏️ Sửa
                        </button>
                        <button 
                          onClick={() => handleDeleteQuestion(q.id)} 
                          style={{ padding: '0.35rem 0.85rem', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                        >
                          🗑️ Xóa
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleSaveEdit(q.id)} 
                          style={{ padding: '0.35rem 0.85rem', backgroundColor: '#16A34A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                        >
                          💾 Lưu lại
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          style={{ padding: '0.35rem 0.85rem', backgroundColor: '#71717A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                        >
                          ✖ Hủy
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Nội dung hiển thị thông thường hoặc form chỉnh sửa */}
                {!isEditing ? (
                  <>
                    <p style={{ color: '#18181B', fontWeight: '500', marginBottom: '1rem', fontSize: '1rem', lineHeight: '1.5' }}>
                      {questionText}
                    </p>

                    {/* Hiển thị các đáp án tương thích linh hoạt */}
                    {isTF ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px' }}>
                        {['a', 'b', 'c', 'd'].map(k => {
                          const ansText = q[`option${k.toUpperCase()}`] || q[`dapAn${k.toUpperCase()}`];
                          
                          // Đọc trạng thái đúng/sai từ correctAnswer hoặc dapAnDung
                          let isTrue = false;
                          try {
                            const parsed = typeof q.correctAnswer === 'string' ? JSON.parse(q.correctAnswer) : (q.correctAnswer || q.dapAnDung);
                            isTrue = parsed?.[k] || false;
                          } catch {
                            isTrue = false;
                          }

                          if (!ansText) return null;
                          return (
                            <div key={k} style={{ fontSize: '0.9rem', color: '#3F3F46' }}>
                              <strong style={{ color: '#D97706' }}>{k.toUpperCase()}.</strong> {ansText} — <span style={{ color: isTrue ? '#16A34A' : '#DC2626', fontWeight: 'bold' }}>{isTrue ? 'Đúng' : 'Sai'}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px' }}>
                        {['A', 'B', 'C', 'D'].map(opt => {
                          const optText = q[`option${opt}`] || q[`dapAn${opt}`];
                          const correctVal = q.correctAnswer || q.dapAnDung || '';
                          const isCorrect = correctVal.toUpperCase() === opt;

                          if (!optText) return null;
                          return (
                            <div key={opt} style={{ fontSize: '0.9rem', color: isCorrect ? '#16A34A' : '#3F3F46', fontWeight: isCorrect ? 'bold' : 'normal' }}>
                              <span style={{ color: '#2563EB' }}>{opt}.</span> {optText} {isCorrect && '✔ (Đáp án đúng)'}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  /* GIAO DIỆN CHỈNH SỬA TRỰC TIẾP (INLINE EDITING) */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Nội dung câu hỏi:</label>
                      <textarea 
                        value={editForm.noiDung || editForm.content || ''} 
                        onChange={e => setEditForm({...editForm, noiDung: e.target.value, content: e.target.value})}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                        rows={2}
                      />
                    </div>

                    {!isTF ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          {['A', 'B', 'C', 'D'].map(opt => (
                            <div key={opt}>
                              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Đáp án {opt}:</label>
                              <input 
                                value={editForm[`option${opt}`] || editForm[`dapAn${opt}`] || ''}
                                onChange={e => setEditForm({...editForm, [`option${opt}`]: e.target.value, [`dapAn${opt}`]: e.target.value})}
                                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                              />
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                          <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Đáp án đúng:</label>
                          <select 
                            value={editForm.correctAnswer || editForm.dapAnDung || 'A'}
                            onChange={e => setEditForm({...editForm, correctAnswer: e.target.value, dapAnDung: e.target.value})}
                            style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 'bold', color: '#16A34A' }}
                          >
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <p style={{ color: '#D97706', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>* Định dạng câu Đúng/Sai có thể chỉnh sửa nội dung văn bản ở trên hoặc upload lại file Word chuẩn.</p>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}