// Error Boundary cho OAuth Authentication
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface AuthErrorBoundaryProps {
    children: React.ReactNode;
}

interface AuthErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class AuthErrorBoundary extends React.Component<
    AuthErrorBoundaryProps,
    AuthErrorBoundaryState
> {
    constructor(props: AuthErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('🚫 OAuth Authentication Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle size={18} />
                    <span className="text-sm">Lỗi xác thực</span>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="ml-2 text-red-600 hover:text-red-800"
                        title="Thử lại xác thực"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AuthErrorBoundary;
