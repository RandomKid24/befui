import 'package:flutter/material.dart';

import '../befui/tabs.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final muted = BefText.style(context, size: 13, color: context.bef.mutedForeground);
  Widget text(String t) => Text(t, style: muted);
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      BefTabs(
        tabs: [
          BefTab(label: 'Overview', child: text('Underline tabs, good for page sections.')),
          BefTab(label: 'Leave', child: text('Leave balance and history.')),
          BefTab(label: 'Documents', child: text('Contracts and ID proofs.')),
        ],
      ),
      const SizedBox(height: 32),
      BefTabs(
        variant: BefTabsVariant.pill,
        tabs: [
          BefTab(label: 'Weekly', child: text('Pill tabs, good for toggling a view.')),
          BefTab(label: 'Monthly', child: text('Monthly view.')),
          BefTab(label: 'Yearly', child: text('Yearly view.')),
        ],
      ),
    ],
  );
}
