import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/input_group.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  Widget field(String hint, {String? text}) => TextField(
    controller: text == null ? null : TextEditingController(text: text),
    style: BefText.style(context),
    decoration: InputDecoration(
      border: InputBorder.none,
      isCollapsed: true,
      hintText: hint,
      hintStyle: BefText.style(context, color: context.bef.mutedForeground),
    ),
  );
  return _groups(context, [
    ('Text before', BefInputGroup(prefix: const Text('https://'), child: field('your-site.com'))),
    ('Text after', BefInputGroup(suffix: const Text('INR'), child: field('0.00'))),
    ('Both', BefInputGroup(prefix: const Text('₹'), suffix: const Text('per month'), child: field('499'))),
    ('Icon', BefInputGroup(prefix: const BefIcon(BefIcons.mail), child: field('you@company.com'))),
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
