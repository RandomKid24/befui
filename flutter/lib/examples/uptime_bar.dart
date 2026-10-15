import 'package:flutter/material.dart';

import '../befui/uptime_bar.dart';

List<BefUptimeDay> _days(Map<int, BefUptimeStatus> bad) => [
  for (var i = 0; i < 60; i++)
    BefUptimeDay(
      date: '${60 - i} days ago',
      status: bad[i] ?? BefUptimeStatus.up,
      note: bad[i] == BefUptimeStatus.down ? 'Outage' : (bad[i] == null ? null : 'Slow responses'),
    ),
];

Widget example(BuildContext context) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      BefUptimeBar(name: 'API', days: _days({14: BefUptimeStatus.degraded, 41: BefUptimeStatus.down})),
      const SizedBox(height: 24),
      BefUptimeBar(
        name: 'Dashboard',
        days: _days({
          22: BefUptimeStatus.degraded,
          23: BefUptimeStatus.degraded,
          58: BefUptimeStatus.degraded,
        }),
      ),
      const SizedBox(height: 24),
      BefUptimeBar(name: 'Webhooks', days: _days({})),
    ],
  );
}
