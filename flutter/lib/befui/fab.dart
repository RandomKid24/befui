import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefFabAction {
  const BefFabAction({required this.label, required this.icon, required this.onPressed});
  final String label;
  final Widget icon;
  final VoidCallback onPressed;
}

/// A round floating button, or an extended one with a [label]. With [actions] it opens a speed dial above it.
class BefFab extends StatefulWidget {
  const BefFab({super.key, this.icon, this.label, this.onPressed, this.actions = const []});
  final Widget? icon;
  final String? label;
  final VoidCallback? onPressed;
  final List<BefFabAction> actions;

  @override
  State<BefFab> createState() => _BefFabState();
}

class _BefFabState extends State<BefFab> {
  bool _open = false;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final dial = widget.actions.isNotEmpty;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (dial && _open)
          for (final a in widget.actions.reversed) ...[
            BefPressable(
              semanticLabel: a.label,
              pressScale: 0.97,
              onPressed: () {
                setState(() => _open = false);
                a.onPressed();
              },
              builder: (context, states) => Container(
                padding: const EdgeInsets.fromLTRB(14, 6, 6, 6),
                decoration: BoxDecoration(
                  color: states.contains(WidgetState.hovered) ? c.secondary : c.card,
                  borderRadius: BorderRadius.circular(BefRadius.full),
                  border: Border.all(color: c.border),
                  boxShadow: BefShadow.md,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(a.label, style: BefText.style(context, size: 13, weight: FontWeight.w500)),
                    const SizedBox(width: 8),
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(color: c.secondary, shape: BoxShape.circle),
                      alignment: Alignment.center,
                      child: IconTheme.merge(
                        data: IconThemeData(size: 16, color: c.foreground),
                        child: a.icon,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),
          ],
        BefPressable(
          semanticLabel: widget.label ?? 'Add',
          pressScale: 0.95,
          onPressed: dial ? () => setState(() => _open = !_open) : widget.onPressed,
          builder: (context, states) {
            final focused = states.contains(WidgetState.focused);
            return Container(
              height: 56,
              constraints: const BoxConstraints(minWidth: 56),
              padding: EdgeInsets.symmetric(horizontal: widget.label == null ? 0 : 20),
              decoration: BoxDecoration(
                color: c.primary,
                borderRadius: BorderRadius.circular(BefRadius.full),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0x331E293B),
                    blurRadius: states.contains(WidgetState.hovered) ? 20 : 12,
                    offset: const Offset(0, 8),
                    spreadRadius: -3,
                  ),
                  if (focused) BoxShadow(color: c.ring.withValues(alpha: 0.5), spreadRadius: 2),
                ],
              ),
              child: DefaultTextStyle.merge(
                style: BefText.style(context, size: 14, weight: FontWeight.w500, color: c.primaryForeground),
                child: IconTheme.merge(
                  data: IconThemeData(size: 24, color: c.primaryForeground),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedRotation(
                        turns: _open ? 0.125 : 0,
                        duration: const Duration(milliseconds: 200),
                        child: widget.icon ?? const BefIcon(BefIcons.plus),
                      ),
                      if (widget.label != null) ...[const SizedBox(width: 8), Text(widget.label!)],
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
