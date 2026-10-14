import 'package:flutter/material.dart';

import '../befui/spinner.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      BefSpinner(size: 12, color: c.primary),
      const SizedBox(width: 20),
      BefSpinner(color: c.primary),
      const SizedBox(width: 20),
      BefSpinner(size: 24, strokeWidth: 3, color: c.primary),
    ],
  );
}
