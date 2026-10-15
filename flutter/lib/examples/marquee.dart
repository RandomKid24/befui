import 'package:flutter/material.dart';

import '../befui/marquee.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  Widget names(List<String> l) => BefMarquee(
    children: [
      for (final n in l)
        Text(
          n,
          style: BefText.style(
            context,
            size: 18,
            weight: FontWeight.w600,
            color: context.bef.mutedForeground,
          ),
        ),
    ],
  );
  return _groups(context, [
    ('Left', names(['Northwind', 'Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'])),
    (
      'Right, slower',
      BefMarquee(
        speed: 45,
        reverse: true,
        children: [
          for (final n in ['Stripe', 'Linear', 'Vercel', 'Notion', 'Figma', 'Slack'])
            Text(
              n,
              style: BefText.style(
                context,
                size: 18,
                weight: FontWeight.w600,
                color: context.bef.mutedForeground,
              ),
            ),
        ],
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
