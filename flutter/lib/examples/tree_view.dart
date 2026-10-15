import 'package:flutter/material.dart';

import '../befui/tree_view.dart';

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
  Widget build(BuildContext context) =>
      BefTreeView(nodes: _nodes, selected: sel, onSelect: (n) => setState(() => sel = n.id));
}
