import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonType type;
  final ButtonSize size;
  final Widget? icon;
  final bool isLoading;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.type = ButtonType.primary,
    this.size = ButtonSize.medium,
    this.icon,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    Widget child = isLoading
        ? SizedBox(
            height: 20,
            width: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                type == ButtonType.primary
                    ? Colors.white
                    : AppTheme.brandOrange,
              ),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[icon!, const SizedBox(width: 8)],
              Text(text),
            ],
          );

    switch (type) {
      case ButtonType.primary:
        return Container(
          height: _getHeight(),
          decoration: const BoxDecoration(
            gradient: AppTheme.brandGradient,
            borderRadius: BorderRadius.all(Radius.circular(12)),
          ),
          child: ElevatedButton(
            onPressed: isLoading ? null : onPressed,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.transparent,
              shadowColor: Colors.transparent,
              padding: EdgeInsets.symmetric(
                horizontal: _getHorizontalPadding(),
                vertical: 0,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: child,
          ),
        );

      case ButtonType.secondary:
        return SizedBox(
          height: _getHeight(),
          child: OutlinedButton(
            onPressed: isLoading ? null : onPressed,
            style: OutlinedButton.styleFrom(
              padding: EdgeInsets.symmetric(
                horizontal: _getHorizontalPadding(),
                vertical: 0,
              ),
            ),
            child: child,
          ),
        );

      case ButtonType.ghost:
        return SizedBox(
          height: _getHeight(),
          child: TextButton(
            onPressed: isLoading ? null : onPressed,
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(
                horizontal: _getHorizontalPadding(),
                vertical: 0,
              ),
            ),
            child: child,
          ),
        );
    }
  }

  double _getHeight() {
    switch (size) {
      case ButtonSize.small:
        return 36;
      case ButtonSize.medium:
        return 48;
      case ButtonSize.large:
        return 56;
    }
  }

  double _getHorizontalPadding() {
    switch (size) {
      case ButtonSize.small:
        return 16;
      case ButtonSize.medium:
        return 24;
      case ButtonSize.large:
        return 32;
    }
  }
}

enum ButtonType { primary, secondary, ghost }

enum ButtonSize { small, medium, large }

// Badge Widget
class CustomBadge extends StatelessWidget {
  final String text;
  final BadgeVariant variant;

  const CustomBadge({super.key, required this.text, required this.variant});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: _getBackgroundColor(),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: _getTextColor(),
        ),
      ),
    );
  }

  Color _getBackgroundColor() {
    switch (variant) {
      case BadgeVariant.success:
        return AppTheme.successGreen.withOpacity(0.1);
      case BadgeVariant.warning:
        return AppTheme.warningYellow.withOpacity(0.1);
      case BadgeVariant.error:
        return AppTheme.errorRed.withOpacity(0.1);
      case BadgeVariant.info:
        return AppTheme.infoBlue.withOpacity(0.1);
      case BadgeVariant.easy:
        return AppTheme.successGreen.withOpacity(0.1);
      case BadgeVariant.medium:
        return AppTheme.warningYellow.withOpacity(0.1);
      case BadgeVariant.hard:
        return AppTheme.errorRed.withOpacity(0.1);
    }
  }

  Color _getTextColor() {
    switch (variant) {
      case BadgeVariant.success:
        return AppTheme.successGreen;
      case BadgeVariant.warning:
        return AppTheme.warningYellow;
      case BadgeVariant.error:
        return AppTheme.errorRed;
      case BadgeVariant.info:
        return AppTheme.infoBlue;
      case BadgeVariant.easy:
        return AppTheme.successGreen;
      case BadgeVariant.medium:
        return AppTheme.warningYellow;
      case BadgeVariant.hard:
        return AppTheme.errorRed;
    }
  }
}

enum BadgeVariant { success, warning, error, info, easy, medium, hard }

// Custom Input Field
class CustomTextField extends StatelessWidget {
  final String? label;
  final String? hintText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onTap;
  final bool readOnly;
  final int maxLines;
  final TextInputType keyboardType;

  const CustomTextField({
    super.key,
    this.label,
    this.hintText,
    this.prefixIcon,
    this.suffixIcon,
    this.controller,
    this.onChanged,
    this.onTap,
    this.readOnly = false,
    this.maxLines = 1,
    this.keyboardType = TextInputType.text,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
              color: AppTheme.gray700,
            ),
          ),
          const SizedBox(height: 8),
        ],
        TextField(
          controller: controller,
          onChanged: onChanged,
          onTap: onTap,
          readOnly: readOnly,
          maxLines: maxLines,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hintText,
            prefixIcon: prefixIcon,
            suffixIcon: suffixIcon,
          ),
        ),
      ],
    );
  }
}

// Loading Skeleton
class LoadingSkeleton extends StatefulWidget {
  final double width;
  final double height;
  final BorderRadius? borderRadius;

  const LoadingSkeleton({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius,
  });

  @override
  State<LoadingSkeleton> createState() => _LoadingSkeletonState();
}

class _LoadingSkeletonState extends State<LoadingSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: widget.borderRadius ?? BorderRadius.circular(8),
            gradient: LinearGradient(
              begin: Alignment(-1.0 + 2.0 * _animation.value, 0.0),
              end: Alignment(1.0 + 2.0 * _animation.value, 0.0),
              colors: const [
                AppTheme.gray200,
                AppTheme.gray100,
                AppTheme.gray200,
              ],
              stops: const [0.0, 0.5, 1.0],
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
}
