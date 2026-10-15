import 'package:flutter/material.dart';

import '../befui/tabs.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final muted = BefText.style(context, size: 13, color: context.bef.mutedForeground);
  Widget text(String t) => Text(t, style: muted);
  return _groups(context, [
    (
      'Underline, for page sections',
      BefTabs(
        tabs: [
          BefTab(label: 'Overview', child: text('Underline tabs, good for page sections.')),
          BefTab(label: 'Leave', child: text('Leave balance and history.')),
          BefTab(label: 'Documents', child: text('Contracts and ID proofs.')),
        ],
      ),
    ),
    (
      'Pill, for toggling a view',
      BefTabs(
        variant: BefTabsVariant.pill,
        tabs: [
          BefTab(label: 'Weekly', child: text('Pill tabs, good for toggling a view.')),
          BefTab(label: 'Monthly', child: text('Monthly view.')),
          BefTab(label: 'Yearly', child: text('Yearly view.')),
        ],
      ),
    ),
  ]);
}

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
