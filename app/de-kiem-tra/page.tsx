import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import ExamCard from '../components/ExamCard';

export const revalidate = 0; 

export default async function DanhSachDeKiemTra() {
  const danhSachDe = await prisma.exam.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div style={{ padding: '2.5rem', color: '#E4E4E7', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#38BDF8' }}>
            Quản Lý Đề Kiểm Tra (Quản trị viên)
          </h1>
          <p style={{ color: '#A1A1AA' }}>
            Tổng hợp các bài kiểm tra trắc nghiệm trong hệ thống.
          </p>
        </div>
        
        <Link href="/de-kiem-tra/them-moi" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
            + Tạo Đề Mới
          </button>
        </Link>
      </div>

      {/* Danh sách đề */}
      {danhSachDe.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#18181B', borderRadius: '12px', border: '1px dashed #3F3F46' }}>
          <p style={{ fontSize: '1.2rem', color: '#A1A1AA' }}>Chưa có đề kiểm tra nào được tạo.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {danhSachDe.map((de) => (
            <ExamCard key={de.id} de={de} />
          ))}
        </div>
      )}
    </div>
  );
}