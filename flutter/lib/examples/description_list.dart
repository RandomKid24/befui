import 'package:flutter/material.dart';

import '../befui/badge.dart';
import '../befui/description_list.dart';

Widget example(BuildContext context) {
  return const BefDescriptionList(
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
  );
}
