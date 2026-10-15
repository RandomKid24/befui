import 'package:flutter/material.dart';

import '../befui/week_strip.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  DateTime day = DateTime.now();

  @override
  Widget build(BuildContext context) {
    final t = DateTime(day.year, day.month, day.day);
    return BefWeekStrip(
      value: day,
      onChanged: (d) => setState(() => day = d),
      marks: {
        t.add(const Duration(days: 1)): 1,
        t.add(const Duration(days: 2)): 3,
        t.subtract(const Duration(days: 1)): 2,
      },
    );
  }
}
