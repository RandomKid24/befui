import 'package:flutter/material.dart';

import '../befui/copy_button.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  Widget line(String cmd) => Container(
    padding: const EdgeInsets.fromLTRB(12, 6, 6, 6),
    decoration: BoxDecoration(
      color: c.muted,
      borderRadius: BorderRadius.circular(BefRadius.lg),
      border: Border.all(color: c.border),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(cmd, style: BefText.style(context, mono: true)),
        const SizedBox(width: 8),
        BefCopyButton(value: cmd),
      ],
    ),
  );
  return _groups(context, [
    ('Next to a command', line('npm i clsx tailwind-merge')),
    ('Alone', const BefCopyButton(value: 'ORDER-2041')),
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
