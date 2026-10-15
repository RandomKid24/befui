import 'package:flutter/material.dart';

import '../befui/gauge.dart';
import '../befui/slider.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  double v = 72;

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Follows the value',
      Column(
        children: [
          Center(
            child: BefGauge(value: v, label: 'Team engagement'),
          ),
          const SizedBox(height: 16),
          BefSlider(value: v, onChanged: (x) => setState(() => v = x), min: 0, max: 100),
        ],
      ),
    ),
    (
      'Fixed tone',
      const Center(
        child: BefGauge(value: 60, size: 160, tone: BefGaugeTone.primary, label: 'Fixed'),
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
