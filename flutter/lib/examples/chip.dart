import 'package:flutter/material.dart';

import '../befui/chip.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return BefChipGroup(
        value: _v,
        onChanged: (v) => set(() => _v = v),
        options: const ['Engineering', 'Design', 'Sales', 'Finance', 'People Ops'],
      );
    },
  );
}

List<String> _v = ['Engineering'];
