import 'package:flutter/material.dart';

import '../befui/notification_center.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  var notices = const [
    BefNotice(
      id: '1',
      title: 'Priya requested 2 days leave',
      body: 'Nov 4 to Nov 5, needs your approval',
      time: '2m',
    ),
    BefNotice(
      id: '2',
      title: 'Payroll for October is ready',
      body: 'Review and release before the 28th',
      time: '1h',
    ),
    BefNotice(id: '3', title: 'New hire: Arjun joins Monday', time: '3h', read: true),
  ];

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Tap the bell',
      Row(
        children: [BefNotificationCenter(notices: notices, onChanged: (n) => setState(() => notices = n))],
      ),
    ),
    (
      'All read',
      Row(
        children: [
          BefNotificationCenter(notices: [for (final n in notices) n.markRead()], onChanged: (_) {}),
        ],
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
