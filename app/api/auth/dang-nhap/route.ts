import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Tên tài khoản không tồn tại trong hệ thống.' }, { status: 400 });
    }

    // Trả về thông tin kèm theo khối lớp của học sinh
    return NextResponse.json({ 
      message: 'Đăng nhập thành công', 
      email: user.email,
      fullName: user.fullName,
      khoi: user.khoi || '10', // Mặc định khối 10 nếu chưa cập nhật
      role: user.role 
    }, { status: 200 });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi đăng nhập.' }, { status: 500 });
  }
}