import 'package:flutter/material.dart';

import '../befui/sources.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Source cards',
    BefSourceList(
      sources: [
        BefSource(
          id: '1',
          title: 'Leave policy 2025: carry-forward and encashment',
          site: 'handbook.acme.co',
          onTap: () {},
        ),
        BefSource(id: '2', title: 'Leave FAQ: what lapses on 31 March', site: 'help.acme.co', onTap: () {}),
        BefSource(
          id: '3',
          title: 'HR circular 14: changes to casual leave',
          site: 'intranet.acme.co',
          onTap: () {},
        ),
      ],
    ),
  ),
  (
    'Inline chips',
    Row(
      children: [
        BefCite(n: 1, onTap: () {}),
        BefCite(n: 2, onTap: () {}),
        BefCite(n: 3, onTap: () {}),
      ],
    ),
  ),
]);

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
