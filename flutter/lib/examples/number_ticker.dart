import 'package:flutter/material.dart';

import '../befui/number_ticker.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final muted = BefText.style(context, color: context.bef.mutedForeground);
  Widget stat(Widget n, String label) => Column(
    children: [
      n,
      const SizedBox(height: 4),
      Text(label, style: muted),
    ],
  );
  return Wrap(
    spacing: 40,
    runSpacing: 24,
    alignment: WrapAlignment.center,
    children: [
      stat(const BefNumberTicker(value: 14820), 'Employees onboarded'),
      stat(const BefNumberTicker(value: 98.6, suffix: '%', decimals: 1), 'Payroll accuracy'),
      stat(const BefNumberTicker(value: 4.2, prefix: '₹', suffix: 'Cr', decimals: 1), 'Revenue'),
    ],
  );
}
