import 'package:flutter/material.dart';

import '../befui/calendar.dart';
import '../befui/date_picker.dart';
import '../befui/label.dart';

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
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        BefField(
          label: 'Joining date',
          hint: 'Clear it with the x.',
          child: BefDatePicker(value: joined, onChanged: (d) => setState(() => joined = d), clearable: true),
        ),
        const SizedBox(height: 16),
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
      ],
    );
  }
}
