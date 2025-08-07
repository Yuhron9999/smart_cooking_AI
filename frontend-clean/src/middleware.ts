import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware cho việc tích hợp SpringBoot
 * 
 * Middleware này chạy trước mỗi request đến Next.js server và 
 * có thể chuyển tiếp request đến Spring Boot server.
 * 
 * @param {NextRequest} request - Request từ client
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Chuyển tiếp các API request đến Spring Boot server
  if (pathname.startsWith('/api/')) {
    const springBootUrl = process.env.SPRING_BOOT_URL || 'http://localhost:8080';
    const url = new URL(pathname, springBootUrl);
    
    // Thêm các query params từ request gốc
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Tạo headers mới cho request đến Spring Boot
    const headers = new Headers(request.headers);
    
    // Đảm bảo Spring Boot biết request từ đâu
    headers.set('X-Forwarded-For', request.ip || '');
    headers.set('X-Forwarded-Host', request.headers.get('host') || '');
    headers.set('X-Forwarded-Proto', request.headers.get('x-forwarded-proto') || 'http');

    // Chuyển tiếp request đến Spring Boot server với cùng method và body
    return NextResponse.rewrite(url, {
      request: {
        headers
      }
    });
  }

  // Chuyển tiếp các mobile API đến Flutter API endpoint
  if (pathname.startsWith('/mobile-api/')) {
    const flutterApiUrl = process.env.FLUTTER_API_URL || 'http://localhost:8082';
    const url = new URL(pathname.replace('/mobile-api', ''), flutterApiUrl);
    
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    return NextResponse.rewrite(url);
  }

  // Xử lý các request không phải API (trang HTML, assets, v.v.)
  return NextResponse.next();
}

/**
 * Cấu hình các đường dẫn mà middleware sẽ chạy
 */
export const config = {
  matcher: [
    '/api/:path*',
    '/mobile-api/:path*'
  ],
};
