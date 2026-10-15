import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/icons.dart';
import '../befui/tooltip.dart';

/// Long-press a button to see its tooltip (hover on desktop).
Widget example(BuildContext context) {
  return Wrap(
    spacing: 12,
    runSpacing: 12,
    children: [
      BefTooltip(
        message: 'Save your work',
        title: 'Save',
        child: BefButton(label: 'Hold me', variant: BefButtonVariant.outline, onPressed: () {}),
      ),
      BefTooltip(
        message: 'Light card style',
        light: true,
        child: BefButton(label: 'Light', variant: BefButtonVariant.outline, onPressed: () {}),
      ),
      BefTooltip(
        message: 'Add a teammate',
        child: BefButton(
          size: BefButtonSize.icon,
          variant: BefButtonVariant.outline,
          onPressed: () {},
          child: const BefIcon(BefIcons.userPlus),
        ),
      ),
    ],
  );
}
