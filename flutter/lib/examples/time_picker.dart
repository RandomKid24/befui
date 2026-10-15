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
    final c = context.bef;
    Widget label(String t) => Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(t, style: BefText.style(context, size: 12, color: c.mutedForeground)),
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        label('Shift starts (12-hour)'),
        BefTimePicker(value: a, onChanged: (v) => setState(() => a = v), minuteStep: 15),
        const SizedBox(height: 16),
        label('Shift ends (24-hour)'),
        BefTimePicker(value: b, onChanged: (v) => setState(() => b = v), hour12: false, minuteStep: 15),
      ],
    );
  }
}
