import 'package:flutter/material.dart';

import '../befui/badge.dart';
import '../befui/card.dart';
import '../befui/progress.dart';
import '../befui/table.dart';
import '../befui/theme.dart';

const _rows = [
  ('INV-204', 'Northwind Traders', 'Aarav Mehta', '12 Oct', 100, 4200, 'Paid'),
  ('INV-205', 'Globex Corp', 'Diya Rao', '18 Oct', 40, 1150, 'Due'),
  ('INV-206', 'Initech', 'Rohan Das', '02 Oct', 0, 8900, 'Overdue'),
  ('INV-207', 'Umbrella Labs', 'Isha Nair', '24 Oct', 100, 3275, 'Paid'),
  ('INV-208', 'Stark Industries', 'Kabir Shah', '28 Oct', 65, 12400, 'Due'),
];

String _usd(int n) => '\$${n.toString().replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ',')}';

Widget example(BuildContext context) {
  final c = context.bef;
  BefBadgeVariant tone(String s) => switch (s) {
    'Paid' => BefBadgeVariant.success,
    'Due' => BefBadgeVariant.warning,
    _ => BefBadgeVariant.danger,
  };
  return ClipRRect(
    borderRadius: BorderRadius.circular(BefRadius.xl),
    child: BefCard(
      child: BefTable(
        columns: const [
          BefTableColumn('Invoice'),
          BefTableColumn('Client'),
          BefTableColumn('Owner'),
          BefTableColumn('Due'),
          BefTableColumn('Collected', width: 128),
          BefTableColumn('Amount', alignRight: true),
          BefTableColumn('Status'),
        ],
        rows: [
          for (final r in _rows)
            [
              Text(r.$1, style: BefText.style(context, size: 13, weight: FontWeight.w500, mono: true)),
              r.$2,
              r.$3,
              Text(r.$4, style: BefText.style(context, size: 13, color: c.mutedForeground)),
              BefProgress(
                value: r.$5.toDouble(),
                tone: r.$5 == 100 ? BefProgressTone.success : BefProgressTone.primary,
              ),
              _usd(r.$6),
              BefBadge(label: r.$7, variant: tone(r.$7), dot: true),
            ],
        ],
      ),
    ),
  );
}
