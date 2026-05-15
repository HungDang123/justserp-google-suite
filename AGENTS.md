# Codex Project Rules

## Workflow
- Luôn đọc `.codex-tasks/inbox.md` trước.
- **Auto accept**: Nếu task ghi `auto_accept: true` (hoặc user nói rõ auto accept / không cần chờ duyệt), sau khi ghi plan vào `.codex-tasks/plans/<TASK_ID>.md` được **code luôn** trong cùng phiên — không dừng ở bước chỉ plan. Nếu **không** có auto accept, giữ quy tắc cũ: `status: new` → chỉ lập plan; `status: approved` → mới code.
- Không tự commit, push, deploy.
- Không sửa `.env`, secret, credential.
- Không refactor lớn nếu task không yêu cầu.

## Plan rule
Plan phải được ghi vào `.codex-tasks/plans/<TASK_ID>.md`, gồm:
1. Tóm tắt vấn đề
2. File/function liên quan
3. Hướng sửa từng bước
4. Test/lint cần chạy
5. Rủi ro

## Coding rule
- Chỉ sửa đúng phạm vi plan.
- Ưu tiên thay đổi nhỏ, dễ review.
- Giữ style code hiện tại.
- Nếu không chắc nghiệp vụ, ghi rõ điểm chưa chắc.

## Khi làm xong (bắt buộc)
Luôn chạy lại từ thư mục gốc `justserp-google-suite` trước khi kết thúc task:

```bash
npm run lint
npm run test
npm run build
```

Nếu task chỉ đụng một phần (ví dụ chỉ backend), vẫn ưu tiên chạy đủ ba lệnh trên để đảm bảo frontend + backend còn build/test được.
