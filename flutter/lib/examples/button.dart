import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/icons.dart';

/// Every variant, size and state.
Widget example(BuildContext context) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Wrap(
        spacing: 12,
        runSpacing: 12,
        children: [
          BefButton(
            label: 'Export',
            leading: const BefIcon(BefIcons.download),
            onPressed: () {},
          ),
          for (final v in BefButtonVariant.values.skip(1))
            BefButton(
              label: v.name[0].toUpperCase() + v.name.substring(1),
              variant: v,
              onPressed: () {},
            ),
        ],
      ),
      const SizedBox(height: 20),
      Wrap(
        spacing: 12,
        runSpacing: 12,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          BefButton(
            label: 'Extra small',
            size: BefButtonSize.xs,
            onPressed: () {},
          ),
          BefButton(label: 'Small', size: BefButtonSize.sm, onPressed: () {}),
          BefButton(label: 'Medium', onPressed: () {}),
          BefButton(label: 'Large', size: BefButtonSize.lg, onPressed: () {}),
          BefButton(
            size: BefButtonSize.icon,
            variant: BefButtonVariant.outline,
            child: const BefIcon(BefIcons.plus),
            onPressed: () {},
          ),
          BefButton(
            label: 'Pill',
            shape: BefButtonShape.pill,
            variant: BefButtonVariant.soft,
            onPressed: () {},
          ),
          BefButton(label: 'Saving', loading: true, onPressed: () {}),
          const BefButton(label: 'Disabled'),
        ],
      ),
    ],
  );
}
