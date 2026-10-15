import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/input.dart';
import '../befui/popover.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return BefPopover(
    content: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Dimensions', style: BefText.style(context, weight: FontWeight.w600)),
        const SizedBox(height: 4),
        Text('Set the size of the layer.', style: BefText.style(context, size: 13, color: c.mutedForeground)),
        const SizedBox(height: 12),
        const BefInput(initialValue: '100%', placeholder: 'Width'),
      ],
    ),
    child: IgnorePointer(
      child: BefButton(label: 'Open popover', variant: BefButtonVariant.outline, onPressed: () {}),
    ),
  );
}
