import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// Review summary: big average, five stars, and a bar per star level with its count. [counts] is the number of ratings for 5, 4, 3, 2 and 1 stars, in that order. Pass [onSelect] to make each row a filter button; [selected] marks the active one.
class BefRatingBreakdown extends StatelessWidget {
  const BefRatingBreakdown({super.key, required this.counts, this.selected, this.onSelect});
  final List<int> counts;
  final int? selected;
  final ValueChanged<int?>? onSelect;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final total = counts.fold<int>(0, (a, b) => a + b);
    final avg = total == 0
        ? 0.0
        : [for (var i = 0; i < 5; i++) counts[i] * (5 - i)].fold<int>(0, (a, b) => a + b) / total;
    final max = counts.fold<int>(1, (m, v) => v > m ? v : m);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              avg.toStringAsFixed(1),
              style: BefText.style(
                context,
                size: 44,
                weight: FontWeight.w600,
                letterSpacing: -1,
                height: 1.1,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (var s = 1; s <= 5; s++)
                  BefIcon(
                    BefIcons.star,
                    size: 14,
                    color: avg + 0.25 >= s ? c.warning : c.mutedForeground.withValues(alpha: 0.3),
                    fill: avg + 0.25 >= s ? c.warning : null,
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text('$total ratings', style: BefText.style(context, size: 12, color: c.mutedForeground)),
          ],
        ),
        const SizedBox(width: 24),
        Expanded(
          child: Column(
            children: [for (var i = 0; i < 5; i++) _row(context, c, 5 - i, counts[i], max, total)],
          ),
        ),
      ],
    );
  }

  Widget _row(BuildContext context, BefColors c, int stars, int count, int max, int total) {
    final on = selected == stars;
    return BefPressable(
      semanticLabel: '$stars stars, $count ratings',
      pressScale: 1,
      onPressed: onSelect == null ? null : () => onSelect!(on ? null : stars),
      builder: (context, s) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        decoration: BoxDecoration(
          color: on ? c.accent : Colors.transparent,
          borderRadius: BorderRadius.circular(BefRadius.md),
        ),
        child: Row(
          children: [
            SizedBox(
              width: 22,
              child: Text('$stars', style: BefText.style(context, size: 12, color: c.mutedForeground)),
            ),
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(BefRadius.full),
                child: Container(
                  height: 8,
                  color: c.secondary,
                  alignment: Alignment.centerLeft,
                  child: TweenAnimationBuilder<double>(
                    tween: Tween(end: count / max),
                    duration: befReduceMotion(context) ? Duration.zero : const Duration(milliseconds: 700),
                    curve: Curves.easeOutCubic,
                    builder: (context, v, _) => FractionallySizedBox(
                      widthFactor: v,
                      child: Container(color: c.warning),
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(
              width: 38,
              child: Text(
                '${total == 0 ? 0 : (count / total * 100).round()}%',
                textAlign: TextAlign.right,
                style: BefText.style(context, size: 12, color: c.mutedForeground),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
