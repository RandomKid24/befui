import 'package:flutter/material.dart';

import 'theme.dart';

/// A small label that appears on long-press (and on hover with a mouse). Dark by default; [light] gives the card look.
class BefTooltip extends StatelessWidget {
  const BefTooltip({super.key, required this.message, this.title, this.light = false, required this.child});
  final String message;
  final String? title;
  final bool light;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final fg = light ? c.popoverForeground : c.background;
    return Tooltip(
      richMessage: TextSpan(
        children: [
          if (title != null)
            TextSpan(
              text: '$title\n',
              style: TextStyle(fontWeight: FontWeight.w600, color: fg),
            ),
          TextSpan(
            text: message,
            style: TextStyle(
              fontWeight: title != null ? FontWeight.w400 : FontWeight.w500,
              color: title != null ? fg.withValues(alpha: 0.8) : fg,
            ),
          ),
        ],
      ),
      textStyle: BefText.style(context, size: 12, weight: FontWeight.w500, color: fg),
      padding: EdgeInsets.symmetric(horizontal: title != null ? 10 : 8, vertical: title != null ? 6 : 4),
      margin: const EdgeInsets.symmetric(horizontal: 16),
      verticalOffset: 14,
      preferBelow: false,
      waitDuration: const Duration(milliseconds: 150),
      triggerMode: TooltipTriggerMode.longPress,
      decoration: BoxDecoration(
        color: light ? c.popover : c.foreground,
        borderRadius: BorderRadius.circular(BefRadius.md),
        border: light ? Border.all(color: c.border) : null,
        boxShadow: light
            ? BefShadow.md
            : const [BoxShadow(color: Color(0x1A000000), blurRadius: 6, offset: Offset(0, 4))],
      ),
      child: child,
    );
  }
}
