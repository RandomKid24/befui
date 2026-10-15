import 'package:flutter/material.dart';

import '../befui/calendar.dart';
import '../befui/card.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  DateTime? day = befDay(DateTime.now());
  BefDateRange? range;

  @override
  Widget build(BuildContext context) {
    final today = befDay(DateTime.now());
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        BefCard(
          padding: const EdgeInsets.all(12),
          child: BefCalendar(selected: day, onSelect: (d) => setState(() => day = d)),
        ),
        const SizedBox(height: 16),
        BefCard(
          padding: const EdgeInsets.all(12),
          child: BefCalendar(
            range: true,
            weekStartsOn: DateTime.monday,
            selectedRange: range,
            onSelectRange: (r) => setState(() => range = r),
            disabled: (d) => d.isBefore(today.subtract(const Duration(days: 1))),
          ),
        ),
      ],
    );
  }
}
