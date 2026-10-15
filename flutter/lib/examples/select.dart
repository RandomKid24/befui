import 'package:flutter/material.dart';

import '../befui/select.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => _groups(context, [
      (
        'With a value',
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
      ),
      (
        'Empty',
        BefSelect<String>(
          value: null,
          placeholder: 'Nothing chosen yet',
          onChanged: (_) {},
          options: const [BefSelectOption(value: 'a', label: 'A')],
        ),
      ),
    ]),
  );
}

String _plan = 'pro';

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
