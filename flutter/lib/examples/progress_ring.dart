import 'package:flutter/material.dart';

import '../befui/progress_ring.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final c = context.bef;
      return _groups(context, [
        (
          'Sizes',
          Row(
            children: [
              BefProgressRing(value: _v, semanticLabel: 'Upload progress'),
              const SizedBox(width: 32),
              BefProgressRing(
                value: _v / 2,
                size: 72,
                stroke: 6,
                color: c.success,
                semanticLabel: 'Setup progress',
              ),
            ],
          ),
        ),
        (
          'Animates on change',
          GestureDetector(
            onTap: () => set(() => _v = _v == 72 ? 30 : 72),
            child: Text('Tap to animate', style: BefText.style(context, color: c.primary)),
          ),
        ),
      ]);
    },
  );
}

double _v = 72;

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
