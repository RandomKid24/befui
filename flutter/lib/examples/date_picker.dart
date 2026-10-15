import 'package:flutter/material.dart';

import '../befui/calendar.dart';
import '../befui/date_picker.dart';
import '../befui/label.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  DateTime? joined;
  BefDateRange? leave;

  @override
  Widget build(BuildContext context) {
    final today = befDay(DateTime.now());
    return _groups(context, [
      (
        'One date',
        BefField(
          label: 'Joining date',
          hint: 'Clear it with the x.',
          child: BefDatePicker(value: joined, onChanged: (d) => setState(() => joined = d), clearable: true),
        ),
      ),
      (
        'Date range',
        BefField(
          label: 'Leave dates',
          hint: 'Past dates are disabled.',
          child: BefDateRangePicker(
            value: leave,
            onChanged: (r) => setState(() => leave = r),
            disabledDays: (d) => d.isBefore(today),
            clearable: true,
          ),
        ),
      ),
    ]);
  }
}

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
