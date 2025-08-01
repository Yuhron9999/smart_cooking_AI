import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:go_router/go_router.dart';
import '../../../providers/auth_provider.dart';
import '../../../core/constants/app_constants.dart';
import '../../../utils/google_oauth_helper.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();

  bool _isLoginMode = true;
  bool _obscurePassword = true;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: SafeArea(
        child: Consumer<AuthProvider>(
          builder: (context, authProvider, child) {
            return FadeTransition(
              opacity: _fadeAnimation,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppConstants.spacingLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: AppConstants.spacingXl),

                    // App Logo và Title
                    _buildHeader(),

                    const SizedBox(height: AppConstants.spacingXl * 2),

                    // OAuth2 Google Sign In Button
                    _buildGoogleSignInButton(authProvider),

                    const SizedBox(height: AppConstants.spacingLg),

                    // Divider
                    _buildDivider(),

                    const SizedBox(height: AppConstants.spacingLg),

                    // Email/Password Form
                    _buildAuthForm(authProvider),

                    const SizedBox(height: AppConstants.spacingLg),

                    // Submit Button
                    _buildSubmitButton(authProvider),

                    const SizedBox(height: AppConstants.spacingMd),

                    // Toggle Login/Register
                    _buildToggleButton(),

                    // Error Message
                    if (authProvider.error != null) ...[
                      const SizedBox(height: AppConstants.spacingMd),
                      _buildErrorMessage(authProvider.error!),
                    ],

                    const SizedBox(height: AppConstants.spacingXl),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        // App Icon
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppConstants.primaryColor, AppConstants.secondaryColor],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: AppConstants.primaryColor.withOpacity(0.3),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: const Icon(
            Icons.restaurant_menu,
            size: 50,
            color: Colors.white,
          ),
        ),

        const SizedBox(height: AppConstants.spacingLg),

        // App Title
        Text(
          'app.name'.tr(),
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.onSurface,
              ),
          textAlign: TextAlign.center,
        ),

        const SizedBox(height: AppConstants.spacingSm),

        // App Tagline
        Text(
          'app.tagline'.tr(),
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildGoogleSignInButton(AuthProvider authProvider) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline.withOpacity(0.3),
        ),
        color: Theme.of(context).colorScheme.surface,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: authProvider.isLoading
              ? null
              : () => _handleGoogleSignIn(authProvider),
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: AppConstants.spacingMd),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Google Icon - Using Icon widget instead of Image.asset
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.g_mobiledata,
                    size: 20,
                    color: Color(0xFF4285F4),
                  ),
                ),

                const SizedBox(width: AppConstants.spacingMd),

                // Text
                Expanded(
                  child: Text(
                    'auth.google_login'.tr(),
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                    textAlign: TextAlign.center,
                  ),
                ),

                // Loading indicator
                if (authProvider.isLoading)
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: Theme.of(context).colorScheme.outline.withOpacity(0.3),
          ),
        ),
        Padding(
          padding:
              const EdgeInsets.symmetric(horizontal: AppConstants.spacingMd),
          child: Text(
            'auth.or'.tr(),
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color:
                      Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                ),
          ),
        ),
        Expanded(
          child: Divider(
            color: Theme.of(context).colorScheme.outline.withOpacity(0.3),
          ),
        ),
      ],
    );
  }

  Widget _buildAuthForm(AuthProvider authProvider) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // Name field (chỉ hiện khi register)
          if (!_isLoginMode) ...[
            _buildTextField(
              controller: _nameController,
              label: 'auth.name'.tr(),
              icon: Icons.person_outline,
              validator: (value) {
                if (!_isLoginMode && (value == null || value.trim().isEmpty)) {
                  return 'auth.name_required'.tr();
                }
                return null;
              },
            ),
            const SizedBox(height: AppConstants.spacingMd),
          ],

          // Email field
          _buildTextField(
            controller: _emailController,
            label: 'auth.email'.tr(),
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'auth.email_required'.tr();
              }
              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                  .hasMatch(value)) {
                return 'auth.email_invalid'.tr();
              }
              return null;
            },
          ),

          const SizedBox(height: AppConstants.spacingMd),

          // Password field
          _buildTextField(
            controller: _passwordController,
            label: 'auth.password'.tr(),
            icon: Icons.lock_outline,
            obscureText: _obscurePassword,
            suffixIcon: IconButton(
              icon: Icon(
                _obscurePassword
                    ? Icons.visibility_outlined
                    : Icons.visibility_off_outlined,
              ),
              onPressed: () {
                setState(() {
                  _obscurePassword = !_obscurePassword;
                });
              },
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'auth.password_required'.tr();
              }
              if (value.length < 6) {
                return 'auth.password_min_length'.tr();
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscureText = false,
    TextInputType? keyboardType,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        suffixIcon: suffixIcon,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Theme.of(context).colorScheme.outline.withOpacity(0.3),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: AppConstants.primaryColor,
            width: 2,
          ),
        ),
        filled: true,
        fillColor: Theme.of(context).colorScheme.surface,
      ),
    );
  }

  Widget _buildSubmitButton(AuthProvider authProvider) {
    return SizedBox(
      height: 56,
      child: ElevatedButton(
        onPressed: authProvider.isLoading
            ? null
            : () => _handleEmailAuth(authProvider),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppConstants.primaryColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        child: authProvider.isLoading
            ? const CircularProgressIndicator(
                color: Colors.white,
                strokeWidth: 2,
              )
            : Text(
                _isLoginMode ? 'auth.login'.tr() : 'auth.register'.tr(),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
      ),
    );
  }

  Widget _buildToggleButton() {
    return TextButton(
      onPressed: () {
        setState(() {
          _isLoginMode = !_isLoginMode;
        });
      },
      child: RichText(
        text: TextSpan(
          style: Theme.of(context).textTheme.bodyMedium,
          children: [
            TextSpan(
              text: _isLoginMode
                  ? 'auth.no_account'.tr()
                  : 'auth.have_account'.tr(),
            ),
            TextSpan(
              text:
                  ' ${_isLoginMode ? 'auth.register'.tr() : 'auth.login'.tr()}',
              style: const TextStyle(
                color: AppConstants.primaryColor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorMessage(String error) {
    return Container(
      padding: const EdgeInsets.all(AppConstants.spacingMd),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.errorContainer,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(
            Icons.error_outline,
            color: Theme.of(context).colorScheme.error,
            size: 20,
          ),
          const SizedBox(width: AppConstants.spacingSm),
          Expanded(
            child: Text(
              error,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.error,
                  ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleGoogleSignIn(AuthProvider authProvider) async {
    try {
      final success = await authProvider.signInWithGoogle();
      if (success && mounted) {
        // Check if it was fallback authentication
        if (authProvider.error?.contains('fallback') == true) {
          GoogleOAuthHelper.showFallbackSuccessDialog(context);
          // Clear the "error" since it's actually success
          authProvider.clearError();
        }
        context.pushReplacement('/home');
      } else if (authProvider.error != null && mounted) {
        // Show enhanced error dialog with solutions
        GoogleOAuthHelper.showOAuthErrorDialog(
          context,
          authProvider.error!,
          onRetry: () => _handleGoogleSignIn(authProvider),
          onUseMock: () async {
            final mockSuccess = await authProvider.signInWithMockGoogle();
            if (mockSuccess && mounted) {
              context.pushReplacement('/home');
            }
          },
        );
      }
    } catch (e) {
      if (mounted) {
        GoogleOAuthHelper.showOAuthErrorDialog(
          context,
          e.toString(),
          onRetry: () => _handleGoogleSignIn(authProvider),
          onUseMock: () async {
            final mockSuccess = await authProvider.signInWithMockGoogle();
            if (mockSuccess && mounted) {
              context.pushReplacement('/home');
            }
          },
        );
      }
    }
  }

  // OAuth helper methods removed - now using GoogleOAuthHelper

  Future<void> _handleEmailAuth(AuthProvider authProvider) async {
    if (!_formKey.currentState!.validate()) return;

    bool success;
    if (_isLoginMode) {
      success = await authProvider.signInWithEmail(
        _emailController.text.trim(),
        _passwordController.text,
      );
    } else {
      success = await authProvider.registerWithEmail(
        _nameController.text.trim(),
        _emailController.text.trim(),
        _passwordController.text,
      );
    }

    if (success && mounted) {
      context.pushReplacement('/home');
    }
  }
}
