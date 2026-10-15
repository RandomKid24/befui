import 'package:flutter/material.dart';

import '../befui/select.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          BefSelect<String>(
            value: _plan,
            placeholder: 'Pick a plan',
            onChanged: (v) => set(() => _plan = v),
            options: const [
              BefSelectOption(value: 'free', label: 'Free'),
              BefSelectOption(value: 'pro', label: 'Pro'),
              BefSelectOption(value: 'team', label: 'Team'),
            ],
          ),
          const SizedBox(height: 12),
          BefSelect<String>(
            value: null,
            placeholder: 'Nothing chosen yet',
            onChanged: (_) {},
            options: const [BefSelectOption(value: 'a', label: 'A')],
          ),
        ],
      );
    },
  );
}

String _plan = 'pro';
