import 'package:flutter/material.dart';

import '../befui/uptime_bar.dart';
import '../befui/theme.dart';

List<BefUptimeDay> _days(Map<int, BefUptimeStatus> bad) => [
  for (var i = 0; i < 60; i++)
    BefUptimeDay(
      date: '${60 - i} days ago',
      status: bad[i] ?? BefUptimeStatus.up,
      note: bad[i] == BefUptimeStatus.down ? 'Outage' : (bad[i] == null ? null : 'Slow responses'),
    ),
];

Widget example(BuildContext context) {
  return _groups(context, [
    (
      'With an outage',
      BefUptimeBar(name: 'API', days: _days({14: BefUptimeStatus.degraded, 41: BefUptimeStatus.down})),
    ),
    (
      'Some slow days',
      BefUptimeBar(
        name: 'Dashboard',
        days: _days({
          22: BefUptimeStatus.degraded,
          23: BefUptimeStatus.degraded,
          58: BefUptimeStatus.degraded,
        }),
      ),
    ),
    ('All up', BefUptimeBar(name: 'Webhooks', days: _days({}))),
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
