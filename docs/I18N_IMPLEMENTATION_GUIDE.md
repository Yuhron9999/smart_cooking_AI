# Hướng Dẫn Tích Hợp Đa Ngôn Ngữ (i18n)

Tài liệu này cung cấp hướng dẫn tích hợp và sử dụng hệ thống đa ngôn ngữ (i18n) trong ứng dụng SmartCookingAI.

## 1. Cài đặt Thư viện

Cài đặt các thư viện cần thiết:

```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```

## 2. Cấu Trúc Thư Mục

```
src/
  ├── i18n/
  │    ├── i18n.ts             # File khởi tạo i18n
  │    ├── locales/
  │    │    ├── en/
  │    │    │    └── common.json    # File ngôn ngữ tiếng Anh
  │    │    └── vi/
  │    │         └── common.json    # File ngôn ngữ tiếng Việt
  └── providers/
       └── I18nProvider.tsx    # Provider để tích hợp i18n vào ứng dụng
```

## 3. Sử Dụng trong Component

### Import và hook useTranslation

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};
```

### Sử dụng với biến

```typescript
// Trong file JSON
// "welcomeUser": "Chào {{name}}, chào mừng bạn quay lại!"

// Trong component
<p>{t('welcomeUser', { name: user.name })}</p>
```

### Component chuyển đổi ngôn ngữ

Đã tạo sẵn component `LanguageSwitcher.tsx` để người dùng có thể chuyển đổi ngôn ngữ:

```typescript
import LanguageSwitcher from '../common/LanguageSwitcher';

// Sử dụng trong component
<LanguageSwitcher />
```

## 4. Tích Hợp Vào Ứng Dụng

### Thêm I18nProvider vào App

```typescript
// Trong _app.tsx hoặc App.tsx
import I18nProvider from '../providers/I18nProvider';

function MyApp({ Component, pageProps }) {
  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
```

## 5. Thêm Ngôn Ngữ Mới

1. Tạo thư mục mới trong `src/i18n/locales/` với mã ngôn ngữ (ví dụ: `fr/` cho tiếng Pháp)
2. Tạo file `common.json` trong thư mục đó với cấu trúc giống với file tiếng Anh và tiếng Việt
3. Cập nhật danh sách ngôn ngữ trong `LanguageSwitcher.tsx`:

```typescript
const languages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'fr', name: 'Français' }
];
```

4. Cập nhật file `i18n.ts` để thêm ngôn ngữ mới:

```typescript
import frCommon from './locales/fr/common.json';

i18n.init({
  resources: {
    en: { common: enCommon },
    vi: { common: viCommon },
    fr: { common: frCommon }
  },
  // ...
});
```

## 6. Một Số Lưu Ý

- Tất cả các chuỗi được hiển thị cho người dùng nên sử dụng hàm `t()` để hỗ trợ đa ngôn ngữ
- Sử dụng namespace (ví dụ: 'common') để tổ chức các chuỗi thành các nhóm hợp lý
- Các chuỗi trong file JSON nên được tổ chức theo cấu trúc phân cấp để dễ quản lý
- Ngôn ngữ được lưu trong localStorage để duy trì giữa các phiên

## 7. Tích Hợp với Backend

Backend cần hỗ trợ API để lấy và cập nhật ngôn ngữ ưu tiên của người dùng:

- `GET /api/users/{userId}/preferences/language` - Lấy ngôn ngữ ưu tiên
- `PUT /api/users/{userId}/preferences/language` - Cập nhật ngôn ngữ ưu tiên

## 8. Thêm Ngôn Ngữ Thông Qua API

Có thể mở rộng hệ thống để tải các file ngôn ngữ từ API thay vì tích hợp trực tiếp:

```typescript
i18n
  .use(Backend)
  .init({
    backend: {
      loadPath: '/api/locales/{{lng}}/{{ns}}.json',
    },
    // ...
  });
```
