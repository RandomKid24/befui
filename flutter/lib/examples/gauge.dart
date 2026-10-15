import 'package:flutter/material.dart';

import '../befui/gauge.dart';
import '../befui/slider.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  double v = 72;

  @override
  Widget build(BuildContext context) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      BefGauge(value: v, label: 'Team engagement'),
      const SizedBox(height: 16),
      BefSlider(value: v, onChanged: (x) => setState(() => v = x), min: 0, max: 100),
    ],
  );
}
