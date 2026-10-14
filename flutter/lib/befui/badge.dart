import 'package:flutter/material.dart';

import 'theme.dart';

enum BefBadgeVariant {
  defaultStyle,
  outline,
  primary,
  success,
  warning,
  danger,
  info,
}

/// A small pill for status and counts. [dot] adds the coloured dot in front of the label.
class BefBadge extends StatelessWidget {
  const BefBadge({
    super.key,
    this.label,
    this.child,
    this.variant = BefBadgeVariant.defaultStyle,
    this.dot = false,
    this.leading,
  }) : assert(label != null || child != null);

  final String? label;
  final Widget? child;
  final BefBadgeVariant variant;
  final bool dot;
  final Widget? leading;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final (fg, bg, border) = switch (variant) {
      BefBadgeVariant.defaultStyle => (
        c.secondaryForeground,
        c.secondary,
        Colors.transparent,
      ),
      BefBadgeVariant.outline => (c.mutedForeground, null, c.border),
      BefBadgeVariant.primary => (
        c.primaryForeground,
        c.primary,
        Colors.transparent,
      ),
      BefBadgeVariant.success => (
        c.success,
        befTint(c.success, 0.1),
        befTint(c.success, 0.2),
      ),
      BefBadgeVariant.warning => (
        c.warning,
        befTint(c.warning, 0.1),
        befTint(c.warning, 0.25),
      ),
      BefBadgeVariant.danger => (
        c.destructive,
        befTint(c.destructive, 0.1),
        befTint(c.destructive, 0.2),
      ),
      BefBadgeVariant.info => (
        c.info,
        befTint(c.info, 0.1),
        befTint(c.info, 0.2),
      ),
    };
    return DecoratedBox(
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(BefRadius.full),
        border: Border.all(color: border),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        child: DefaultTextStyle.merge(
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: fg,
            height: 16 / 11,
          ),
          child: IconTheme.merge(
            data: IconThemeData(size: 12, color: fg),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (dot)
                  Container(
                    width: 6,
                    height: 6,
                    margin: const EdgeInsets.only(right: 4),
                    decoration: BoxDecoration(
                      color: fg,
                      shape: BoxShape.circle,
                    ),
                  ),
                if (leading != null)
                  Padding(
                    padding: const EdgeInsets.only(right: 4),
                    child: leading,
                  ),
                if (child != null) child! else Text(label!, softWrap: false),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A foreground colour at [opacity] over nothing: the `border-success/20` of the CSS.
Color befTint(Color c, double opacity) => c.withValues(alpha: opacity);
