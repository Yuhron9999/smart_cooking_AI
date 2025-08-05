import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Clock,
    MessageCircle,
    Send,
    CheckCircle,
    User,
    Building,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Linkedin,
    AlertCircle,
    Info,
    Headphones,
    MessageSquare,
    FileText,
    Calendar,
    Zap,
    Heart,
    Star,
    Users,
    Award,
    TrendingUp
} from 'lucide-react';

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    company: string;
    subject: string;
    category: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    attachments?: File[];
    newsletter: boolean;
}

interface ContactMethod {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    value: string;
    availability: string;
    responseTime: string;
    color: string;
    action: string;
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    email: string;
    bio: string;
}

interface CompanyInfo {
    address: string;
    city: string;
    country: string;
    postal: string;
    phone: string;
    email: string;
    website: string;
    founded: string;
    employees: string;
}

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium',
        newsletter: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<ContactForm>>({});

    const contactMethods: ContactMethod[] = [
        {
            id: 'chat',
            title: 'Chat trực tiếp',
            description: 'Nhận hỗ trợ ngay lập tức từ đội ngũ chăm sóc khách hàng',
            icon: MessageCircle,
            value: 'Đang trực tuyến',
            availability: '24/7',
            responseTime: 'Tức thì',
            color: 'text-blue-500',
            action: 'Bắt đầu chat'
        },
        {
            id: 'email',
            title: 'Email hỗ trợ',
            description: 'Gửi email chi tiết về câu hỏi hoặc vấn đề của bạn',
            icon: Mail,
            value: 'support@smartcookingai.com',
            availability: 'Mọi lúc',
            responseTime: 'Trong 24h',
            color: 'text-orange-500',
            action: 'Gửi email'
        },
        {
            id: 'phone',
            title: 'Điện thoại',
            description: 'Gọi trực tiếp để được tư vấn và hỗ trợ nhanh chóng',
            icon: Phone,
            value: '1900 123 456',
            availability: '8:00 - 22:00',
            responseTime: 'Tức thì',
            color: 'text-green-500',
            action: 'Gọi ngay'
        },
        {
            id: 'location',
            title: 'Văn phòng',
            description: 'Đến trực tiếp văn phòng để được hỗ trợ tận tình',
            icon: MapPin,
            value: '123 Nguyễn Huệ, Q1, TP.HCM',
            availability: 'T2-T6: 9:00-18:00',
            responseTime: 'Tức thì',
            color: 'text-purple-500',
            action: 'Xem bản đồ'
        }
    ];

    const teamMembers: TeamMember[] = [
        {
            id: '1',
            name: 'Nguyễn Văn An',
            role: 'CEO & Founder',
            avatar: '/api/placeholder/80/80',
            email: 'an.nguyen@smartcookingai.com',
            bio: 'Chuyên gia về AI và ẩm thực với 10+ năm kinh nghiệm'
        },
        {
            id: '2',
            name: 'Trần Thị Bình',
            role: 'Head of Customer Success',
            avatar: '/api/placeholder/80/80',
            email: 'binh.tran@smartcookingai.com',
            bio: 'Chuyên gia chăm sóc khách hàng và phát triển sản phẩm'
        },
        {
            id: '3',
            name: 'Lê Minh Cường',
            role: 'Lead AI Engineer',
            avatar: '/api/placeholder/80/80',
            email: 'cuong.le@smartcookingai.com',
            bio: 'Kỹ sư AI hàng đầu chuyên về xử lý ngôn ngữ tự nhiên'
        },
        {
            id: '4',
            name: 'Phạm Thu Dung',
            role: 'Head of Marketing',
            avatar: '/api/placeholder/80/80',
            email: 'dung.pham@smartcookingai.com',
            bio: 'Chuyên gia marketing số và phát triển thương hiệu'
        }
    ];

    const companyInfo: CompanyInfo = {
        address: '123 Nguyễn Huệ, Phường Bến Nghé',
        city: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
        postal: '700000',
        phone: '+84 28 1234 5678',
        email: 'hello@smartcookingai.com',
        website: 'www.smartcookingai.com',
        founded: '2024',
        employees: '50+'
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name as keyof ContactForm]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ContactForm> = {};

        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Vui lòng nhập tiêu đề';
        if (!formData.message.trim()) newErrors.message = 'Vui lòng nhập nội dung';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            subject: '',
            category: 'general',
            message: '',
            priority: 'medium',
            newsletter: false
        });
        setIsSubmitted(false);
        setErrors({});
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'bg-gray-100 text-gray-800';
            case 'medium': return 'bg-blue-100 text-blue-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'urgent': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isSubmitted) {
        return (
            <div className="page-container min-h-screen bg-gray-50">
                <Head>
                    <title>Cảm ơn - Smart Cooking AI</title>
                </Head>

                <nav className="navbar bg-white border-b">
                    <div className="container-modern">
                        <div className="flex items-center justify-between py-4">
                            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span>Về trang chủ</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="max-w-2xl mx-auto p-4 py-20">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Cảm ơn bạn đã liên hệ!
                        </h1>

                        <p className="text-xl text-gray-600 mb-8">
                            Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <div className="flex items-start space-x-3">
                                <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div className="text-left">
                                    <h3 className="font-semibold text-blue-900 mb-2">Thông tin liên hệ của bạn:</h3>
                                    <ul className="space-y-1 text-sm text-blue-800">
                                        <li><strong>Họ tên:</strong> {formData.name}</li>
                                        <li><strong>Email:</strong> {formData.email}</li>
                                        <li><strong>Tiêu đề:</strong> {formData.subject}</li>
                                        <li><strong>Mức độ:</strong>
                                            <span className={`ml-2 inline-block px-2 py-1 rounded-full text-xs ${getPriorityColor(formData.priority)}`}>
                                                {formData.priority === 'low' ? 'Thấp' :
                                                    formData.priority === 'medium' ? 'Trung bình' :
                                                        formData.priority === 'high' ? 'Cao' : 'Khẩn cấp'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={resetForm}
                                className="btn-outline"
                            >
                                Gửi tin nhắn khác
                            </button>

                            <div className="text-center">
                                <Link href="/" className="btn-primary">
                                    Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container min-h-screen bg-gray-50">
            <Head>
                <title>Liên Hệ - Smart Cooking AI</title>
                <meta name="description" content="Liên hệ với đội ngũ Smart Cooking AI để được hỗ trợ và tư vấn" />
            </Head>

            {/* Header */}
            <nav className="navbar bg-white border-b">
                <div className="container-modern">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span>Về trang chủ</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="w-6 h-6 text-orange-500" />
                                <span className="text-xl font-bold gradient-text">Liên Hệ</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/help" className="btn-outline">
                                <FileText className="w-4 h-4 mr-2" />
                                Trợ giúp
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4">
                {/* Hero Section */}
                <div className="text-center py-12 mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-4">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại tin nhắn và chúng tôi sẽ phản hồi sớm nhất có thể.
                    </p>
                </div>

                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactMethods.map(method => (
                        <div key={method.id} className="card hover:shadow-lg transition-all duration-300 group">
                            <div className="p-6 text-center">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors`}>
                                    <method.icon className={`w-8 h-8 ${method.color} group-hover:text-orange-500 transition-colors`} />
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {method.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-4">
                                    {method.description}
                                </p>

                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                    <div className="font-medium text-gray-900">{method.value}</div>
                                    <div className="flex items-center justify-center space-x-4">
                                        <span className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {method.availability}
                                        </span>
                                        <span className="flex items-center">
                                            <Zap className="w-3 h-3 mr-1" />
                                            {method.responseTime}
                                        </span>
                                    </div>
                                </div>

                                <button className="btn-outline btn-sm w-full group-hover:btn-primary group-hover:text-white">
                                    {method.action}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="p-6">
                                <div className="flex items-center mb-6">
                                    <Send className="w-6 h-6 text-orange-500 mr-3" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Gửi tin nhắn</h2>
                                        <p className="text-gray-600">Điền thông tin dưới đây để gửi tin nhắn cho chúng tôi</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Họ và tên *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                                                placeholder="Nhập họ và tên của bạn"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                                                placeholder="email@example.com"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="0123 456 789"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Công ty/Tổ chức
                                            </label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="Tên công ty (tùy chọn)"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Danh mục
                                            </label>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                                Danh mục
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="input-field"
                                            >
                                                <option value="general">Câu hỏi chung</option>
                                                <option value="technical">Hỗ trợ kỹ thuật</option>
                                                <option value="billing">Thanh toán</option>
                                                <option value="feature">Yêu cầu tính năng</option>
                                                <option value="partnership">Hợp tác kinh doanh</option>
                                                <option value="press">Báo chí</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                                Mức độ ưu tiên
                                            </label>
                                            <select
                                                id="priority"
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                className="input-field"
                                            >
                                                <option value="low">Thấp</option>
                                                <option value="medium">Trung bình</option>
                                                <option value="high">Cao</option>
                                                <option value="urgent">Khẩn cấp</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tiêu đề *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.subject ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                                            placeholder="Tóm tắt ngắn gọn về vấn đề của bạn"
                                        />
                                        {errors.subject && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nội dung tin nhắn *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className={`input-field resize-none ${errors.message ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                                            placeholder="Vui lòng mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.message}
                                            </p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500">
                                            {formData.message.length}/1000 ký tự
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="newsletter"
                                            name="newsletter"
                                            checked={formData.newsletter}
                                            onChange={handleInputChange}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                                            Tôi muốn nhận tin tức và cập nhật về Smart Cooking AI qua email
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            * Các trường bắt buộc
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Gửi tin nhắn
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Company Info */}
                        <div className="card">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <Building className="w-6 h-6 text-orange-500 mr-3" />
                                    <h3 className="text-lg font-semibold text-gray-900">Thông tin công ty</h3>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">Địa chỉ</div>
                                            <div className="text-gray-600">
                                                {companyInfo.address}<br />
                                                {companyInfo.city}, {companyInfo.country}<br />
                                                {companyInfo.postal}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">Điện thoại</div>
                                            <div className="text-gray-600">{companyInfo.phone}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">Email</div>
                                            <div className="text-gray-600">{companyInfo.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">Website</div>
                                            <div className="text-gray-600">{companyInfo.website}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="card">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <Clock className="w-6 h-6 text-orange-500 mr-3" />
                                    <h3 className="text-lg font-semibold text-gray-900">Giờ làm việc</h3>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thứ 2 - Thứ 6:</span>
                                        <span className="font-medium text-gray-900">9:00 - 18:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thứ 7:</span>
                                        <span className="font-medium text-gray-900">9:00 - 15:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Chủ nhật:</span>
                                        <span className="font-medium text-gray-900">Nghỉ</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Hỗ trợ 24/7:</span>
                                            <span className="font-medium text-green-600">Chat & Email</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="card">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Theo dõi chúng tôi
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <a href="#" className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                                        <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Facebook</span>
                                    </a>

                                    <a href="#" className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                        <Twitter className="w-5 h-5 text-blue-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Twitter</span>
                                    </a>

                                    <a href="#" className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors">
                                        <Instagram className="w-5 h-5 text-pink-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Instagram</span>
                                    </a>

                                    <a href="#" className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                                        <Youtube className="w-5 h-5 text-red-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">YouTube</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="card">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Về Smart Cooking AI
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">Thành lập</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{companyInfo.founded}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">Nhân viên</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{companyInfo.employees}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">Đánh giá</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">4.8/5.0</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Heart className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">Người dùng</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">100K+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold gradient-text mb-4">
                            Đội ngũ của chúng tôi
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Gặp gỡ những người đằng sau Smart Cooking AI - những chuyên gia tận tâm tạo ra trải nghiệm nấu ăn tốt nhất cho bạn
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map(member => (
                            <div key={member.id} className="card hover:shadow-lg transition-all duration-300 text-center">
                                <div className="p-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <User className="w-10 h-10 text-orange-500" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {member.name}
                                    </h3>

                                    <p className="text-orange-600 font-medium text-sm mb-3">
                                        {member.role}
                                    </p>

                                    <p className="text-gray-600 text-sm mb-4">
                                        {member.bio}
                                    </p>

                                    <a
                                        href={`mailto:${member.email}`}
                                        className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700"
                                    >
                                        <Mail className="w-4 h-4 mr-1" />
                                        Liên hệ
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
