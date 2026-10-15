import 'package:flutter/material.dart';

import '../befui/line_chart.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => BefLineChart(
  area: true,
  labels: const ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  format: (n) => '₹${n.round()}L',
  series: [
    const BefLineSeries(name: 'Revenue', data: [42, 48, 45, 58, 63, 61, 72]),
    BefLineSeries(name: 'Payroll', data: const [30, 31, 31, 34, 36, 36, 38], color: context.bef.warning),
    BefLineSeries(name: 'Profit', data: const [12, 17, 14, 24, 27, 25, 34], color: context.bef.success),
  ],
);
