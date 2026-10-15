import 'package:flutter/material.dart';

import '../befui/notification_center.dart';

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
  Widget build(BuildContext context) =>
      BefNotificationCenter(notices: notices, onChanged: (n) => setState(() => notices = n));
}
