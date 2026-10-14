import 'package:flutter/material.dart';

import '../befui/skeleton.dart';

Widget example(BuildContext context) {
  return const Row(
    children: [
      BefSkeleton(height: 40, circle: true),
      SizedBox(width: 12),
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BefSkeleton(width: 160, height: 12),
          SizedBox(height: 8),
          BefSkeleton(width: 96, height: 12),
        ],
      ),
    ],
  );
}
