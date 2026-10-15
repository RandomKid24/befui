import 'package:flutter/material.dart';

import '../befui/pagination.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) => _groups(context, [
      ('12 pages', BefPagination(page: _page, pageCount: 12, onPageChanged: (p) => set(() => _page = p))),
      ('5 pages', BefPagination(page: _small, pageCount: 5, onPageChanged: (p) => set(() => _small = p))),
    ]),
  );
}

int _page = 5, _small = 2;

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
