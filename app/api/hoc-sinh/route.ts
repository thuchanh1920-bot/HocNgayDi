import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Điều chỉnh đường dẫn tương đối tới lib/prisma cho đúng

export async function GET() {
  try {
    // Lấy danh sách học sinh từ CSDL (lọc theo role student nếu có, hoặc lấy toàn bộ user)
    const students = await prisma.user.findMany({
      where: {
        // Tùy theo bảng User trong Prisma của bạn, nếu có trường role thì lọc role: 'student'
        // Nếu không phân biệt role thì lấy toàn bộ hoặc điều kiện tương ứng
      } as any,
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(students);
  } catch (error: any) {
    console.error("Lỗi lấy danh sách học sinh:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID học sinh' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Xóa học sinh thành công!' });
  } catch (error: any) {
    console.error("Lỗi xóa học sinh:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}