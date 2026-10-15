import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// The panel of a dialog: a title, a line of help, your content and the buttons. Show it with [showBefDialog].
class BefDialog extends StatelessWidget {
  const BefDialog({
    super.key,
    this.title,
    this.description,
    this.child,
    this.actions = const [],
    this.onClose,
    this.maxWidth = 448,
  });
  final String? title;
  final String? description;
  final Widget? child;

  /// Buttons along the bottom, right-aligned.
  final List<Widget> actions;

  /// Shows the X in the corner when set.
  final VoidCallback? onClose;
  final double maxWidth;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: maxWidth),
      child: Container(
        decoration: BoxDecoration(
          color: c.popover,
          borderRadius: BorderRadius.circular(BefRadius.xl),
          border: Border.all(color: c.border),
          boxShadow: const [
            BoxShadow(color: Color(0x40000000), blurRadius: 25, offset: Offset(0, 20), spreadRadius: -5),
          ],
        ),
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (title != null || description != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (title != null)
                            Text(
                              title!,
                              style: BefText.style(
                                context,
                                size: 16,
                                weight: FontWeight.w600,
                                color: c.popoverForeground,
                                letterSpacing: -0.2,
                              ),
                            ),
                          if (description != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              description!,
                              style: BefText.style(context, size: 13, color: c.mutedForeground),
                            ),
                          ],
                        ],
                      ),
                    ),
                  if (child != null) ...[const SizedBox(height: 16), child!],
                  if (actions.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Wrap(alignment: WrapAlignment.end, spacing: 8, runSpacing: 8, children: actions),
                  ],
                ],
              ),
            ),
            if (onClose != null)
              Positioned(
                right: 14,
                top: 14,
                child: BefPressable(
                  semanticLabel: 'Close',
                  pressScale: 0.9,
                  onPressed: onClose,
                  builder: (context, states) => Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: states.contains(WidgetState.hovered) ? c.secondary : null,
                      borderRadius: BorderRadius.circular(BefRadius.md),
                    ),
                    alignment: Alignment.center,
                    child: BefIcon(BefIcons.x, size: 16, color: c.mutedForeground),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Opens [builder] centred over a dimmed, slightly blurred page. Tap outside or press back to dismiss.
Future<T?> showBefDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  bool barrierDismissible = true,
}) {
  return showGeneralDialog<T>(
    context: context,
    barrierDismissible: barrierDismissible,
    barrierLabel: 'Dismiss',
    barrierColor: Colors.transparent,
    transitionDuration: const Duration(milliseconds: 200),
    pageBuilder: (context, _, _) => Stack(
      children: [
        Positioned.fill(
          child: BackdropFilter(
            filter: ui.ImageFilter.blur(sigmaX: 2, sigmaY: 2),
            child: const ColoredBox(color: Color(0x66000000)),
          ),
        ),
        SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Material(type: MaterialType.transparency, child: builder(context)),
            ),
          ),
        ),
      ],
    ),
    transitionBuilder: (context, anim, _, child) {
      final curved = CurvedAnimation(parent: anim, curve: Curves.easeOutCubic);
      return FadeTransition(
        opacity: curved,
        child: ScaleTransition(scale: Tween(begin: 0.97, end: 1.0).animate(curved), child: child),
      );
    },
  );
}
