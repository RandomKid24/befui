import 'package:flutter/material.dart';

import '../befui/currency_input.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => _groups(context, [
      (
        'Rupees, grouped as you type',
        Column(
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
      ),
    ]),
  );
}

int? _v = 125000;

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
