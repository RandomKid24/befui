import 'package:flutter/material.dart';

import 'icons.dart';
import 'theme.dart';

/// A full-width announcement bar on the `primary` colour. Tap the X and it collapses.
class BefBanner extends StatefulWidget {
  const BefBanner({super.key, required this.child, this.action, this.onDismiss});
  final Widget child;
  final Widget? action;
  final VoidCallback? onDismiss;

  @override
  State<BefBanner> createState() => _BefBannerState();
}

class _BefBannerState extends State<BefBanner> {
  bool _open = true;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return AnimatedSize(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
      alignment: Alignment.topCenter,
      child: _open
          ? Container(
              width: double.infinity,
              color: c.primary,
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 8),
              child: Stack(
                alignment: Alignment.center,
                clipBehavior: Clip.none,
                children: [
                  DefaultTextStyle.merge(
                    style: BefText.style(
                      context,
                      size: 13,
                      weight: FontWeight.w500,
                      color: c.primaryForeground,
                    ),
                    textAlign: TextAlign.center,
                    child: Wrap(
                      alignment: WrapAlignment.center,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      spacing: 12,
                      children: [widget.child, if (widget.action != null) widget.action!],
                    ),
                  ),
                  Positioned(
                    right: -28,
                    child: Semantics(
                      button: true,
                      label: 'Dismiss',
                      child: GestureDetector(
                        onTap: () {
                          setState(() => _open = false);
                          widget.onDismiss?.call();
                        },
                        child: Padding(
                          padding: const EdgeInsets.all(6),
                          child: BefIcon(BefIcons.x, size: 14, color: c.primaryForeground),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )
          : const SizedBox(width: double.infinity),
    );
  }
}
