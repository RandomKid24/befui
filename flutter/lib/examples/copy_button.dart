import 'package:flutter/material.dart';

import '../befui/copy_button.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  const cmd = 'npm i clsx tailwind-merge';
  return Container(
    padding: const EdgeInsets.fromLTRB(12, 6, 6, 6),
    decoration: BoxDecoration(
      color: c.muted,
      borderRadius: BorderRadius.circular(BefRadius.lg),
      border: Border.all(color: c.border),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(cmd, style: BefText.style(context, mono: true)),
        const SizedBox(width: 8),
        const BefCopyButton(value: cmd),
      ],
    ),
  );
}
