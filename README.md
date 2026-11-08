# Linh Đạo · Godot build test

Bản mẫu Godot 4.5.1 bằng GDScript để kiểm tra môi trường và quy trình xuất game. **Chưa phải bản chuyển đổi đầy đủ Linh Đạo 2.3.** Bản web và APK cũ không bị thay thế.

- Chọn 1–3 lá; mỗi lá gây 35 sát thương, boss có 300 HP.
- Giao diện tự co theo màn hình, dùng được chuột hoặc cảm ứng.
- Web: Compatibility / WebGL 2, một luồng.
- Android: APK ARM64, package riêng `vn.linhdao.godottest`, khóa debug dành cho bản thử.

## Build lại

Cần Python 3, Java 17 và Android SDK cho bản Android. Chạy `python3 scripts/build.py`; script tải Godot và templates đúng phiên bản, kiểm tra SHA-512 chính thức, kiểm tra scene rồi xuất Web/APK. Không cần đăng nhập Godot.

Có thể chỉ định `GODOT_TOOLS`, `ANDROID_HOME`, `JAVA_HOME` khi dùng bộ công cụ đã cài. Kết quả trong `build/`. Không đưa khóa ký, thông tin đăng nhập hoặc bộ công cụ vào Git.

Workflow GitHub Actions chạy khi push hoặc chạy thủ công; tải bản thử tại mục Actions → workflow thành công → Artifacts. Máy build tạm thời có thể được dựng lại từ script, không phụ thuộc một phiên chat tồn tại mãi.

## Giấy phép engine

Godot Engine dùng MIT License: https://godotengine.org/license/. Mã nguồn demo thuộc dự án của chủ repository.
