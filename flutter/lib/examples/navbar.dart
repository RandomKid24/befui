import 'package:flutter/material.dart';

import '../befui/navbar.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  Widget framed(Widget bar) => ClipRRect(
    borderRadius: BorderRadius.circular(12),
    child: DecoratedBox(
      decoration: BoxDecoration(border: Border.all(color: Theme.of(context).dividerColor)),
      child: bar,
    ),
  );
  return _groups(context, [
    (
      'Title and actions',
      framed(
        BefAppBar(
          title: 'Inbox',
          actions: [
            BefAppBarAction(icon: BefIcons.search, label: 'Search', onPressed: () {}),
            BefAppBarAction(icon: BefIcons.bell, label: 'Alerts', badge: 3, onPressed: () {}),
          ],
        ),
      ),
    ),
    (
      'With back and subtitle',
      framed(
        BefAppBar(
          title: 'Aarav Mehta',
          subtitle: 'Online',
          onBack: () {},
          actions: [BefAppBarAction(icon: BefIcons.moreVertical, label: 'More', onPressed: () {})],
        ),
      ),
    ),
    ('Centred title', framed(BefAppBar(title: 'Settings', centerTitle: true, onBack: () {}))),
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
