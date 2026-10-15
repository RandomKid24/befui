import 'package:flutter/material.dart';

import '../befui/radio_group.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => _groups(context, [
      (
        'Plans, one disabled',
        BefRadioGroup<String>(
          value: _plan,
          onChanged: (v) => set(() => _plan = v),
          options: const [
            BefRadioOption(value: 'starter', label: 'Starter', description: 'Up to 25 employees'),
            BefRadioOption(value: 'growth', label: 'Growth', description: 'Payroll and attendance included'),
            BefRadioOption(
              value: 'enterprise',
              label: 'Enterprise',
              description: 'SSO and audit logs',
              disabled: true,
            ),
          ],
        ),
      ),
    ]),
  );
}

String _plan = 'growth';

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
