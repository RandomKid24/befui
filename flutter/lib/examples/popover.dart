import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/input.dart';
import '../befui/popover.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return _groups(context, [
    (
      'Tap the button',
      BefPopover(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Dimensions', style: BefText.style(context, weight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text(
              'Set the size of the layer.',
              style: BefText.style(context, size: 13, color: c.mutedForeground),
            ),
            const SizedBox(height: 12),
            const BefInput(initialValue: '100%', placeholder: 'Width'),
          ],
        ),
        child: IgnorePointer(
          child: BefButton(label: 'Open popover', variant: BefButtonVariant.outline, onPressed: () {}),
        ),
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
