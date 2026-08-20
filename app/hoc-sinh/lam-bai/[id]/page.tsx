"use client";
import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LamBaiKiemTRA({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const examId = parseInt(resolvedParams.id);
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showKey, setShowKey] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    fetch(`/api/de-kiem-tra/${examId}`)
      .then(res => res.json())
      .then(data => {
        const examData = data.exam || data;
        setExam(examData);
        setQuestions(data.questions || []);
        
        const totalMinutes = examData.thoiGian || 45;
        setTimeLeft(totalMinutes * 60);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải đề kiểm tra:", err);
        setLoading(false);
      });
  }, [examId]);

  const scrollToQuestion = (qId: number) => {
    const element = questionRefs.current[qId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = (isTimeOut = false) => {
    if (submitted) return;

    if (isTimeOut) {
      alert("⏰ Đã hết thời gian làm bài! Hệ thống sẽ tự động nộp bài của bạn.");
    } else {
      if (!confirm("Bạn có chắc chắn muốn nộp bài không?")) return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    let totalScore = 0;

    questions.forEach((q) => {
      const studentAns = answers[q.id];
      const qType = q.type || (typeof q.correctAnswer === 'string' && q.correctAnswer.startsWith('{') ? 'dung-sai' : 'mcq');

      if (qType === 'dung-sai') {
        let correctObj: any = {};
        try {
          correctObj = typeof q.correctAnswer === 'string' ? JSON.parse(q.correctAnswer) : q.correctAnswer;
        } catch {
          correctObj = {};
        }

        if (studentAns && typeof studentAns === 'object') {
          let correctSubCount = 0;
          ['a', 'b', 'c', 'd'].forEach(k => {
            if (correctObj[k] !== undefined && studentAns[k] === correctObj[k]) {
              correctSubCount++;
            }
          });

          let scoreForThisTFQuestion = 0;
          if (correctSubCount === 1) scoreForThisTFQuestion = 0.1;
          else if (correctSubCount === 2) scoreForThisTFQuestion = 0.25;
          else if (correctSubCount === 3) scoreForThisTFQuestion = 0.5;
          else if (correctSubCount === 4) scoreForThisTFQuestion = 1.0;

          totalScore += scoreForThisTFQuestion;
        }
      } else {
        const correctAns = q.correctAnswer || q.dapAnDung;
        if (studentAns && studentAns.toUpperCase() === String(correctAns).toUpperCase()) {
          totalScore += 0.5;
        }
      }
    });

    const finalScore = Number(totalScore.toFixed(2));
    setScore(finalScore);
    setSubmitted(true);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userEmail = currentUser.email || localStorage.getItem('fullName') || 'hoc_sinh_mac_dinh';

    // Lưu điểm cao nhất (giữ kỷ lục) thay vì ghi đè
    const allStudentScores = JSON.parse(localStorage.getItem('allStudentScores') || '{}');
    if (!allStudentScores[userEmail]) {
      allStudentScores[userEmail] = {};
    }
    
    const oldBestScore = allStudentScores[userEmail][examId] || 0;
    const bestScore = Math.max(oldBestScore, finalScore);

    allStudentScores[userEmail][examId] = bestScore;
    localStorage.setItem('allStudentScores', JSON.stringify(allStudentScores));
    localStorage.setItem('examScores', JSON.stringify(allStudentScores[userEmail]));
  };

  useEffect(() => {
    if (loading || submitted || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectMCQ = (questionId: number, optionKey: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSelectTF = (questionId: number, subKey: string, value: boolean) => {
    if (submitted) return;
    setAnswers(prev => {
      const currentQAns = prev[questionId] || { a: null, b: null, c: null, d: null };
      return {
        ...prev,
        [questionId]: { ...currentQAns, [subKey]: value }
      };
    });
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setShowKey(false);
    const totalMinutes = exam?.thoiGian || 45;
    setTimeLeft(totalMinutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isQuestionAnswered = (q: any) => {
    const ans = answers[q.id];
    if (!ans) return false;
    const qType = q.type || (typeof q.correctAnswer === 'string' && q.correctAnswer.startsWith('{') ? 'dung-sai' : 'mcq');
    if (qType === 'dung-sai') {
      return Object.values(ans).some(val => val !== null && val !== undefined);
    }
    return ans !== null && ans !== undefined && ans !== '';
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#E4E4E7' }}>Đang tải đề kiểm tra...</div>;
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', color: '#18181B', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      
      <div style={{ flex: 1, maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => router.push('/hoc-sinh/de-kiem-tra')}
            style={{ 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#FFF7ED', // Nền cam nhạt nhẹ nhàng, nổi bật
                    border: '2px solid #EA580C', // Viền cam đậm
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    color: '#C2410C', // Màu chữ cam đậm
                    fontSize: '1.1rem', // Tăng cỡ chữ lớn hơn
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  }}
>
  ← Quay lại danh sách đề
</button>

          {!submitted && (
            <div style={{ backgroundColor: '#18181B', color: '#FACC15', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              ⏳ Thời gian còn lại: <span style={{ color: timeLeft < 300 ? '#EF4444' : '#4ADE80' }}>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #E4E4E7', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h1 style={{ color: '#2563EB', marginTop: 0, marginBottom: '0.5rem' }}>{exam?.tenDe || 'Bài Kiểm Tra Trắc Nghiệm'}</h1>
          <p style={{ color: '#52525B', margin: 0 }}>Khối: {exam?.khoi || '10'} | Thời gian: {exam?.thoiGian || 45} phút | Tổng số câu: {questions.length}</p>
          
          {submitted && score !== null && (
            <div style={{ marginTop: '1.25rem', padding: '1.25rem', backgroundColor: score >= 9 ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${score >= 9 ? '#BBF7D0' : '#FECCA7'}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: score >= 9 ? '#166534' : '#991B1B', fontWeight: 'bold', fontSize: '1.1rem' }}>
                🎉 Kết quả của bạn: <span style={{ fontSize: '1.3rem' }}>{score} / 10 điểm</span> 
                {score >= 9 ? ' — Xuất sắc! Đã mở khóa bài tiếp theo.' : ' — Chưa đạt điều kiện mở khóa (Cần ≥ 9.0 điểm).'}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {score < 9 ? (
                  <button 
                    onClick={handleRetry}
                    style={{ padding: '0.6rem 1.2rem', backgroundColor: '#D97706', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}
                  >
                    🔄 Làm Lại Bài
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}
                  >
                    {showKey ? 'Ẩn Đáp Án Chi Tiết' : '📖 Xem Đáp Án Chi Tiết'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q, idx) => {
            const content = q.content || q.noiDung || '';
            const qType = q.type || (typeof q.correctAnswer === 'string' && q.correctAnswer.startsWith('{') ? 'dung-sai' : 'mcq');

            return (
              <div 
                key={q.id} 
                ref={el => { questionRefs.current[q.id] = el; }}
                style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <h3 style={{ color: '#2563EB', marginTop: 0, marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                  Câu {idx + 1} <span style={{ fontSize: '0.85rem', color: '#71717A' }}>({qType === 'dung-sai' ? 'Đúng / Sai (1đ)' : 'Trắc nghiệm (0.5đ)'})</span>: 
                  <span style={{ color: '#18181B', fontWeight: 'normal', display: 'block', marginTop: '0.25rem' }}>{content}</span>
                </h3>

                {qType === 'dung-sai' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    {['a', 'b', 'c', 'd'].map(k => {
                      const optionText = q[`option${k.toUpperCase()}`] || q[`dapAn${k.toUpperCase()}`];
                      if (!optionText) return null;
                      const cleanText = optionText.replace(/[\(\+\-]/g, '').trim();
                      const studentChoice = answers[q.id]?.[k];

                      let isCorrectTF = null;
                      if (submitted && showKey) {
                        try {
                          const parsed = typeof q.correctAnswer === 'string' ? JSON.parse(q.correctAnswer) : q.correctAnswer;
                          isCorrectTF = parsed?.[k];
                        } catch {}
                      }

                      return (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <div style={{ fontSize: '0.95rem', color: '#334155', flex: 1, paddingRight: '1rem' }}>
                            <strong style={{ color: '#D97706' }}>{k.toUpperCase()}.</strong> {cleanText}
                            {submitted && showKey && isCorrectTF !== null && (
                              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: isCorrectTF ? '#16A34A' : '#DC2626', marginTop: '0.2rem' }}>
                                Đáp án chuẩn: {isCorrectTF ? 'Đúng' : 'Sai'}
                              </span>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleSelectTF(q.id, k, true)}
                              style={{ 
                                padding: '0.4rem 0.9rem', 
                                borderRadius: '6px', 
                                border: '1px solid #16A34A', 
                                backgroundColor: studentChoice === true ? '#16A34A' : 'white', 
                                color: studentChoice === true ? 'white' : '#16A34A', 
                                fontWeight: 'bold', 
                                cursor: submitted ? 'default' : 'pointer' 
                              }}
                            >
                              Đúng
                            </button>
                            <button
                              onClick={() => handleSelectTF(q.id, k, false)}
                              style={{ 
                                padding: '0.4rem 0.9rem', 
                                borderRadius: '6px', 
                                border: '1px solid #DC2626', 
                                backgroundColor: studentChoice === false ? '#DC2626' : 'white', 
                                color: studentChoice === false ? 'white' : '#DC2626', 
                                fontWeight: 'bold', 
                                cursor: submitted ? 'default' : 'pointer' 
                              }}
                            >
                              Sai
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const optText = q[`option${opt}`] || q[`dapAn${opt}`];
                      if (!optText) return null;
                      const cleanOptText = optText.replace(/[\(\+\-]/g, '').trim();
                      const isSelected = answers[q.id] === opt;
                      
                      const correctVal = q.correctAnswer || q.dapAnDung || '';
                      const isTheCorrectOpt = correctVal.toUpperCase() === opt;

                      let borderColor = isSelected ? '#2563EB' : '#E2E8F0';
                      let bgColor = isSelected ? '#EFF6FF' : '#F8FAFC';
                      let textColor = isSelected ? '#1D4ED8' : '#334155';

                      if (submitted && showKey) {
                        if (isTheCorrectOpt) {
                          borderColor = '#16A34A';
                          bgColor = '#F0FDF4';
                          textColor = '#166534';
                        } else if (isSelected && !isTheCorrectOpt) {
                          borderColor = '#DC2626';
                          bgColor = '#FEF2F2';
                          textColor = '#991B1B';
                        }
                      }

                      return (
                        <div 
                          key={opt}
                          onClick={() => handleSelectMCQ(q.id, opt)}
                          style={{ 
                            padding: '0.75rem 1rem', 
                            borderRadius: '8px', 
                            border: `2px solid ${borderColor}`,
                            backgroundColor: bgColor,
                            cursor: submitted ? 'default' : 'pointer',
                            fontWeight: (isSelected || (submitted && showKey && isTheCorrectOpt)) ? 'bold' : 'normal',
                            color: textColor
                          }}
                        >
                          <strong style={{ marginRight: '0.5rem' }}>{opt}.</strong> {cleanOptText}
                          {submitted && showKey && isTheCorrectOpt && ' ✔ (Đáp án đúng)'}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted && questions.length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              onClick={() => handleSubmit(false)}
              style={{ padding: '0.9rem 2.5rem', backgroundColor: '#16A34A', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            >
              Nộp Bài & Xem Điểm 🚀
            </button>
          </div>
        )}
      </div>

      <div style={{ width: '260px', position: 'sticky', top: '2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '1rem', color: '#18181B', marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #E4E4E7', paddingBottom: '0.5rem' }}>
          📌 Danh sách câu hỏi
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {questions.map((q, idx) => {
            const answered = isQuestionAnswered(q);
            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                style={{
                  height: '38px',
                  borderRadius: '6px',
                  border: answered ? '1px solid #2563EB' : '1px solid #D1D5DB',
                  backgroundColor: answered ? '#2563EB' : '#F9FAFB',
                  color: answered ? 'white' : '#374151',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={`Câu ${idx + 1} (${answered ? 'Đã làm' : 'Chưa làm'})`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.85rem', color: '#6B7280', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid #E4E4E7', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '14px', height: '14px', backgroundColor: '#2563EB', borderRadius: '3px', display: 'inline-block' }}></span>
            <span>Đã trả lời</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '14px', height: '14px', backgroundColor: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '3px', display: 'inline-block' }}></span>
            <span>Chưa trả lời</span>
          </div>
        </div>

        {!submitted && questions.length > 0 && (
          <button 
            onClick={() => handleSubmit(false)}
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Nộp Bài
          </button>
        )}
      </div>

    </div>
  );
}