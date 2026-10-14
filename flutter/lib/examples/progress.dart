import 'package:flutter/material.dart';

import '../befui/progress.dart';

Widget example(BuildContext context) {
  return const Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      BefProgress(value: 64, semanticLabel: 'Upload progress'),
      SizedBox(height: 16),
      BefProgress(value: 88, tone: BefProgressTone.success, semanticLabel: 'Tasks completed'),
      SizedBox(height: 16),
      BefProgress(value: 42, tone: BefProgressTone.warning, semanticLabel: 'Storage used'),
      SizedBox(height: 16),
      BefProgress(value: 15, tone: BefProgressTone.danger, semanticLabel: 'Battery left'),
    ],
  );
}
