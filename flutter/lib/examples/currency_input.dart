import 'package:flutter/material.dart';

import '../befui/currency_input.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return SizedBox(
        width: 240,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BefCurrencyInput(value: _v, semanticLabel: 'Salary', onChanged: (v) => set(() => _v = v)),
            const SizedBox(height: 8),
            Text(
              'Value: ${_v ?? 'empty'}',
              style: BefText.style(context, size: 12, color: context.bef.mutedForeground),
            ),
          ],
        ),
      );
    },
  );
}

int? _v = 125000;
