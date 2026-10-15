import 'package:flutter/material.dart';

import 'icons.dart';
import 'theme.dart';

enum BefSwipeTone { normal, primary, danger, warning }

class BefSwipeAction {
  const BefSwipeAction({
    required this.label,
    required this.onPressed,
    this.icon,
    this.tone = BefSwipeTone.normal,
  });
  final String label;
  final BefIconData? icon;
  final VoidCallback onPressed;
  final BefSwipeTone tone;
}

/// A list row you swipe left to reveal action buttons behind it. Release past half to keep it open. Put it around one row at a time.
class BefSwipeActions extends StatefulWidget {
  const BefSwipeActions({super.key, required this.actions, required this.child});
  final List<BefSwipeAction> actions;
  final Widget child;

  @override
  State<BefSwipeActions> createState() => _BefSwipeActionsState();
}

class _BefSwipeActionsState extends State<BefSwipeActions> with SingleTickerProviderStateMixin {
  static const _w = 76.0;
  late final AnimationController _c = AnimationController(vsync: this); // 0 closed .. 1 open

  double get _max => widget.actions.length * _w;

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  void _settle(bool open) =>
      _c.animateTo(open ? 1 : 0, duration: const Duration(milliseconds: 200), curve: Curves.easeOut);

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    (Color, Color) tone(BefSwipeTone t) => switch (t) {
      BefSwipeTone.normal => (c.secondary, c.foreground),
      BefSwipeTone.primary => (c.primary, c.primaryForeground),
      BefSwipeTone.danger => (c.destructive, Colors.white),
      BefSwipeTone.warning => (c.warning, Colors.white),
    };
    return ClipRRect(
      borderRadius: BorderRadius.circular(BefRadius.xl),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: c.card,
          border: Border.all(color: c.border),
          borderRadius: BorderRadius.circular(BefRadius.xl),
        ),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onHorizontalDragUpdate: (d) => _c.value = (_c.value - d.delta.dx / _max).clamp(0.0, 1.0),
          onHorizontalDragEnd: (_) => _settle(_c.value > 0.5),
          child: Stack(
            children: [
              Positioned.fill(
                child: Align(
                  alignment: Alignment.centerRight,
                  child: SizedBox(
                    width: _max,
                    child: Row(
                      children: [
                        for (final a in widget.actions)
                          Builder(
                            builder: (context) {
                              final (bg, fg) = tone(a.tone);
                              return GestureDetector(
                                onTap: () {
                                  _settle(false);
                                  a.onPressed();
                                },
                                child: Container(
                                  width: _w,
                                  color: bg,
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      if (a.icon != null) BefIcon(a.icon!, size: 16, color: fg),
                                      const SizedBox(height: 4),
                                      Text(
                                        a.label,
                                        style: BefText.style(
                                          context,
                                          size: 11,
                                          weight: FontWeight.w500,
                                          color: fg,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                      ],
                    ),
                  ),
                ),
              ),
              AnimatedBuilder(
                animation: _c,
                builder: (context, child) =>
                    Transform.translate(offset: Offset(-_c.value * _max, 0), child: child),
                child: Container(color: c.card, child: widget.child),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
