import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/empty_state.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'With an action',
    BefEmptyState(
      icon: const BefIcon(BefIcons.inbox),
      title: 'No leave requests',
      description: 'When someone on your team applies for leave, it shows up here.',
      action: BefButton(
        label: 'Invite teammate',
        size: BefButtonSize.sm,
        variant: BefButtonVariant.outline,
        onPressed: () {},
      ),
    ),
  ),
  (
    'Without an action',
    const BefEmptyState(
      icon: BefIcon(BefIcons.search),
      title: 'No results',
      description: 'Try a different search.',
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
