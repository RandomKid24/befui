import 'package:flutter/material.dart';

import '../befui/sortable_list.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  var steps = const [
    'Collect timesheets',
    'Verify attendance',
    'Run payroll',
    'Send payslips',
    'File returns',
  ];

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Drag the grip to reorder',
      BefSortableList<String>(
        items: steps,
        idOf: (s) => s,
        onChanged: (n) => setState(() => steps = n),
        itemBuilder: (context, s, i) =>
            Text('${i + 1}.  $s', style: BefText.style(context, size: 13, weight: FontWeight.w500)),
      ),
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
