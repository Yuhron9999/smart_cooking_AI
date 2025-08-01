import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';

/// Test widget để kiểm tra translation loading
class LocalizationTestWidget extends StatelessWidget {
  const LocalizationTestWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Translation Test'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Test basic translations
            Text(
              'App Name: ${tr('app.name')}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'App Tagline: ${tr('app.tagline')}',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 16),

            // Test auth translations
            Text(
              'Login: ${tr('auth.login')}',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            Text(
              'Register: ${tr('auth.register')}',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            Text(
              'Google Login: ${tr('auth.google_login')}',
              style: Theme.of(context).textTheme.bodyMedium,
            ),

            const SizedBox(height: 16),

            // Current locale info
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Current Locale: ${context.locale}'),
                  Text('Fallback Locale: ${context.fallbackLocale}'),
                  Text('Supported Locales: ${context.supportedLocales}'),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Language switcher
            Row(
              children: [
                ElevatedButton(
                  onPressed: () => context.setLocale(const Locale('vi')),
                  child: const Text('Tiếng Việt'),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () => context.setLocale(const Locale('en')),
                  child: const Text('English'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
