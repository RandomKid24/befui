import 'dart:async';

import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

enum BefToastType { success, error, info }

/// Short messages that slide up from the bottom and go away by themselves:
/// `BefToast.success(context, 'Saved', 'Your changes are live.')`. They sit above everything, including dialogs.
class BefToast {
  static void success(BuildContext context, String title, [String? description]) =>
      show(context, BefToastType.success, title, description);
  static void error(BuildContext context, String title, [String? description]) =>
      show(context, BefToastType.error, title, description);
  static void info(BuildContext context, String title, [String? description]) =>
      show(context, BefToastType.info, title, description);

  static void show(
    BuildContext context,
    BefToastType type,
    String title, [
    String? description,
    Duration duration = const Duration(seconds: 4),
  ]) {
    final overlay = Overlay.of(context, rootOverlay: true);
    late OverlayEntry entry;
    final theme = Theme.of(context);
    entry = OverlayEntry(
      builder: (context) => _ToastView(
        type: type,
        title: title,
        description: description,
        duration: duration,
        theme: theme,
        onDone: () => entry.remove(),
      ),
    );
    overlay.insert(entry);
  }
}

class _ToastView extends StatefulWidget {
  const _ToastView({
    required this.type,
    required this.title,
    this.description,
    required this.duration,
    required this.theme,
    required this.onDone,
  });
  final BefToastType type;
  final String title;
  final String? description;
  final Duration duration;
  final ThemeData theme;
  final VoidCallback onDone;

  @override
  State<_ToastView> createState() => _ToastViewState();
}

class _ToastViewState extends State<_ToastView> with SingleTickerProviderStateMixin {
  late final AnimationController _a;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _a = AnimationController(vsync: this, duration: const Duration(milliseconds: 220));
    _a.forward();
    _timer = Timer(widget.duration, _dismiss);
  }

  Future<void> _dismiss() async {
    _timer?.cancel();
    if (!mounted) return;
    await _a.reverse();
    widget.onDone();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _a.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: widget.theme,
      child: Builder(
        builder: (context) {
          final c = context.bef;
          final (icon, color) = switch (widget.type) {
            BefToastType.success => (BefIcons.checkCircle, c.success),
            BefToastType.error => (BefIcons.alertCircle, c.destructive),
            BefToastType.info => (BefIcons.info, c.info),
          };
          final bottom = MediaQuery.paddingOf(context).bottom;
          return Positioned(
            left: 16,
            right: 16,
            bottom: 16 + bottom,
            child: Align(
              alignment: Alignment.bottomCenter,
              child: FadeTransition(
                opacity: _a,
                child: SlideTransition(
                  position: Tween(
                    begin: const Offset(0, 0.4),
                    end: Offset.zero,
                  ).animate(CurvedAnimation(parent: _a, curve: Curves.easeOutCubic)),
                  child: Material(
                    type: MaterialType.transparency,
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 360),
                      child: Semantics(
                        liveRegion: true,
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: c.popover,
                            borderRadius: BorderRadius.circular(BefRadius.lg),
                            border: Border.all(color: c.border),
                            boxShadow: BefShadow.md,
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(top: 2),
                                child: BefIcon(icon, size: 16, color: color),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      widget.title,
                                      style: BefText.style(
                                        context,
                                        size: 13,
                                        weight: FontWeight.w500,
                                        color: c.popoverForeground,
                                      ),
                                    ),
                                    if (widget.description != null) ...[
                                      const SizedBox(height: 2),
                                      Text(
                                        widget.description!,
                                        style: BefText.style(context, size: 12, color: c.mutedForeground),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                              const SizedBox(width: 12),
                              BefPressable(
                                semanticLabel: 'Dismiss',
                                pressScale: 0.9,
                                onPressed: _dismiss,
                                builder: (_, _) => Padding(
                                  padding: const EdgeInsets.all(2),
                                  child: BefIcon(BefIcons.x, size: 14, color: c.mutedForeground),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
