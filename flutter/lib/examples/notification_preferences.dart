import 'package:flutter/material.dart';

import '../befui/notification_preferences.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  Map<String, List<String>> v = {
    'leave': ['email', 'push', 'app'],
    'payroll': ['email'],
    'mention': ['push', 'app'],
    'security': ['email', 'sms', 'push', 'app'],
  };

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'What to be told about, and where',
      BefNotificationPreferences(
        value: v,
        onChanged: (n) => setState(() => v = n),
        channels: const [
          BefPrefChannel(id: 'email', label: 'Email'),
          BefPrefChannel(id: 'push', label: 'Push'),
          BefPrefChannel(id: 'sms', label: 'SMS'),
          BefPrefChannel(id: 'app', label: 'In-app'),
        ],
        events: const [
          BefPrefEvent(id: 'leave', label: 'Leave requests', description: 'Submitted, approved or rejected'),
          BefPrefEvent(id: 'payroll', label: 'Payslips', description: 'When a new payslip is ready'),
          BefPrefEvent(id: 'mention', label: 'Mentions and comments'),
          BefPrefEvent(
            id: 'security',
            label: 'Security alerts',
            description: 'New sign-ins and password changes',
          ),
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
