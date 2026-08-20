import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, khoi, lop, role } = body;

    if (!fullName || !email || !password || !lop) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin!' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email này đã được sử dụng!' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password, // Lưu mật khẩu vào CSDL
        khoi: String(khoi || '10'),
        lop,
        role: role || 'STUDENT',
      },
    });

    return NextResponse.json({ message: 'Đăng ký thành công!', user: newUser });
  } catch (error: any) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ.' }, { status: 500 });
  }
}