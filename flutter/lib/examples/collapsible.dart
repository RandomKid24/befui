import 'package:flutter/material.dart';

import '../befui/collapsible.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  return Container(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    decoration: BoxDecoration(
      color: c.card,
      borderRadius: BorderRadius.circular(BefRadius.xl),
      border: Border.all(color: c.border),
    ),
    child: const BefCollapsible(
      title: 'Show advanced options',
      initiallyOpen: true,
      child: Text(
        'Delegate approvals, set a carry-over cap and choose who is notified when a request is rejected.',
      ),
    ),
  );
}
