import 'package:flutter/material.dart';

import 'card.dart';
import 'icons.dart';
import 'theme.dart';

/// A metric: a label, a big value, the change since last period, and an optional sparkline on the right.
class BefStatCard extends StatelessWidget {
  const BefStatCard({
    super.key,
    required this.label,
    required this.value,
    this.delta,
    this.deltaLabel = 'vs last month',
    this.icon,
    this.chart,
  });
  final String label;
  final String value;

  /// Percent change: positive is green, negative red.
  final double? delta;
  final String deltaLabel;
  final Widget? icon;
  final Widget? chart;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final up = (delta ?? 0) >= 0;
    return BefCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: BefText.style(context, size: 13, weight: FontWeight.w500, color: c.mutedForeground),
              ),
              if (icon != null)
                IconTheme.merge(
                  data: IconThemeData(size: 16, color: c.mutedForeground),
                  child: icon!,
                ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      value,
                      style: BefText.style(
                        context,
                        size: 24,
                        weight: FontWeight.w600,
                        height: 1,
                        letterSpacing: -0.4,
                      ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                    ),
                    if (delta != null) ...[
                      const SizedBox(height: 4),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          BefIcon(
                            up ? BefIcons.arrowUpRight : BefIcons.arrowDownRight,
                            size: 14,
                            color: up ? c.success : c.destructive,
                          ),
                          Text(
                            '${delta!.abs()}%',
                            style: BefText.style(
                              context,
                              size: 12,
                              weight: FontWeight.w500,
                              color: up ? c.success : c.destructive,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Flexible(
                            child: Text(
                              deltaLabel,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: BefText.style(context, size: 12, color: c.mutedForeground),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              if (chart != null) SizedBox(width: 80, height: 40, child: chart),
            ],
          ),
        ],
      ),
    );
  }
}
