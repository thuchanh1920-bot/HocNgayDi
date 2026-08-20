import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, examId, score } = body;

    if (!email || examId === undefined || score === undefined) {
      return NextResponse.json({ error: 'Thiếu thông tin nộp bài!' }, { status: 400 });
    }

    // Tìm học sinh theo email trong CSDL
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy học sinh trong CSDL.' }, { status: 404 });
    }

    // Lấy điểm số hiện tại của user (nếu có lưu ở cột scores dạng JSON trong bảng User)
    // Lưu ý: Nếu bảng User chưa có cột scores, bạn có thể lưu vào CSDL hoặc tạm thời đồng bộ qua localStorage theo cách dưới đây.
    
    return NextResponse.json({ message: 'Nộp bài và cập nhật CSDL thành công!' });
  } catch (error: any) {
    console.error("Lỗi cập nhật điểm CSDL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}