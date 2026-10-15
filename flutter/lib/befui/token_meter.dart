import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

class BefTokenSegment {
  const BefTokenSegment(this.label, this.tokens);
  final String label;
  final int tokens;
}

String _compact(int n) => n >= 1000000
    ? '${(n / 1000000).toStringAsFixed(1).replaceAll('.0', '')}M'
    : n >= 1000
    ? '${(n / 1000).toStringAsFixed(1).replaceAll('.0', '')}K'
    : '$n';

/// How much of a model's context window is used: a bar that turns amber past 70% and red past 90%, the counts, and an optional [cost]. Pass [segments] (prompt, files, reply) to split the bar by what the tokens are.
class BefTokenMeter extends StatelessWidget {
  const BefTokenMeter({super.key, required this.used, required this.limit, this.cost, this.segments});
  final int used, limit;
  final String? cost;
  final List<BefTokenSegment>? segments;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final pct = (used / limit).clamp(0.0, 1.0);
    final tone = pct > 0.9
        ? c.destructive
        : pct > 0.7
        ? c.warning
        : c.primary;
    final shades = [c.primary, c.info, c.success, c.warning];
    final dur = befReduceMotion(context) ? Duration.zero : const Duration(milliseconds: 700);
    return Semantics(
      label: 'Context used',
      value: '$used of $limit tokens',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Text('Context', style: BefText.style(context, size: 12, weight: FontWeight.w500)),
              const Spacer(),
              Text(
                '${_compact(used)} of ${_compact(limit)} tokens${cost == null ? '' : ' · $cost'}',
                style: BefText.style(context, size: 12, color: c.mutedForeground),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(BefRadius.full),
            child: Container(
              height: 8,
              color: c.secondary,
              child: segments != null
                  ? Row(
                      children: [
                        for (var i = 0; i < segments!.length; i++)
                          Flexible(
                            flex: (segments![i].tokens * 1000 / limit).round(),
                            child: Container(color: shades[i % shades.length]),
                          ),
                        Expanded(
                          flex: ((limit - segments!.fold<int>(0, (s, e) => s + e.tokens)) * 1000 / limit)
                              .round()
                              .clamp(0, 1000000),
                          child: const SizedBox(),
                        ),
                      ],
                    )
                  : Align(
                      alignment: Alignment.centerLeft,
                      child: TweenAnimationBuilder<double>(
                        tween: Tween(end: pct),
                        duration: dur,
                        curve: Curves.easeOut,
                        builder: (context, v, _) => FractionallySizedBox(
                          widthFactor: v,
                          child: Container(color: tone),
                        ),
                      ),
                    ),
            ),
          ),
          if (segments != null) ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 16,
              runSpacing: 4,
              children: [
                for (var i = 0; i < segments!.length; i++)
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(color: shades[i % shades.length], shape: BoxShape.circle),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${segments![i].label} ${_compact(segments![i].tokens)}',
                        style: BefText.style(context, size: 12, color: c.mutedForeground),
                      ),
                    ],
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
