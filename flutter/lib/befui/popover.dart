import 'package:flutter/material.dart';

import 'theme.dart';

/// A floating panel anchored to its trigger. Tap the [child] to open; tap anywhere else to close.
class BefPopover extends StatefulWidget {
  const BefPopover({
    super.key,
    required this.child,
    required this.content,
    this.width = 288,
    this.alignment = Alignment.bottomCenter,
  });
  final Widget child;
  final Widget content;
  final double width;

  /// Where the panel sits relative to the trigger.
  final Alignment alignment;

  @override
  State<BefPopover> createState() => _BefPopoverState();
}

class _BefPopoverState extends State<BefPopover> {
  final OverlayPortalController _portal = OverlayPortalController();
  final LayerLink _link = LayerLink();

  void _toggle() => _portal.isShowing ? _portal.hide() : _portal.show();

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return CompositedTransformTarget(
      link: _link,
      child: OverlayPortal(
        controller: _portal,
        overlayChildBuilder: (context) {
          final theme = Theme.of(context);
          return Stack(
            children: [
              Positioned.fill(
                child: GestureDetector(behavior: HitTestBehavior.translucent, onTap: _portal.hide),
              ),
              CompositedTransformFollower(
                link: _link,
                targetAnchor: widget.alignment,
                followerAnchor: widget.alignment == Alignment.topCenter
                    ? Alignment.bottomCenter
                    : Alignment.topCenter,
                offset: Offset(0, widget.alignment == Alignment.topCenter ? -8 : 8),
                child: Align(
                  alignment: Alignment.topLeft,
                  child: Theme(
                    data: theme,
                    child: Material(
                      type: MaterialType.transparency,
                      child: TweenAnimationBuilder<double>(
                        tween: Tween(begin: 0, end: 1),
                        duration: const Duration(milliseconds: 160),
                        builder: (context, t, child) => Opacity(
                          opacity: t,
                          child: Transform.scale(scale: 0.97 + 0.03 * t, child: child),
                        ),
                        child: Container(
                          width: widget.width,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: c.popover,
                            borderRadius: BorderRadius.circular(BefRadius.xl),
                            border: Border.all(color: c.border),
                            boxShadow: BefShadow.md,
                          ),
                          child: DefaultTextStyle.merge(
                            style: BefText.style(context, color: c.popoverForeground),
                            child: widget.content,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
        child: GestureDetector(onTap: _toggle, child: widget.child),
      ),
    );
  }
}
