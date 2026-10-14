import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/theme.dart';
import '../befui/toggle.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final c = context.bef;
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          BefToggle(
            pressed: _a,
            onChanged: (v) => set(() => _a = v),
            size: BefToggleSize.icon,
            semanticLabel: 'Favourite',
            child: BefIcon(BefIcons.heart, fill: _a ? c.accentForeground : null),
          ),
          const SizedBox(width: 8),
          BefToggle(
            variant: BefToggleVariant.outline,
            pressed: _b,
            onChanged: (v) => set(() => _b = v),
            size: BefToggleSize.icon,
            semanticLabel: 'Star',
            child: BefIcon(BefIcons.star, fill: _b ? c.accentForeground : null),
          ),
          const SizedBox(width: 8),
          BefToggle(
            variant: BefToggleVariant.outline,
            pressed: _c,
            onChanged: (v) => set(() => _c = v),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                BefIcon(BefIcons.bookmark, fill: _c ? c.accentForeground : null),
                const SizedBox(width: 8),
                const Text('Save'),
              ],
            ),
          ),
        ],
      );
    },
  );
}

bool _a = true, _b = false, _c = false;
