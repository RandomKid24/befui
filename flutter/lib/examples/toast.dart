import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/theme.dart';
import '../befui/toast.dart';

Widget example(BuildContext context) {
  BefButton b(String l, VoidCallback f) =>
      BefButton(label: l, variant: BefButtonVariant.outline, onPressed: f);
  return _groups(context, [
    (
      'Tap to show',
      Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          b('Success', () => BefToast.success(context, 'Saved', 'Your changes are live.')),
          b('Error', () => BefToast.error(context, 'Could not save', 'Check your connection.')),
          b('Info', () => BefToast.info(context, 'Heads up')),
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
