import 'package:flutter/material.dart';

import '../befui/separator.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return SizedBox(
    width: 256,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('befui', style: BefText.style(context, size: 13, weight: FontWeight.w500)),
        Text('Slim React components.', style: BefText.style(context, size: 13, color: c.mutedForeground)),
        const SizedBox(height: 12),
        const BefSeparator(),
        const SizedBox(height: 12),
        SizedBox(
          height: 20,
          child: Row(
            children: [
              Text('Docs', style: BefText.style(context, size: 13)),
              const SizedBox(width: 12),
              const BefSeparator(vertical: true),
              const SizedBox(width: 12),
              Text('Blocks', style: BefText.style(context, size: 13)),
              const SizedBox(width: 12),
              const BefSeparator(vertical: true),
              const SizedBox(width: 12),
              Text('Source', style: BefText.style(context, size: 13)),
            ],
          ),
        ),
      ],
    ),
  );
}
