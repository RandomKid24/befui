import 'package:flutter/material.dart';

import '../befui/slider.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final c = context.bef;
      return Column(
        mainAxisSize: MainAxisSize.min,
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
      );
    },
  );
}

double _v = 40;
