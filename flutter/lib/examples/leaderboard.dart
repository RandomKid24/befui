import 'package:flutter/material.dart';

import '../befui/leaderboard.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Sales this quarter',
    BefLeaderboard(
      format: (n) => '₹${(n / 100000).toStringAsFixed(1)}L',
      items: const [
        BefLeaderboardItem(name: 'Rohan Das', subtitle: 'Enterprise', value: 2450000, delta: 2),
        BefLeaderboardItem(name: 'Diya Rao', subtitle: 'Mid-market', value: 3120000, delta: -1),
        BefLeaderboardItem(name: 'Isha Nair', subtitle: 'Enterprise', value: 2980000, delta: 1),
        BefLeaderboardItem(name: 'Kabir Shah', subtitle: 'SMB', value: 1620000),
        BefLeaderboardItem(name: 'Ananya Kulkarni', subtitle: 'SMB', value: 1240000, delta: -2),
      ],
    ),
  ),
]);

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
