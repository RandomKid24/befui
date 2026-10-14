import 'package:flutter/material.dart';

import '../befui/alert.dart';

Widget example(BuildContext context) {
  return const Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      BefAlert(title: 'Payroll locks on the 25th', child: Text('Submit attendance corrections before then.')),
      SizedBox(height: 12),
      BefAlert(variant: BefAlertVariant.success, title: 'Leave approved'),
      SizedBox(height: 12),
      BefAlert(
        variant: BefAlertVariant.warning,
        title: '3 documents expire this month',
        child: Text('Review them in the compliance tab.'),
      ),
      SizedBox(height: 12),
      BefAlert(
        variant: BefAlertVariant.danger,
        title: 'Sync failed',
        child: Text('The biometric device did not respond. Retrying in 5 minutes.'),
      ),
    ],
  );
}
