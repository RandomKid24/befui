import 'package:flutter/material.dart';

import '../befui/spinner.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return _groups(context, [
    (
      'Sizes',
      Row(
        children: [
          BefSpinner(size: 12, color: c.primary),
          const SizedBox(width: 20),
          BefSpinner(color: c.primary),
          const SizedBox(width: 20),
          BefSpinner(size: 24, strokeWidth: 3, color: c.primary),
        ],
      ),
    ),
    (
      'Colours',
      Row(
        children: [
          BefSpinner(size: 20, color: c.success),
          const SizedBox(width: 20),
          BefSpinner(size: 20, color: c.warning),
          const SizedBox(width: 20),
          BefSpinner(size: 20, color: c.destructive),
          const SizedBox(width: 20),
          BefSpinner(size: 20, color: c.mutedForeground),
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
