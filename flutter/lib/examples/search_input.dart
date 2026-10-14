import 'package:flutter/material.dart';

import '../befui/search_input.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) =>
        BefSearchInput(value: _v, placeholder: 'Search people', onChanged: (v) => set(() => _v = v)),
  );
}

String _v = '';
