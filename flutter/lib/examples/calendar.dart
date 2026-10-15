import 'package:flutter/material.dart';

import '../befui/calendar.dart';
import '../befui/card.dart';
import '../befui/theme.dart';

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
    return _groups(context, [
      (
        'Single day',
        BefCard(
          padding: const EdgeInsets.all(12),
          child: BefCalendar(selected: day, onSelect: (d) => setState(() => day = d)),
        ),
      ),
      (
        'Range, Monday first, past disabled',
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
