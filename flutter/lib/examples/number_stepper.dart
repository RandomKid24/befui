import 'package:flutter/material.dart';

import '../befui/number_stepper.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) =>
        BefNumberStepper(value: _v, min: 1, max: 10, onChanged: (v) => set(() => _v = v)),
  );
}

int _v = 2;
