# TASK-001 Plan

Status: approved
Type: feature

## 1. Tóm tắt vấn đề

Cải thiện giao diện frontend của JustSerp Google Suite bằng cách tận dụng các thư viện React hỗ trợ UI, nhưng chỉ trong phạm vi nhỏ, dễ review. Hiện frontend đang dùng React/Vite/TypeScript với CSS tự viết, form endpoint động, selector endpoint và response viewer.

Vì task đang `status: new`, bước này chỉ lập plan, chưa sửa code.

## 2. File/function liên quan

- `frontend/package.json`
  - Kiểm tra dependency UI hiện có trước khi quyết định có cần thêm thư viện hay không.
- `frontend/src/pages/ExplorerPage.tsx`
  - Bố cục tổng thể: sidebar endpoint catalog, form request, response viewer.
- `frontend/src/components/EndpointSelector.tsx`
  - UI chọn endpoint theo group.
- `frontend/src/components/EndpointForm.tsx`
  - UI form params, required badge, checkbox, actions.
- `frontend/src/components/ResponseViewer.tsx`
  - UI trạng thái response, loading, error, JSON viewer.
- `frontend/src/App.css`
  - Styling chính của layout/panel/form/button.
- `frontend/src/index.css`
  - Theme variables, typography, background, dark mode.
- `frontend/src/components/EndpointForm.test.tsx`
  - Test render/form hiện có cần giữ pass sau khi đổi UI.

## 3. Hướng sửa từng bước

1. Kiểm tra dependency UI phù hợp với yêu cầu và repo hiện tại.
   - Ưu tiên thư viện nhẹ hỗ trợ UI React như icon library hoặc headless UI nếu thật sự cần.
   - Không thêm production dependency lớn nếu chưa có lý do rõ.
2. Cải thiện layout chính trong `ExplorerPage.tsx`.
   - Giữ flow hiện tại: chọn endpoint -> nhập params -> gửi request -> xem response.
   - Làm giao diện gọn hơn cho công cụ API explorer, ưu tiên khả năng scan nhanh.
3. Cải thiện `EndpointSelector`.
   - Nếu cần, thay select đơn giản bằng UI dễ scan hơn nhưng vẫn giữ grouped endpoints.
   - Không đổi contract props.
4. Cải thiện `EndpointForm`.
   - Làm rõ required fields, boolean controls, placeholder/default/example.
   - Giữ behavior `onValueChange`, `onReset`, `onSubmit` hiện tại.
5. Cải thiện `ResponseViewer`.
   - Làm rõ trạng thái idle/loading/error/success.
   - Giữ format JSON hiện tại, không đổi API response handling.
6. Cập nhật CSS trong `App.css` và `index.css`.
   - Giữ style hiện tại nhưng làm spacing, responsive, button/input states tốt hơn.
   - Tránh refactor lớn hoặc đổi theme quá rộng.
7. Chỉ sửa test nếu UI text/structure thay đổi làm test hiện tại không còn đúng.
   - Không mở rộng test ngoài phạm vi UI behavior bị ảnh hưởng.

## 4. Test/lint cần chạy

- `npm --prefix frontend run lint`
- `npm --prefix frontend run test`
- `npm --prefix frontend run build`
- Nếu cần kiểm tra full repo:
  - `npm run lint`
  - `npm run test`
  - `npm run build`

## 5. Rủi ro

- Thêm UI dependency production mới có thể làm bundle lớn hơn hoặc tăng maintenance.
- Đổi markup/component structure có thể làm test hiện tại fail.
- Cải thiện UI quá rộng có thể vượt phạm vi task nếu refactor layout/state logic.
- Nếu dùng component library mới, cần đảm bảo style không xung đột với CSS hiện tại và dark mode.
- Endpoint form được render động từ manifest, nên UI phải xử lý tốt nhiều loại param và text dài.
