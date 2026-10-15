import 'package:flutter/material.dart';

import '../befui/product_card.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  bool wished = false;

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'On sale, with wishlist',
      BefProductCard(
        name: 'Merino crew sweater',
        category: 'Knitwear',
        price: 2499,
        compareAt: 3299,
        rating: 4,
        wished: wished,
        onWish: (v) => setState(() => wished = v),
        onTap: () {},
      ),
    ),
    ('Full price', BefProductCard(name: 'Canvas tote', category: 'Bags', price: 1299, onTap: () {})),
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
