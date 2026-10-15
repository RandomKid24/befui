import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';

Widget _label(BuildContext context, String text) => Padding(
  padding: const EdgeInsets.only(bottom: 10),
  child: Text(text.toUpperCase(), style: BefText.style(context, size: 11, weight: FontWeight.w500, color: context.bef.mutedForeground, letterSpacing: 0.8)),
);

/// Variants, sizes, shapes and states, in labelled groups.
Widget example(BuildContext context) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _label(context, 'Variants'),
      Wrap(
        spacing: 10,
        runSpacing: 10,
        children: [
          BefButton(label: 'Export', leading: const BefIcon(BefIcons.download), onPressed: () {}),
          for (final v in BefButtonVariant.values.skip(1))
            BefButton(label: v.name[0].toUpperCase() + v.name.substring(1), variant: v, onPressed: () {}),
        ],
      ),
      const SizedBox(height: 24),
      _label(context, 'Sizes'),
      Wrap(
        spacing: 10,
        runSpacing: 10,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          BefButton(label: 'Extra small', size: BefButtonSize.xs, onPressed: () {}),
          BefButton(label: 'Small', size: BefButtonSize.sm, onPressed: () {}),
          BefButton(label: 'Medium', onPressed: () {}),
          BefButton(label: 'Large', size: BefButtonSize.lg, onPressed: () {}),
          BefButton(size: BefButtonSize.icon, variant: BefButtonVariant.outline, child: const BefIcon(BefIcons.plus), onPressed: () {}),
        ],
      ),
      const SizedBox(height: 24),
      _label(context, 'Shape'),
      Wrap(
        spacing: 10,
        runSpacing: 10,
        children: [
          BefButton(label: 'Rounded', onPressed: () {}),
          BefButton(label: 'Pill', shape: BefButtonShape.pill, onPressed: () {}),
          BefButton(label: 'Pill soft', shape: BefButtonShape.pill, variant: BefButtonVariant.soft, onPressed: () {}),
        ],
      ),
      const SizedBox(height: 24),
      _label(context, 'States'),
      Wrap(
        spacing: 10,
        runSpacing: 10,
        children: [
          BefButton(label: 'Saving', loading: true, onPressed: () {}),
          const BefButton(label: 'Disabled'),
        ],
      ),
      const SizedBox(height: 24),
      _label(context, 'Full width'),
      BefButton(label: 'Continue', expand: true, size: BefButtonSize.lg, onPressed: () {}),
    ],
  );
}
