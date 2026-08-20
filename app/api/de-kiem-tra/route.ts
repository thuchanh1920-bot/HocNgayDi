import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const khoiParam = searchParams.get('khoi');

    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (!khoiParam) {
      return NextResponse.json(exams, { status: 200 });
    }

    const cleanParam = String(khoiParam).replace(/khối/gi, '').trim();
    const filteredExams = exams.filter((de: any) => {
      const deKhoiClean = String(de.khoi).replace(/khối/gi, '').trim();
      return deKhoiClean === cleanParam;
    });

    return NextResponse.json(filteredExams, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách đề:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { tenDe, khoi, thoiGian, soCau } = body;

    if (!tenDe || !khoi) {
      return NextResponse.json({ error: 'Tên đề và khối là bắt buộc.' }, { status: 400 });
    }

    // Chuẩn hóa giá trị khối lưu vào CSDL (ví dụ: chuyển "Khối 12" thành "12" hoặc giữ nguyên tùy ý)
    const cleanKhoi = String(khoi).replace(/khối/gi, '').trim();

    const newExam = await prisma.exam.create({
      data: {
        tenDe: String(tenDe),
        khoi: cleanKhoi,
        thoiGian: Number(thoiGian) || 45,
        soCau: Number(soCau) || 10,
      },
    });

    return NextResponse.json({ id: newExam.id, message: 'Tạo đề thành công!' }, { status: 201 });
  } catch (error: any) {
    console.error("LỖI KHI TẠO ĐỀ TRONG DATABASE:", error);
    return NextResponse.json({ error: error.message || 'Không thể tạo đề kiểm tra.' }, { status: 500 });
  }
}