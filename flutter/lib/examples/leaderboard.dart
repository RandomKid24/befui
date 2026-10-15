import 'package:flutter/material.dart';

import '../befui/leaderboard.dart';

Widget example(BuildContext context) {
  return BefLeaderboard(
    format: (n) => '₹${(n / 100000).toStringAsFixed(1)}L',
    items: const [
      BefLeaderboardItem(name: 'Rohan Das', subtitle: 'Enterprise', value: 2450000, delta: 2),
      BefLeaderboardItem(name: 'Diya Rao', subtitle: 'Mid-market', value: 3120000, delta: -1),
      BefLeaderboardItem(name: 'Isha Nair', subtitle: 'Enterprise', value: 2980000, delta: 1),
      BefLeaderboardItem(name: 'Kabir Shah', subtitle: 'SMB', value: 1620000),
      BefLeaderboardItem(name: 'Ananya Kulkarni', subtitle: 'SMB', value: 1240000, delta: -2),
    ],
  );
}
