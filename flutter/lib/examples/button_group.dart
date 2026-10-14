import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/button_group.dart';

Widget example(BuildContext context) {
  return BefButtonGroup(
    children: [
      BefButton(label: 'Day', variant: BefButtonVariant.outline, onPressed: () {}),
      BefButton(label: 'Week', variant: BefButtonVariant.outline, onPressed: () {}),
      BefButton(label: 'Month', variant: BefButtonVariant.outline, onPressed: () {}),
    ],
  );
}
