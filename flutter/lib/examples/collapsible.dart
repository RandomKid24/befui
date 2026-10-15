import 'package:flutter/material.dart';

import '../befui/collapsible.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  Widget box(Widget child) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    decoration: BoxDecoration(
      color: c.card,
      borderRadius: BorderRadius.circular(BefRadius.xl),
      border: Border.all(color: c.border),
    ),
    child: child,
  );
  return _groups(context, [
    (
      'Open',
      box(
        const BefCollapsible(
          title: 'Show advanced options',
          initiallyOpen: true,
          child: Text(
            'Delegate approvals, set a carry-over cap and choose who is notified when a request is rejected.',
          ),
        ),
      ),
    ),
    (
      'Closed',
      box(
        const BefCollapsible(
          title: 'Show notification rules',
          child: Text('Email, push and in-app rules live here.'),
        ),
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
