import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/coupon_input.dart';
import '../befui/order_summary.dart';
import '../befui/theme.dart';

const _lines = [
  BefOrderLine(id: '1', name: 'Wireless keyboard', detail: 'Graphite · UK layout', qty: 1, price: 3499),
  BefOrderLine(id: '2', name: 'Noise-cancelling headphones', detail: 'Midnight blue', qty: 2, price: 8999),
  BefOrderLine(id: '3', name: 'Standing desk mat', qty: 1, price: 1299),
];

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  String? code;

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Cart with a coupon, free shipping and 18% tax',
      BefOrderSummary(
        lines: _lines,
        discount: code == null ? 0 : 250,
        shipping: 0,
        taxRate: 0.18,
        action: BefButton(label: 'Place order', size: BefButtonSize.lg, expand: true, onPressed: () {}),
        child: BefCouponInput(
          applied: code,
          hint: code == null ? null : 'You save ₹250',
          onApply: (c) async {
            if (c != 'FESTIVE250') return false;
            setState(() => code = c);
            return true;
          },
          onRemove: () => setState(() => code = null),
        ),
      ),
    ),
    (
      'Single item, paid shipping',
      const BefOrderSummary(
        title: 'Your order',
        lines: [BefOrderLine(id: '1', name: 'Standing desk mat', qty: 1, price: 1299)],
        shipping: 99,
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
