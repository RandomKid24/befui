import 'package:flutter/material.dart';

import '../befui/activity_feed.dart';
import '../befui/icons.dart';

Widget example(BuildContext context) {
  final now = DateTime.now();
  DateTime ago(double h) => now.subtract(Duration(minutes: (h * 60).round()));
  return BefActivityFeed(
    now: now,
    items: [
      BefActivity(
        actor: 'Aarav Mehta',
        action: 'commented on',
        target: 'Leave policy 2025',
        at: ago(0.2),
        icon: BefIcons.messageSquare,
        detail: '“Carry-forward cap should be 12 days, not 10.”',
      ),
      BefActivity(
        actor: 'Diya Rao',
        action: 'uploaded',
        target: 'offer-letter-v3.pdf',
        at: ago(2),
        icon: BefIcons.file,
        detail: '248 KB · PDF',
      ),
      BefActivity(
        actor: 'Isha Nair',
        action: 'added',
        target: 'Kabir Shah to Engineering',
        at: ago(5),
        icon: BefIcons.userPlus,
      ),
      BefActivity(
        actor: 'Rohan Das',
        action: 'merged',
        target: 'Payroll export fixes',
        at: ago(27),
        icon: BefIcons.gitMerge,
      ),
      BefActivity(actor: 'Meera Iyer', action: 'approved', target: 'September expense report', at: ago(30)),
    ],
  );
}
