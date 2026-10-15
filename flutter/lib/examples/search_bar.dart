import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/search_bar.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final items = [
    for (final l in [
      'Employee directory',
      'Leave approvals',
      'Payroll run',
      'Attendance report',
      'Org chart',
      'Recruitment pipeline',
      'Performance reviews',
    ])
      BefSearchItem(id: l, label: l, hint: 'Page', icon: BefIcons.file),
  ];
  return _groups(context, [
    (
      'Type "pay" or "re"; empty shows recent',
      BefSearchBar(items: items, recent: items.take(3).toList(), placeholder: 'Search pages'),
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
