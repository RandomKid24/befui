import 'package:flutter/material.dart';

import '../befui/inline_edit.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => SizedBox(
      width: 256,
      child: BefInlineEdit(value: _name, onSaved: (v) => set(() => _name = v)),
    ),
  );
}

String _name = 'Q4 hiring plan';
