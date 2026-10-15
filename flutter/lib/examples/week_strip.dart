import 'package:flutter/material.dart';

import '../befui/week_strip.dart';
import '../befui/theme.dart';

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
    return _groups(context, [
      (
        'With dots for busy days',
        BefWeekStrip(
          value: day,
          onChanged: (d) => setState(() => day = d),
          marks: {
            t.add(const Duration(days: 1)): 1,
            t.add(const Duration(days: 2)): 3,
            t.subtract(const Duration(days: 1)): 2,
          },
        ),
      ),
      (
        'Starts on Sunday, no past days',
        BefWeekStrip(
          value: day,
          onChanged: (d) => setState(() => day = d),
          weekStartsOn: DateTime.sunday,
          min: t,
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
