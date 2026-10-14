import 'package:flutter/material.dart';

import '../befui/switch.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BefSwitch(value: _a, label: 'Auto-approve short leaves', onChanged: (v) => set(() => _a = v)),
          const SizedBox(height: 12),
          BefSwitch(value: _b, label: 'Weekly digest', onChanged: (v) => set(() => _b = v)),
          const SizedBox(height: 12),
          const BefSwitch(value: false, label: 'Disabled'),
        ],
      );
    },
  );
}

bool _a = true, _b = false;
