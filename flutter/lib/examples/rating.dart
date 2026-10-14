import 'package:flutter/material.dart';

import '../befui/rating.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          BefRating(value: _v, onChanged: (v) => set(() => _v = v)),
          const SizedBox(height: 12),
          const BefRating(value: 4, size: 16),
        ],
      );
    },
  );
}

int _v = 3;
