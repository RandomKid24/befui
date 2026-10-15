import 'package:flutter/material.dart';

import 'theme.dart';

enum BefUptimeStatus { up, degraded, down }

class BefUptimeDay {
  const BefUptimeDay({required this.date, required this.status, this.note});
  final String date;
  final BefUptimeStatus status;
  final String? note;
}

/// A status page row: the service name, the uptime percentage and a bar with one slice per day. Tap a slice for its date.
class BefUptimeBar extends StatefulWidget {
  const BefUptimeBar({super.key, required this.name, required this.days});
  final String name;
  final List<BefUptimeDay> days;

  @override
  State<BefUptimeBar> createState() => _BefUptimeBarState();
}

class _BefUptimeBarState extends State<BefUptimeBar> {
  int? _hover;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    Color tone(BefUptimeStatus s) => switch (s) {
      BefUptimeStatus.up => c.success,
      BefUptimeStatus.degraded => c.warning,
      BefUptimeStatus.down => c.destructive,
    };
    final up = widget.days.fold<double>(
      0,
      (s, d) => s + (d.status == BefUptimeStatus.up ? 1 : (d.status == BefUptimeStatus.degraded ? 0.5 : 0)),
    );
    final pct = up / widget.days.length * 100;
    final now = widget.days.last.status;
    final hovered = _hover == null ? null : widget.days[_hover!];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(color: tone(now), shape: BoxShape.circle),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(widget.name, style: BefText.style(context, size: 13, weight: FontWeight.w500)),
            ),
            Text(
              '${pct.toStringAsFixed(2)}% uptime',
              style: BefText.style(
                context,
                size: 13,
                color: c.mutedForeground,
              ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Semantics(
          label: '${widget.name}: ${pct.toStringAsFixed(2)} percent uptime over ${widget.days.length} days',
          child: SizedBox(
            height: 32,
            child: Row(
              children: [
                for (var i = 0; i < widget.days.length; i++) ...[
                  if (i > 0) const SizedBox(width: 2),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _hover = _hover == i ? null : i),
                      child: MouseRegion(
                        onEnter: (_) => setState(() => _hover = i),
                        onExit: (_) => setState(() => _hover = null),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          decoration: BoxDecoration(
                            color: tone(
                              widget.days[i].status,
                            ).withValues(alpha: _hover == null || _hover == i ? 1 : 0.5),
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: 6),
        SizedBox(
          height: 16,
          child: hovered == null
              ? Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${widget.days.length} days ago',
                      style: BefText.style(context, size: 11, color: c.mutedForeground),
                    ),
                    Text('Today', style: BefText.style(context, size: 11, color: c.mutedForeground)),
                  ],
                )
              : Text(
                  '${hovered.date}: ${hovered.status.name}${hovered.note == null ? '' : ' · ${hovered.note}'}',
                  style: BefText.style(context, size: 11, color: c.mutedForeground),
                ),
        ),
      ],
    );
  }
}
