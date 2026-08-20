import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Lấy đúng tên các biến từ form gửi lên
    const { username, password, hoTen, khoi } = body;

    if (!username || !password || !hoTen) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 });
    }

    // Kiểm tra xem email / tên tài khoản đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email: username },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Tên tài khoản này đã được sử dụng.' }, { status: 400 });
    }

    // Tạo bản ghi mới khớp với schema hiện tại của bạn
    const newUser = await prisma.user.create({
      data: {
        email: username,    // Lưu giá trị username vào cột email trong database
        fullName: hoTen,    // Lưu giá trị họ tên vào cột fullName
        khoi: String(khoi), // Lưu khối lớp
        role: 'STUDENT',    // Phân quyền mặc định là học sinh
      },
    });

    return NextResponse.json({ message: 'Đăng ký thành công!', userId: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi đăng ký tài khoản.' }, { status: 500 });
  }
}