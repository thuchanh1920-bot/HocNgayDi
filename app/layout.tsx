import Navbar from '../components/Navbar'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#F8FAFC' }}>
        
        {/* Lớp chứa hình nền chữ P trải đều theo nội dung */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/chu-p-bg.png)',
          backgroundSize: 'contain',      // Đảm bảo ảnh luôn vừa khung hình
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,                   // Độ mờ "in chìm" rất nhẹ
          zIndex: -1,                     // Luôn nằm dưới cùng
          pointerEvents: 'none'           // Không cản trở việc click vào các nút
        }} />

        <Navbar />
        
        <main style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}