# 🛠️ Khắc phục lỗi ENOENT \_document.js

## 📋 Mô tả lỗi

```
ENOENT: no such file or directory, open '_document.js'
```

### 🔍 Nguyên nhân

1. **Next.js build system** đang tìm file `_document.js` nhưng project sử dụng TypeScript (`.tsx`)
2. **Cache bị corrupted** trong thư mục `.next/`
3. **Node.js processes** đang lock files, ngăn không cho cleanup

### 💡 Giải pháp đã áp dụng

#### ✅ Bước 1: Cài đặt rimraf cross-platform

```bash
npm install --save-dev rimraf
```

#### ✅ Bước 2: Dừng tất cả Node.js processes

```bash
taskkill /f /im node.exe
```

#### ✅ Bước 3: Cleanup cache với rimraf

```bash
npx rimraf .next
```

#### ✅ Bước 4: Restart development server

```bash
npm run dev
```

## 🚀 Kết quả

- ✅ **Server khởi động thành công**: `http://localhost:3000`
- ✅ **Next.js 14.2.30** ready in 4.9s
- ✅ **Không còn lỗi ENOENT**
- ⚠️ **Warning**: Lockfile missing swc dependencies (đã tự động patch)

## 🔧 Scripts đã cập nhật

```json
{
  "scripts": {
    "clean": "rimraf .next out node_modules\\.cache",
    "clean:all": "rimraf .next out node_modules && npm install",
    "reset": "rimraf .next && npm run dev",
    "build:clean": "rimraf .next && next build"
  }
}
```

## 📚 Giải thích kỹ thuật

### Tại sao lỗi ENOENT xảy ra?

1. **File extension mismatch**: Next.js đôi khi cache reference tới `.js` thay vì `.tsx`
2. **Corrupted build cache**: Thư mục `.next/` chứa metadata cũ không khớp với source code
3. **Process lock**: Node.js development server lock files, ngăn cleanup

### Tại sao rimraf hiệu quả?

1. **Cross-platform**: Hoạt động trên Windows, macOS, Linux
2. **Force delete**: Xóa được cả read-only files
3. **Recursive**: Xóa toàn bộ thư mục cùng subdirectories

### Cấu trúc file \_document.tsx

```tsx
// pages/_document.tsx (✅ ĐÚNG)
import { Html, Head, Main, NextScript } from "next/document";
import Document, { DocumentContext } from "next/document";

class MyDocument extends Document {
  // Custom document logic
}

export default MyDocument;
```

## 🚨 Lưu ý quan trọng

### Windows PowerShell

- Sử dụng `;` thay vì `&&` để nối lệnh
- Cần quotes cho paths có spaces: `"c:\path with spaces"`

### Development workflow

1. **Cleanup trước khi build**: `npm run clean`
2. **Reset nhanh**: `npm run reset`
3. **Full cleanup**: `npm run clean:all`

### Process management

```bash
# Windows - Kill node processes
taskkill /f /im node.exe

# macOS/Linux - Kill node processes
pkill -f node
```

## 🎯 Best practices

1. **Regular cleanup**: Chạy `npm run clean` khi gặp build issues
2. **Process management**: Kill processes trước khi cleanup
3. **Use npx**: `npx rimraf` thay vì global install
4. **Monitor lockfile**: Chạy `npm install` sau cleanup

## 📈 Tối ưu hóa

- **Automated cleanup**: Scripts tự động cleanup + restart
- **Error detection**: Batch files phát hiện lỗi thường gặp
- **Cross-platform**: Sử dụng rimraf thay vì rm/del
- **Documentation**: Ghi lại tất cả issues và solutions
