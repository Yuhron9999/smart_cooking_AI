import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _selectedLanguage = 'vi';
  bool _notificationsEnabled = true;
  bool _darkModeEnabled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('⚙️ Cài đặt')),
      body: ListView(
        children: [
          // Language Settings
          ListTile(
            leading: const Icon(Icons.language),
            title: const Text('Ngôn ngữ'),
            subtitle: Text(_getLanguageName(_selectedLanguage)),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: _showLanguageSelector,
          ),

          // Notifications
          SwitchListTile(
            secondary: const Icon(Icons.notifications),
            title: const Text('Thông báo'),
            subtitle: const Text('Nhận thông báo về công thức mới'),
            value: _notificationsEnabled,
            onChanged: (bool value) {
              setState(() {
                _notificationsEnabled = value;
              });
            },
          ),

          // Dark Mode
          SwitchListTile(
            secondary: const Icon(Icons.dark_mode),
            title: const Text('Chế độ tối'),
            subtitle: const Text('Sử dụng giao diện tối'),
            value: _darkModeEnabled,
            onChanged: (bool value) {
              setState(() {
                _darkModeEnabled = value;
              });
            },
          ),

          const Divider(),

          // About Section
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text('Về ứng dụng'),
            subtitle: const Text('Smart Cooking AI v1.0.0'),
            onTap: _showAboutDialog,
          ),

          // API Status
          ListTile(
            leading: const Icon(Icons.api),
            title: const Text('Trạng thái API'),
            subtitle: const Text('Kiểm tra kết nối dịch vụ'),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: _showApiStatus,
          ),

          // Help & Support
          ListTile(
            leading: const Icon(Icons.help),
            title: const Text('Trợ giúp & Hỗ trợ'),
            subtitle: const Text('Hướng dẫn sử dụng và liên hệ'),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: _showHelpDialog,
          ),
        ],
      ),
    );
  }

  String _getLanguageName(String code) {
    switch (code) {
      case 'vi':
        return '🇻🇳 Tiếng Việt';
      case 'en':
        return '🇺🇸 English';
      case 'ja':
        return '🇯🇵 日本語';
      default:
        return '🇻🇳 Tiếng Việt';
    }
  }

  void _showLanguageSelector() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Chọn ngôn ngữ'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<String>(
              title: const Text('🇻🇳 Tiếng Việt'),
              value: 'vi',
              groupValue: _selectedLanguage,
              onChanged: (value) {
                setState(() {
                  _selectedLanguage = value!;
                });
                Navigator.pop(context);
              },
            ),
            RadioListTile<String>(
              title: const Text('🇺🇸 English'),
              value: 'en',
              groupValue: _selectedLanguage,
              onChanged: (value) {
                setState(() {
                  _selectedLanguage = value!;
                });
                Navigator.pop(context);
              },
            ),
            RadioListTile<String>(
              title: const Text('🇯🇵 日本語'),
              value: 'ja',
              groupValue: _selectedLanguage,
              onChanged: (value) {
                setState(() {
                  _selectedLanguage = value!;
                });
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAboutDialog() {
    showAboutDialog(
      context: context,
      applicationName: 'Smart Cooking AI',
      applicationVersion: '1.0.0',
      applicationIcon: const Icon(Icons.restaurant_menu, size: 48),
      children: [
        const Text('Hệ thống nấu ăn thông minh với AI'),
        const SizedBox(height: 16),
        const Text('Tích hợp:'),
        const Text('• OpenAI GPT cho tạo công thức'),
        const Text('• Google Maps cho tìm cửa hàng'),
        const Text('• Nhận dạng giọng nói'),
        const Text('• Gợi ý món ăn theo vùng miền'),
      ],
    );
  }

  void _showApiStatus() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('🔌 Trạng thái API'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStatusRow('AI Service', true, 'Mock mode'),
            _buildStatusRow('Backend', false, 'Connecting...'),
            _buildStatusRow('Google Maps', true, 'Mock data'),
            _buildStatusRow('OpenAI', false, 'Quota exceeded'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Đóng'),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusRow(String service, bool isOnline, String note) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            isOnline ? Icons.check_circle : Icons.error,
            color: isOnline ? Colors.green : Colors.red,
            size: 16,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  service,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  note,
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('📖 Trợ giúp'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('🏠 Trang chủ: Tạo công thức từ nguyên liệu'),
            SizedBox(height: 8),
            Text('🤖 AI Chat: Trò chuyện với trợ lý nấu ăn'),
            SizedBox(height: 8),
            Text('📝 Công thức: Xem và lưu công thức'),
            SizedBox(height: 8),
            Text('⚙️ Cài đặt: Tùy chỉnh ứng dụng'),
            SizedBox(height: 16),
            Text(
              '💡 Mẹo: Tất cả tính năng hiện đang chạy với dữ liệu mẫu để demo.',
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Hiểu rồi'),
          ),
        ],
      ),
    );
  }
}
