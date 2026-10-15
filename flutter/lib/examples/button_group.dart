import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/button_group.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  BefButton b(String l, [BefButtonVariant v = BefButtonVariant.outline]) =>
      BefButton(label: l, variant: v, onPressed: () {});
  return _groups(context, [
    ('Outline', BefButtonGroup(children: [b('Day'), b('Week'), b('Month')])),
    (
      'Secondary',
      BefButtonGroup(
        children: [
          b('Left', BefButtonVariant.secondary),
          b('Center', BefButtonVariant.secondary),
          b('Right', BefButtonVariant.secondary),
        ],
      ),
    ),
    ('Two buttons', BefButtonGroup(children: [b('Save'), b('Save and close')])),
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
