import 'package:flutter/material.dart';

import '../befui/status_dot.dart';

Widget example(BuildContext context) {
  return const Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      BefStatusDot(pulse: true, label: 'Live'),
      SizedBox(height: 12),
      BefStatusDot(tone: BefStatusTone.warning, label: 'Degraded'),
      SizedBox(height: 12),
      BefStatusDot(tone: BefStatusTone.danger, label: 'Offline'),
      SizedBox(height: 12),
      BefStatusDot(tone: BefStatusTone.neutral, label: 'Paused'),
    ],
  );
}
