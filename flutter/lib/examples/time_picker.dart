import 'package:flutter/material.dart';

import '../befui/theme.dart';
import '../befui/time_picker.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  String a = '09:30', b = '17:45';

  @override
  Widget build(BuildContext context) {
    return _groups(context, [
      (
        'Shift starts, 12-hour',
        BefTimePicker(value: a, onChanged: (v) => setState(() => a = v), minuteStep: 15),
      ),
      (
        'Shift ends, 24-hour',
        BefTimePicker(value: b, onChanged: (v) => setState(() => b = v), hour12: false, minuteStep: 15),
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
