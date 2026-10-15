import 'package:flutter/material.dart';

import '../befui/tree_view.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

const _nodes = [
  BefTreeNode(
    id: 'co',
    label: 'Acme Inc',
    children: [
      BefTreeNode(
        id: 'eng',
        label: 'Engineering',
        children: [
          BefTreeNode(id: 'a', label: 'Aarav Mehta'),
          BefTreeNode(id: 'b', label: 'Isha Rao'),
        ],
      ),
      BefTreeNode(
        id: 'des',
        label: 'Design',
        children: [BefTreeNode(id: 'c', label: 'Kabir Shah')],
      ),
      BefTreeNode(id: 'ceo', label: 'Leadership'),
    ],
  ),
];

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  String sel = 'a';

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Org chart, tap a person',
      BefTreeView(nodes: _nodes, selected: sel, onSelect: (n) => setState(() => sel = n.id)),
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
