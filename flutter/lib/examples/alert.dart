import 'package:flutter/material.dart';

import '../befui/alert.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Default',
    const BefAlert(
      title: 'Payroll locks on the 25th',
      child: Text('Submit attendance corrections before then.'),
    ),
  ),
  ('Success', const BefAlert(variant: BefAlertVariant.success, title: 'Leave approved')),
  (
    'Warning',
    const BefAlert(
      variant: BefAlertVariant.warning,
      title: '3 documents expire this month',
      child: Text('Review them in the compliance tab.'),
    ),
  ),
  (
    'Danger',
    const BefAlert(
      variant: BefAlertVariant.danger,
      title: 'Sync failed',
      child: Text('The biometric device did not respond. Retrying in 5 minutes.'),
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
