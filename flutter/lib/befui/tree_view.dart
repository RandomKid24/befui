import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefTreeNode {
  const BefTreeNode({required this.id, required this.label, this.children});
  final String id, label;

  /// Null for a leaf; an empty list for an empty folder.
  final List<BefTreeNode>? children;
}

/// Nested expandable list for files, org charts and categories. The first level starts open.
class BefTreeView extends StatelessWidget {
  const BefTreeView({super.key, required this.nodes, this.selected, this.onSelect});
  final List<BefTreeNode> nodes;
  final String? selected;
  final ValueChanged<BefTreeNode>? onSelect;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [for (final n in nodes) _Node(node: n, depth: 0, selected: selected, onSelect: onSelect)],
  );
}

class _Node extends StatefulWidget {
  const _Node({required this.node, required this.depth, this.selected, this.onSelect});
  final BefTreeNode node;
  final int depth;
  final String? selected;
  final ValueChanged<BefTreeNode>? onSelect;
  @override
  State<_Node> createState() => _NodeState();
}

class _NodeState extends State<_Node> {
  late bool _open = widget.depth == 0;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final n = widget.node;
    final dir = n.children != null;
    final sel = widget.selected == n.id;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        BefPressable(
          pressScale: 1,
          onPressed: () => dir ? setState(() => _open = !_open) : widget.onSelect?.call(n),
          builder: (context, s) => Container(
            padding: EdgeInsets.only(left: widget.depth * 16.0 + 6, right: 8, top: 6, bottom: 6),
            decoration: BoxDecoration(
              color: sel
                  ? c.accent
                  : s.contains(WidgetState.hovered) || s.contains(WidgetState.pressed)
                  ? c.secondary
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(BefRadius.md),
            ),
            child: Row(
              children: [
                AnimatedRotation(
                  turns: _open ? 0.25 : 0,
                  duration: const Duration(milliseconds: 200),
                  child: Opacity(
                    opacity: dir ? 1 : 0,
                    child: BefIcon(BefIcons.chevronRight, size: 14, color: c.mutedForeground),
                  ),
                ),
                const SizedBox(width: 6),
                BefIcon(
                  dir ? BefIcons.folder : BefIcons.file,
                  size: 16,
                  color: dir ? c.primary : c.mutedForeground,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    n.label,
                    style: BefText.style(context, color: sel ? c.accentForeground : c.foreground),
                  ),
                ),
              ],
            ),
          ),
        ),
        if (dir)
          AnimatedSize(
            duration: const Duration(milliseconds: 200),
            alignment: Alignment.topCenter,
            child: _open
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      for (final ch in n.children!)
                        _Node(
                          node: ch,
                          depth: widget.depth + 1,
                          selected: widget.selected,
                          onSelect: widget.onSelect,
                        ),
                    ],
                  )
                : const SizedBox(width: double.infinity),
          ),
      ],
    );
  }
}
