import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    ArrowLeft,
    Sparkles,
    Users,
    Target,
    Award,
    ChefHat,
    Brain,
    Mic,
    Camera,
    Globe,
    Heart,
    Star,
    Rocket,
    Lightbulb,
    Calendar,
    User,
    Mail,
    Linkedin,
    Github,
    Twitter,
    CheckCircle,
    Building,
    Code,
    MessageCircle,
    FileText,
    Smartphone
} from 'lucide-react';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    bio: string;
    expertise: string[];
    social: {
        email?: string;
        linkedin?: string;
        github?: string;
        twitter?: string;
    };
    achievements: string[];
}

interface Milestone {
    year: string;
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

interface Value {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

interface Statistic {
    id: string;
    number: string;
    label: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<'story' | 'team' | 'values' | 'timeline'>('story');

    const teamMembers: TeamMember[] = [
        {
            id: '1',
            name: 'Nguyễn Văn An',
            role: 'CEO & Founder',
            avatar: '/api/placeholder/150/150',
            bio: 'Chuyên gia công nghệ với 12+ năm kinh nghiệm trong AI và Machine Learning. Tốt nghiệp thạc sĩ từ Stanford University.',
            expertise: ['AI Strategy', 'Product Vision', 'Team Leadership', 'Investor Relations'],
            social: {
                email: 'an.nguyen@smartcookingai.com',
                linkedin: '#',
                twitter: '#'
            },
            achievements: [
                'Forbes 30 Under 30 - Technology',
                'Google Developer Expert',
                'TEDx Speaker - AI in Culinary Arts'
            ]
        },
        {
            id: '2',
            name: 'Trần Thị Bình',
            role: 'Chief Technology Officer',
            avatar: '/api/placeholder/150/150',
            bio: 'Kỹ sư phần mềm hàng đầu chuyên về AI và xử lý ngôn ngữ tự nhiên. Cựu nhân viên Google AI.',
            expertise: ['Machine Learning', 'NLP', 'System Architecture', 'Technical Strategy'],
            social: {
                email: 'binh.tran@smartcookingai.com',
                linkedin: '#',
                github: '#'
            },
            achievements: [
                'Published 15+ AI Research Papers',
                'Google AI Residency Program',
                'IEEE Outstanding Engineer Award'
            ]
        },
        {
            id: '3',
            name: 'Lê Minh Cường',
            role: 'Head of AI Research',
            avatar: '/api/placeholder/150/150',
            bio: 'Tiến sĩ Khoa học Máy tính với chuyên môn sâu về Computer Vision và Speech Recognition.',
            expertise: ['Computer Vision', 'Speech Processing', 'Deep Learning', 'Research'],
            social: {
                email: 'cuong.le@smartcookingai.com',
                github: '#',
                linkedin: '#'
            },
            achievements: [
                'PhD Computer Science - MIT',
                'CVPR Best Paper Award',
                '50+ Patents in AI Technology'
            ]
        },
        {
            id: '4',
            name: 'Phạm Thu Dung',
            role: 'Head of Product Design',
            avatar: '/api/placeholder/150/150',
            bio: 'Chuyên gia UX/UI với đam mê tạo ra những trải nghiệm người dùng tuyệt vời và dễ sử dụng.',
            expertise: ['UX Design', 'UI Design', 'User Research', 'Design Systems'],
            social: {
                email: 'dung.pham@smartcookingai.com',
                linkedin: '#'
            },
            achievements: [
                'Awwwards Site of the Day',
                'Red Dot Design Award',
                'UX Designer of the Year 2023'
            ]
        },
        {
            id: '5',
            name: 'Hoàng Văn Em',
            role: 'VP of Engineering',
            avatar: '/api/placeholder/150/150',
            bio: 'Kỹ sư fullstack với kinh nghiệm xây dựng hệ thống quy mô lớn cho hàng triệu người dùng.',
            expertise: ['System Engineering', 'Cloud Architecture', 'DevOps', 'Team Management'],
            social: {
                email: 'em.hoang@smartcookingai.com',
                github: '#',
                linkedin: '#'
            },
            achievements: [
                'AWS Solutions Architect Expert',
                'Kubernetes Certified Administrator',
                'Built systems serving 10M+ users'
            ]
        },
        {
            id: '6',
            name: 'Ngô Thị Phương',
            role: 'Head of Marketing',
            avatar: '/api/placeholder/150/150',
            bio: 'Chuyên gia marketing số với 8+ năm kinh nghiệm xây dựng thương hiệu và phát triển cộng đồng.',
            expertise: ['Digital Marketing', 'Brand Strategy', 'Community Building', 'Content Strategy'],
            social: {
                email: 'phuong.ngo@smartcookingai.com',
                linkedin: '#',
                twitter: '#'
            },
            achievements: [
                'Marketing Excellence Award',
                'Built 500K+ community members',
                'Content Marketing Certified'
            ]
        }
    ];

    const milestones: Milestone[] = [
        {
            year: '2024',
            title: 'Khởi đầu Smart Cooking AI',
            description: 'Thành lập công ty với tầm nhìn cách mạng hóa cách thức nấu ăn thông qua AI',
            icon: Rocket,
            color: 'text-blue-500'
        },
        {
            year: '2024 Q2',
            title: 'Phát triển MVP',
            description: 'Ra mắt phiên bản beta với tính năng tạo công thức từ AI và nhận dạng hình ảnh',
            icon: Code,
            color: 'text-green-500'
        },
        {
            year: '2024 Q3',
            title: 'Tích hợp Voice AI',
            description: 'Thêm trợ lý giọng nói thông minh với khả năng hiểu tiếng Việt tự nhiên',
            icon: Mic,
            color: 'text-purple-500'
        },
        {
            year: '2024 Q4',
            title: 'Launch Official',
            description: 'Chính thức ra mắt với đầy đủ tính năng cho web và mobile',
            icon: Sparkles,
            color: 'text-orange-500'
        },
        {
            year: '2025 Q1',
            title: 'Mở rộng thị trường',
            description: 'Kế hoạch mở rộng ra các quốc gia Đông Nam Á',
            icon: Globe,
            color: 'text-pink-500'
        },
        {
            year: '2025 Q2',
            title: 'AI Nâng cao',
            description: 'Phát triển AI cá nhân hóa và hệ thống gợi ý thông minh',
            icon: Brain,
            color: 'text-cyan-500'
        }
    ];

    const values: Value[] = [
        {
            id: 'innovation',
            title: 'Đổi mới sáng tạo',
            description: 'Chúng tôi luôn tìm kiếm những cách thức mới để ứng dụng công nghệ AI vào ẩm thực một cách sáng tạo và hiệu quả.',
            icon: Lightbulb,
            color: 'text-yellow-500'
        },
        {
            id: 'user-first',
            title: 'Người dùng là trung tâm',
            description: 'Mọi quyết định và phát triển đều xuất phát từ nhu cầu thực tế và trải nghiệm của người dùng.',
            icon: Heart,
            color: 'text-red-500'
        },
        {
            id: 'quality',
            title: 'Chất lượng cao nhất',
            description: 'Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao nhất cho người dùng.',
            icon: Award,
            color: 'text-blue-500'
        },
        {
            id: 'accessibility',
            title: 'Dễ tiếp cận',
            description: 'Công nghệ AI nấu ăn phải dễ sử dụng và có thể tiếp cận được với mọi người, mọi trình độ.',
            icon: Users,
            color: 'text-green-500'
        },
        {
            id: 'sustainability',
            title: 'Bền vững',
            description: 'Hỗ trợ lối sống bền vững thông qua việc giảm lãng phí thực phẩm và sử dụng nguyên liệu hiệu quả.',
            icon: Globe,
            color: 'text-emerald-500'
        },
        {
            id: 'community',
            title: 'Cộng đồng',
            description: 'Xây dựng cộng đồng yêu thích nấu ăn, chia sẻ kiến thức và hỗ trợ lẫn nhau.',
            icon: Users,
            color: 'text-purple-500'
        }
    ];

    const statistics: Statistic[] = [
        {
            id: 'users',
            number: '100K+',
            label: 'Người dùng',
            description: 'Đang sử dụng platform hàng ngày',
            icon: Users,
            color: 'text-blue-500'
        },
        {
            id: 'recipes',
            number: '50K+',
            label: 'Công thức',
            description: 'Được tạo bởi AI và cộng đồng',
            icon: ChefHat,
            color: 'text-orange-500'
        },
        {
            id: 'interactions',
            number: '1M+',
            label: 'Tương tác AI',
            description: 'Chat, tạo công thức, nhận dạng ảnh',
            icon: MessageCircle,
            color: 'text-green-500'
        },
        {
            id: 'satisfaction',
            number: '4.8/5',
            label: 'Đánh giá',
            description: 'Mức độ hài lòng từ người dùng',
            icon: Star,
            color: 'text-yellow-500'
        },
        {
            id: 'countries',
            number: '15+',
            label: 'Quốc gia',
            description: 'Người dùng trên toàn thế giới',
            icon: Globe,
            color: 'text-purple-500'
        },
        {
            id: 'languages',
            number: '12+',
            label: 'Ngôn ngữ',
            description: 'Hỗ trợ đa ngôn ngữ toàn cầu',
            icon: MessageCircle,
            color: 'text-pink-500'
        }
    ];

    const features = [
        {
            icon: Brain,
            title: 'AI Thông minh',
            description: 'Sử dụng OpenAI GPT-4 và Google Gemini để tạo công thức và tư vấn nấu ăn'
        },
        {
            icon: Mic,
            title: 'Trợ lý Giọng nói',
            description: 'Tương tác bằng giọng nói tự nhiên với khả năng hiểu tiếng Việt'
        },
        {
            icon: Camera,
            title: 'Nhận dạng Hình ảnh',
            description: 'Quét ảnh món ăn để nhận công thức và thông tin dinh dưỡng'
        },
        {
            icon: Smartphone,
            title: 'Đa nền tảng',
            description: 'Sử dụng trên web, iOS, Android với đồng bộ dữ liệu liền mạch'
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'story':
                return (
                    <div className="space-y-12">
                        {/* Mission & Vision */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="card">
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        <Target className="w-8 h-8 text-orange-500 mr-4" />
                                        <h3 className="text-2xl font-bold text-gray-900">Sứ mệnh</h3>
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Chúng tôi cam kết cách mạng hóa cách thức nấu ăn thông qua công nghệ AI tiên tiến,
                                        giúp mọi người dễ dàng tạo ra những món ăn ngon, bổ dưỡng và phù hợp với sở thích cá nhân.
                                    </p>
                                </div>
                            </div>

                            <div className="card">
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        <Sparkles className="w-8 h-8 text-purple-500 mr-4" />
                                        <h3 className="text-2xl font-bold text-gray-900">Tầm nhìn</h3>
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Trở thành nền tảng AI nấu ăn hàng đầu thế giới, nơi mọi người có thể khám phá,
                                        học hỏi và chia sẻ đam mê ẩm thực một cách thông minh và sáng tạo.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Story */}
                        <div className="card">
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h3>
                                <div className="prose prose-lg max-w-none text-gray-600">
                                    <p className="mb-6">
                                        Smart Cooking AI được ra đời từ một câu hỏi đơn giản: <em>&quot;Làm sao để công nghệ AI có thể giúp mọi người nấu ăn ngon hơn?&quot;</em>
                                    </p>
                                    <p className="mb-6">
                                        Với kinh nghiệm nhiều năm trong lĩnh vực công nghệ và đam mê ẩm thực, đội ngũ sáng lập của chúng tôi
                                        nhận ra rằng việc nấu ăn không chỉ là kỹ năng mà còn là nghệ thuật. Tuy nhiên, không phải ai cũng có
                                        thời gian và kiến thức để trở thành một đầu bếp giỏi.
                                    </p>
                                    <p className="mb-6">
                                        Chúng tôi quyết định tạo ra một trợ lý AI thông minh có thể:
                                    </p>
                                    <ul className="list-disc list-inside mb-6 space-y-2">
                                        <li>Hiểu được nguyên liệu bạn có sẵn và tạo ra công thức phù hợp</li>
                                        <li>Nhận dạng món ăn qua hình ảnh và cung cấp công thức tương tự</li>
                                        <li>Tương tác bằng giọng nói tự nhiên trong quá trình nấu</li>
                                        <li>Học hỏi từ sở thích của bạn để đưa ra gợi ý cá nhân hóa</li>
                                    </ul>
                                    <p>
                                        Hành trình này không dễ dàng, nhưng với đam mê và quyết tâm, chúng tôi đã tạo ra một sản phẩm
                                        mà chúng tôi tin rằng sẽ thay đổi cách mọi người tiếp cận việc nấu ăn.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                                Tính năng nổi bật
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="card hover:shadow-lg transition-all duration-300 text-center">
                                        <div className="p-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <feature.icon className="w-8 h-8 text-orange-500" />
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                {feature.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'team':
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Đội ngũ chuyên gia
                            </h3>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                Chúng tôi là một nhóm các chuyên gia đam mê công nghệ và ẩm thực,
                                cùng nhau xây dựng tương lai của việc nấu ăn thông minh.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {teamMembers.map(member => (
                                <div key={member.id} className="card hover:shadow-lg transition-all duration-300">
                                    <div className="p-6">
                                        <div className="text-center mb-6">
                                            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <User className="w-12 h-12 text-orange-500" />
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-1">
                                                {member.name}
                                            </h4>
                                            <p className="text-orange-600 font-medium">
                                                {member.role}
                                            </p>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            {member.bio}
                                        </p>

                                        <div className="mb-4">
                                            <h5 className="text-sm font-semibold text-gray-900 mb-2">Chuyên môn:</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {member.expertise.map(skill => (
                                                    <span key={skill} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h5 className="text-sm font-semibold text-gray-900 mb-2">Thành tựu:</h5>
                                            <ul className="space-y-1">
                                                {member.achievements.map(achievement => (
                                                    <li key={achievement} className="flex items-start text-xs text-gray-600">
                                                        <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex items-center justify-center space-x-3 pt-4 border-t">
                                            {member.social.email && (
                                                <a
                                                    href={`mailto:${member.social.email}`}
                                                    className="text-gray-400 hover:text-orange-500 transition-colors"
                                                    title={`Email ${member.name}`}
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                            )}
                                            {member.social.linkedin && (
                                                <a
                                                    href={member.social.linkedin}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    title={`LinkedIn ${member.name}`}
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                            {member.social.github && (
                                                <a
                                                    href={member.social.github}
                                                    className="text-gray-400 hover:text-gray-900 transition-colors"
                                                    title={`GitHub ${member.name}`}
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {member.social.twitter && (
                                                <a
                                                    href={member.social.twitter}
                                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                                    title={`Twitter ${member.name}`}
                                                >
                                                    <Twitter className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'values':
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Giá trị cốt lõi
                            </h3>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                Những giá trị này định hướng mọi quyết định và hành động của chúng tôi
                                trong việc phát triển sản phẩm và phục vụ khách hàng.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {values.map(value => (
                                <div key={value.id} className="card hover:shadow-lg transition-all duration-300">
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mr-4`}>
                                                <value.icon className={`w-6 h-6 ${value.color}`} />
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {value.title}
                                            </h4>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'timeline':
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Hành trình phát triển
                            </h3>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                Từ ý tưởng ban đầu đến sản phẩm hoàn chỉnh, đây là câu chuyện về hành trình phát triển Smart Cooking AI.
                            </p>
                        </div>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <div key={milestone.year} className="relative flex items-start">
                                        {/* Timeline dot */}
                                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 mr-6`}>
                                            <milestone.icon className={`w-4 h-4 ${milestone.color}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 card">
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                        {milestone.title}
                                                    </h4>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700`}>
                                                        {milestone.year}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="page-container min-h-screen bg-gray-50">
            <Head>
                <title>Về Chúng Tôi - Smart Cooking AI</title>
                <meta name="description" content="Tìm hiểu về Smart Cooking AI - Hệ thống nấu ăn thông minh với AI, đội ngũ, sứ mệnh và giá trị cốt lõi" />
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
                                <Building className="w-6 h-6 text-orange-500" />
                                <span className="text-xl font-bold gradient-text">Về Chúng Tôi</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/contact" className="btn-outline">
                                <Mail className="w-4 h-4 mr-2" />
                                Liên hệ
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4">
                {/* Hero Section */}
                <div className="text-center py-12 mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-4">
                        Về Smart Cooking AI
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Chúng tôi đang cách mạng hóa cách thức nấu ăn thông qua công nghệ AI tiên tiến,
                        mang đến trải nghiệm nấu ăn thông minh và thú vị cho mọi người.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        {statistics.map(stat => (
                            <div key={stat.id} className="text-center">
                                <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gray-50 flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                                <div className="text-sm font-medium text-gray-700">{stat.label}</div>
                                <div className="text-xs text-gray-500">{stat.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border">
                        {[
                            { id: 'story', label: 'Câu chuyện', icon: FileText },
                            { id: 'team', label: 'Đội ngũ', icon: Users },
                            { id: 'values', label: 'Giá trị', icon: Heart },
                            { id: 'timeline', label: 'Hành trình', icon: Calendar }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[600px]">
                    {renderTabContent()}
                </div>

                {/* Call to Action */}
                <div className="text-center py-16">
                    <div className="card max-w-4xl mx-auto">
                        <div className="p-8">
                            <h2 className="text-3xl font-bold gradient-text mb-4">
                                Tham gia cùng chúng tôi
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Bắt đầu hành trình nấu ăn thông minh cùng Smart Cooking AI ngay hôm nay
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link href="/auth/register" className="btn-primary">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Đăng ký miễn phí
                                </Link>

                                <Link href="/contact" className="btn-outline">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Liên hệ với chúng tôi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
