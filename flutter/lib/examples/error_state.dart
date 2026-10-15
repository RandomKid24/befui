import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/error_state.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Not found',
    BefErrorState(
      code: '404',
      title: 'Page not found',
      description: 'The page you are looking for was moved or never existed.',
      actions: [
        BefButton(label: 'Go back', variant: BefButtonVariant.outline, onPressed: () {}),
        BefButton(label: 'Home', onPressed: () {}),
      ],
    ),
  ),
  (
    'Server error with retry',
    BefErrorState(
      title: 'We could not load payroll',
      description: 'The server did not respond. Your data is safe. Try again in a moment.',
      actions: [
        BefButton(
          label: 'Try again',
          variant: BefButtonVariant.outline,
          leading: const BefIcon(BefIcons.refresh),
          onPressed: () {},
        ),
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
