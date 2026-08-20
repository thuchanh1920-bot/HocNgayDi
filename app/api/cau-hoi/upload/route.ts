import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const examIdStr = formData.get('examId') as string;

    if (!file || !examIdStr) {
      return NextResponse.json({ error: 'Thiếu file hoặc ID đề kiểm tra' }, { status: 400 });
    }

    const examId = parseInt(examIdStr);

    // Xóa sạch câu hỏi cũ của đề này trước khi import mới để tránh bị cộng dồn số lượng
    await prisma.question.deleteMany({
      where: { examId }
    } as any);

    const buffer = Buffer.from(await file.arrayBuffer());
    const { value: text } = await mammoth.extractRawText({ buffer });

    // Chia tách chính xác theo từ khóa "Câu 1", "Câu 2",... hoặc "Câu 1:", "Câu 1."
    const rawSegments = text.split(/Câ[uư]\s+\d+[\.:]?/gi).map(s => s.trim()).filter(s => s.length > 5);
    let countAdded = 0;

    for (const seg of rawSegments) {
      // Tách các dòng trong một câu hỏi
      const lines = seg.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length === 0) continue;

      // Dòng đầu tiên chính là nội dung câu hỏi
      const content = lines[0].trim();
      
      // Nhận diện câu Đúng/Sai nếu có chứa dấu (+) hoặc (-)
      const isTF = seg.includes('(+)') || seg.includes('(-)') || seg.toLowerCase().includes('đúng/sai');

      // Lấy các đáp án A, B, C, D từ các dòng tiếp theo
      const optionA = (lines[1] || 'A').replace(/^[aA][\.\)]\s*/, '').replace(/[\(\+\-]/g, '').trim();
      const optionB = (lines[2] || 'B').replace(/^[bB][\.\)]\s*/, '').replace(/[\(\+\-]/g, '').trim();
      const optionC = (lines[3] || 'C').replace(/^[cC][\.\)]\s*/, '').replace(/[\(\+\-]/g, '').trim();
      const optionD = (lines[4] || 'D').replace(/^[dD][\.\)]\s*/, '').replace(/[\(\+\-]/g, '').trim();

      if (isTF) {
        const tfAnswerObj = {
          a: lines[1]?.includes('(+)') || false,
          b: lines[2]?.includes('(+)') || false,
          c: lines[3]?.includes('(+)') || false,
          d: lines[4]?.includes('(+)') || false
        };

        await prisma.question.create({
          data: {
            examId,
            type: 'dung-sai',
            content: content || 'Câu hỏi Đúng/Sai',
            khoi: '10',
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer: JSON.stringify(tfAnswerObj),
            difficulty: 1
          } as any
        });
      } else {
        // Tự động tìm đáp án đúng (ví dụ: "(Đáp án đúng: B)", "Đáp án: C", hoặc ký hiệu "(A)")
        let correctAnswer = 'A';
        const matchAns = seg.match(/(?:đáp án đúng|đáp án|đúng)[\s:]*([A-D])/i) || seg.match(/\(([A-D])\)/i);
        if (matchAns && matchAns[1]) {
          correctAnswer = matchAns[1].toUpperCase();
        } else {
          // Dự phòng quét ký tự đáp án ở cuối dòng nếu có
          const lastLine = lines[lines.length - 1];
          const matchLast = lastLine.match(/([A-D])/);
          if (matchLast && lastLine.length < 15) {
            correctAnswer = matchLast[1].toUpperCase();
          }
        }

        await prisma.question.create({
          data: {
            examId,
            type: 'mcq',
            content: content || 'Nội dung câu hỏi',
            khoi: '10',
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            difficulty: 1
          } as any
        });
      }
      countAdded++;
    }

    if (countAdded === 0) {
      return NextResponse.json({ error: 'Không tìm thấy câu hỏi hợp lệ. Vui lòng kiểm tra định dạng file Word.' }, { status: 400 });
    }

    return NextResponse.json({ message: `Nhập thành công ${countAdded} câu hỏi!` });
  } catch (error: any) {
    console.error("LỖI XỬ LÝ:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}