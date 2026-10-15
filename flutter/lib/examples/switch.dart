import 'package:flutter/material.dart';

import '../befui/switch.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => _groups(context, [
      (
        'Interactive',
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BefSwitch(value: _a, label: 'Auto-approve short leaves', onChanged: (v) => set(() => _a = v)),
            const SizedBox(height: 12),
            BefSwitch(value: _b, label: 'Weekly digest', onChanged: (v) => set(() => _b = v)),
          ],
        ),
      ),
      (
        'Disabled',
        const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BefSwitch(value: false, label: 'Off'),
            SizedBox(height: 12),
            BefSwitch(value: true, label: 'On'),
          ],
        ),
      ),
    ]),
  );
}

bool _a = true, _b = false;

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
