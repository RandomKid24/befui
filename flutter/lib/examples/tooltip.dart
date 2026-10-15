import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';
import '../befui/tooltip.dart';

/// Long-press a button to see its tooltip (hover on desktop).
Widget example(BuildContext context) {
  return _groups(context, [
    (
      'Dark, with a title',
      BefTooltip(
        message: 'Save your work',
        title: 'Save',
        child: BefButton(label: 'Hold me', variant: BefButtonVariant.outline, onPressed: () {}),
      ),
    ),
    (
      'Light card style',
      BefTooltip(
        message: 'Light card style',
        light: true,
        child: BefButton(label: 'Light', variant: BefButtonVariant.outline, onPressed: () {}),
      ),
    ),
    (
      'On an icon button',
      BefTooltip(
        message: 'Add a teammate',
        child: BefButton(
          size: BefButtonSize.icon,
          variant: BefButtonVariant.outline,
          onPressed: () {},
          child: const BefIcon(BefIcons.userPlus),
        ),
      ),
    ),
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
