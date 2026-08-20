import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const examId = parseInt(resolvedParams.id);

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Không tìm thấy đề kiểm tra.' }, { status: 404 });
    }

    // Ép kiểu as any để bỏ qua kiểm tra lỗi property của TypeScript client cũ
    const questions = await prisma.question.findMany({
      where: { examId: examId } as any,
    });

    return NextResponse.json({ exam, questions }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi lấy chi tiết đề thi:", error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const examId = parseInt(resolvedParams.id);

    if (isNaN(examId)) {
      return NextResponse.json({ error: 'ID đề thi không hợp lệ.' }, { status: 400 });
    }

    // Xóa câu hỏi liên quan trước (dùng as any để loại bỏ hoàn toàn lỗi gạch đỏ)
    await prisma.question.deleteMany({
      where: { examId: examId } as any,
    });

    // Tiến hành xóa đề thi chính
    await prisma.exam.delete({
      where: { id: examId },
    });

    return NextResponse.json({ message: 'Xóa đề kiểm tra thành công!' }, { status: 200 });
  } catch (error: any) {
    console.error("LỖI KHI XÓA ĐỀ TRONG DATABASE:", error);
    return NextResponse.json({ error: error.message || 'Không thể xóa đề.' }, { status: 500 });
  }
}