import 'package:flutter/material.dart';

import '../befui/input.dart';
import '../befui/label.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'With a hint',
    const BefField(
      label: 'Email',
      hint: 'We never share it.',
      child: BefInput(placeholder: 'you@example.com'),
    ),
  ),
  (
    'Required, with an error',
    const BefField(
      label: 'Password',
      required: true,
      error: 'Must be at least 8 characters',
      child: BefInput(obscureText: true, initialValue: 'abc', invalid: true),
    ),
  ),
  ('Standalone label', const BefLabel('Display name')),
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
