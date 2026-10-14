import 'package:flutter/material.dart';

import '../befui/fab.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return Container(
    height: 288,
    clipBehavior: Clip.antiAlias,
    decoration: BoxDecoration(
      color: c.muted.withValues(alpha: 0.4),
      borderRadius: BorderRadius.circular(BefRadius.xl),
      border: Border.all(color: c.border),
    ),
    child: Stack(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Text(
            'Tap the button for a speed dial. The second button is the extended form.',
            style: BefText.style(context, size: 12, color: c.mutedForeground),
          ),
        ),
        Positioned(
          right: 16,
          bottom: 16,
          child: BefFab(
            actions: [
              BefFabAction(label: 'New employee', icon: const BefIcon(BefIcons.users), onPressed: () {}),
              BefFabAction(label: 'New document', icon: const BefIcon(BefIcons.file), onPressed: () {}),
              BefFabAction(label: 'Quick note', icon: const BefIcon(BefIcons.edit), onPressed: () {}),
            ],
          ),
        ),
        Positioned(
          left: 16,
          bottom: 16,
          child: BefFab(label: 'Compose', icon: const BefIcon(BefIcons.plus), onPressed: () {}),
        ),
      ],
    ),
  );
}
