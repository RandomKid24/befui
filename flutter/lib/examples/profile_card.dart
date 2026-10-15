import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/profile_card.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'With stats and actions',
    const BefProfileCard(
      name: 'Aarav Mehta',
      role: 'Senior engineer, Platform',
      location: 'Pune, India',
      status: 'Online',
      stats: [
        BefProfileStat(label: 'Projects', value: '14'),
        BefProfileStat(label: 'Reports', value: '5'),
        BefProfileStat(label: 'Years', value: '4.5'),
      ],
      actions: [
        BefButton(label: 'Message', variant: BefButtonVariant.outline),
        BefButton(label: 'View profile'),
      ],
    ),
  ),
  ('Minimal', const BefProfileCard(name: 'Diya Rao', role: 'Designer')),
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
