import 'package:flutter/material.dart';

import '../befui/badge.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Variants',
    const Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        BefBadge(label: 'Default'),
        BefBadge(label: 'Outline', variant: BefBadgeVariant.outline),
        BefBadge(label: 'Primary', variant: BefBadgeVariant.primary),
        BefBadge(label: 'Info', variant: BefBadgeVariant.info),
      ],
    ),
  ),
  (
    'With a status dot',
    const Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        BefBadge(label: 'Active', variant: BefBadgeVariant.success, dot: true),
        BefBadge(label: 'Pending', variant: BefBadgeVariant.warning, dot: true),
        BefBadge(label: 'Failed', variant: BefBadgeVariant.danger, dot: true),
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
