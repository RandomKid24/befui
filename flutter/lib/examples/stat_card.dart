import 'package:flutter/material.dart';

import '../befui/charts.dart';
import '../befui/icons.dart';
import '../befui/stat_card.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      BefStatCard(
        label: 'Headcount',
        value: '142',
        delta: 4.2,
        icon: const BefIcon(BefIcons.users),
        chart: const BefSparkline(data: [3, 4, 4, 5, 6, 6, 8, 9]),
      ),
      const SizedBox(height: 16),
      BefStatCard(
        label: 'Revenue',
        value: '₹48.2L',
        delta: 12.5,
        icon: const BefIcon(BefIcons.indianRupee),
        chart: BefSparkline(data: const [2, 3, 2.5, 4, 5, 4.6, 6, 7], color: c.success),
      ),
      const SizedBox(height: 16),
      BefStatCard(
        label: 'Open leads',
        value: '64',
        delta: -3.1,
        icon: const BefIcon(BefIcons.megaphone),
        chart: BefSparkline(data: const [8, 7, 7.5, 6, 6.2, 5, 5.4, 4], color: c.destructive),
      ),
    ],
  );
}
