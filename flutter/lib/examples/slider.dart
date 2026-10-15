import 'package:flutter/material.dart';

import '../befui/slider.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final c = context.bef;
      return _groups(context, [
        (
          'With a step and label',
          Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Monthly budget', style: BefText.style(context, weight: FontWeight.w500)),
                  Text('₹${_v.toInt()}k', style: BefText.style(context, color: c.mutedForeground)),
                ],
              ),
              BefSlider(
                value: _v,
                min: 10,
                max: 100,
                step: 5,
                format: (n) => '₹${n.toInt()}k',
                semanticLabel: 'Budget',
                onChanged: (v) => set(() => _v = v),
              ),
            ],
          ),
        ),
        ('Plain 0 to 100', BefSlider(value: _w, onChanged: (v) => set(() => _w = v))),
      ]);
    },
  );
}

double _v = 40, _w = 60;

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
