import 'package:flutter/material.dart';

import '../befui/marquee.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => BefMarquee(
  children: [
    for (final n in ['Northwind', 'Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'])
      Text(
        n,
        style: BefText.style(context, size: 18, weight: FontWeight.w600, color: context.bef.mutedForeground),
      ),
  ],
);
