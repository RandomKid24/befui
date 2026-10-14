import 'package:flutter/material.dart';

import '../befui/tag_input.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) =>
        BefTagInput(value: _v, placeholder: 'Add skills, press Enter', onChanged: (v) => set(() => _v = v)),
  );
}

List<String> _v = ['Design', 'Remote'];
