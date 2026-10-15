import 'package:flutter/material.dart';

import '../befui/badge.dart';
import '../befui/description_list.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Bordered',
    const BefDescriptionList(
      bordered: true,
      items: [
        BefDescriptionItem(label: 'Customer', value: 'Northwind Traders'),
        BefDescriptionItem(
          label: 'Status',
          value: Align(
            alignment: Alignment.centerLeft,
            child: BefBadge(label: 'Active', variant: BefBadgeVariant.success, dot: true),
          ),
        ),
        BefDescriptionItem(label: 'Plan', value: 'Business, yearly'),
        BefDescriptionItem(label: 'Renews on', value: '14 Jan 2027'),
        BefDescriptionItem(label: 'Billing email', value: 'accounts@northwind.in'),
        BefDescriptionItem(label: 'GSTIN', value: '29ABCDE1234F1Z5'),
        BefDescriptionItem(
          label: 'Notes',
          value: 'Wants invoices sent to two people, reminder 7 days before renewal.',
          wide: true,
        ),
      ],
    ),
  ),
  (
    'Plain',
    const BefDescriptionList(
      items: [
        BefDescriptionItem(label: 'Order', value: '#2041'),
        BefDescriptionItem(label: 'Placed', value: '10 Oct 2026'),
      ],
    ),
  ),
]);

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
