import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Định nghĩa interface cho User
export interface User {
    id: number;
    username: string;
    email: string;
    token: string;
    role?: string;
    displayName?: string;
    photoUrl?: string;
}

// Định nghĩa interface cho AuthContext
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

// Tạo Context với giá trị mặc định
export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async () => { },
    loginWithGoogle: async () => { },
    logout: () => { },
    register: async () => { },
    resetPassword: async () => { },
});

// Props cho AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Kiểm tra người dùng đã đăng nhập chưa khi khởi chạy
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    // Kiểm tra token còn hiệu lực
                    // Trong thực tế sẽ có một API call để validate token
                    setUser(userData);
                }
            } catch (err) {
                console.error('Auth check error:', err);
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Đăng nhập bằng email và mật khẩu
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // Gọi API đăng nhập
            // Trong demo này, chúng ta giả lập API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đăng nhập thất bại');
            }

            const userData = await response.json();

            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Đăng nhập bằng Google
    const loginWithGoogle = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Thực tế sẽ mở popup OAuth hoặc chuyển hướng đến trang Google OAuth
            // Đây là một giả lập để demo
            const userData = {
                id: 1,
                username: 'googleuser',
                email: 'user@example.com',
                token: 'google-oauth-token',
                displayName: 'Google User',
                photoUrl: 'https://example.com/photo.jpg',
            };

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (err: any) {
            setError(err.message || 'Đăng nhập Google thất bại');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // Đăng ký
    const register = async (username: string, email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // Gọi API đăng ký
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đăng ký thất bại');
            }

            // Đăng nhập sau khi đăng ký thành công
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Đăng ký thất bại');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Quên mật khẩu
    const resetPassword = async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // Gọi API đặt lại mật khẩu
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đặt lại mật khẩu thất bại');
            }
        } catch (err: any) {
            setError(err.message || 'Đặt lại mật khẩu thất bại');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                error,
                login,
                loginWithGoogle,
                logout,
                register,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
