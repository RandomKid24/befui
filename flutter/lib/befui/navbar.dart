import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// Top bar of a screen: optional back arrow, a title (with an optional subtitle) and action icons on the right. Use it as `Scaffold.appBar` or at the top of a Column.
class BefAppBar extends StatelessWidget implements PreferredSizeWidget {
  const BefAppBar({
    super.key,
    required this.title,
    this.subtitle,
    this.onBack,
    this.actions = const [],
    this.centerTitle = false,
  });
  final String title;
  final String? subtitle;

  /// Shows a back arrow when set.
  final VoidCallback? onBack;

  /// Usually [BefAppBarAction]s.
  final List<Widget> actions;
  final bool centerTitle;

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      height: 56,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: c.background,
        border: Border(bottom: BorderSide(color: c.border)),
      ),
      child: Row(
        children: [
          if (onBack != null)
            BefAppBarAction(icon: BefIcons.chevronLeft, label: 'Back', onPressed: onBack)
          else
            const SizedBox(width: 8),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: centerTitle ? CrossAxisAlignment.center : CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: BefText.style(context, size: 16, weight: FontWeight.w600, color: c.foreground),
                ),
                if (subtitle != null)
                  Text(
                    subtitle!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: BefText.style(context, size: 12, color: c.mutedForeground),
                  ),
              ],
            ),
          ),
          ...actions,
        ],
      ),
    );
  }
}

/// A 40-point icon button for [BefAppBar]. [badge] shows a count in the corner.
class BefAppBarAction extends StatelessWidget {
  const BefAppBarAction({super.key, required this.icon, required this.label, this.onPressed, this.badge});
  final BefIconData icon;
  final String label;
  final VoidCallback? onPressed;
  final int? badge;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return BefPressable(
      semanticLabel: label,
      onPressed: onPressed,
      builder: (context, s) => SizedBox(
        width: 40,
        height: 40,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Container(
              decoration: BoxDecoration(
                color: s.contains(WidgetState.hovered) || s.contains(WidgetState.pressed)
                    ? c.secondary
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(BefRadius.md),
              ),
            ),
            BefIcon(icon, size: 20, color: c.foreground),
            if (badge != null && badge! > 0)
              Positioned(
                right: 4,
                top: 4,
                child: Container(
                  constraints: const BoxConstraints(minWidth: 16),
                  height: 16,
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: c.destructive,
                    borderRadius: BorderRadius.circular(BefRadius.full),
                  ),
                  child: Text(
                    badge! > 9 ? '9+' : '$badge',
                    style: BefText.style(
                      context,
                      size: 10,
                      weight: FontWeight.w600,
                      color: Colors.white,
                      height: 1,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
