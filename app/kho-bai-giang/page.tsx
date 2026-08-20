"use client";
import { useRouter } from 'next/navigation';

export default function KhoBaiGiang() {
  const router = useRouter();

  const khoiList = [
    { 
      id: '10', 
      title: 'Tin học 10 - Kết nối tri thức với cuộc sống', 
      desc: 'Kiến thức nền tảng, mạng máy tính, thuật toán và dữ liệu số.' 
    },
    { 
      id: '11', 
      title: 'Tin học 11 - Kết nối tri thức với cuộc sống', 
      desc: 'Hệ quản trị cơ sở dữ liệu SQL, cấu trúc dữ liệu và mạng Internet.' 
    },
    { 
      id: '12', 
      title: 'Tin học 12 - Kết nối tri thức với cuộc sống', 
      desc: 'Thiết kế trang web HTML/CSS, định hướng nghề nghiệp CNTT.' 
    }
  ];

  return (
    <div style={{ padding: '3rem 2.5rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif', color: '#E4E4E7' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#38BDF8', marginBottom: '0.75rem' }}>Kho Bài Giảng Trực Tuyến</h1>
        <p style={{ color: '#A1A1AA', fontSize: '1.1rem' }}>Chọn khối lớp để xem danh sách bài học và video bài giảng chi tiết từ hệ thống.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {khoiList.map((item) => (
          <div 
            key={item.id} 
            style={{ 
              backgroundColor: '#18181B', 
              padding: '2rem', 
              borderRadius: '16px', 
              border: '1px solid #3F3F46', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}
          >
            <div>
              <span style={{ backgroundColor: '#0284C7', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Khối {item.id}
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'white', marginTop: '1.0rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                {item.title}
              </h3>
              <p style={{ color: '#A1A1AA', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
                {item.desc}
              </p>
            </div>

            <button 
              onClick={() => router.push(`/kho-bai-giang/khu-vuc?khoi=${item.id}`)}
              style={{ width: '100%', padding: '0.8rem', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Xem danh sách bài học ➔
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}