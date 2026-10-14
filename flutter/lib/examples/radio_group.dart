import 'package:flutter/material.dart';

import '../befui/radio_group.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return BefRadioGroup<String>(
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
      );
    },
  );
}

String _plan = 'growth';
