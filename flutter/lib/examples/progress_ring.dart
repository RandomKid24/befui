import 'package:flutter/material.dart';

import '../befui/progress_ring.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final c = context.bef;
      return Row(
        mainAxisSize: MainAxisSize.min,
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
          const SizedBox(width: 24),
          GestureDetector(
            onTap: () => set(() => _v = _v == 72 ? 30 : 72),
            child: Text('Animate', style: BefText.style(context, color: c.primary)),
          ),
        ],
      );
    },
  );
}

double _v = 72;
