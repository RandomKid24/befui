import 'package:flutter/material.dart';

import '../befui/datetime_picker.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  DateTime? at = DateTime.now().add(const Duration(days: 2, hours: 1));

  @override
  Widget build(BuildContext context) => _groups(context, [
    ('Pick a day, then a time', BefDateTimePicker(value: at, onChanged: (d) => setState(() => at = d))),
    (
      '24-hour, 15 minute steps',
      BefDateTimePicker(value: at, hour12: false, minuteStep: 15, onChanged: (d) => setState(() => at = d)),
    ),
  ]);
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
