import 'package:flutter/material.dart';

import '../befui/product_card.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  bool wished = false;

  @override
  Widget build(BuildContext context) => BefProductCard(
    name: 'Merino crew sweater',
    category: 'Knitwear',
    price: 2499,
    compareAt: 3299,
    rating: 4,
    wished: wished,
    onWish: (v) => setState(() => wished = v),
    onTap: () {},
  );
}
