import 'package:flutter/material.dart';

import 'icons.dart';
import 'theme.dart';

/// Vertical list you reorder by long-pressing a row, or by dragging its grip, then dropping it. Controlled: [items] in, [onChanged] gets the new order. [itemBuilder] draws a row; every item needs a unique [idOf].
class BefSortableList<T> extends StatelessWidget {
  const BefSortableList({
    super.key,
    required this.items,
    required this.onChanged,
    required this.itemBuilder,
    required this.idOf,
  });
  final List<T> items;
  final ValueChanged<List<T>> onChanged;
  final Widget Function(BuildContext context, T item, int index) itemBuilder;
  final String Function(T item) idOf;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return ReorderableListView(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      buildDefaultDragHandles: false,
      proxyDecorator: (child, index, animation) => Material(
        color: Colors.transparent,
        elevation: 6,
        shadowColor: const Color(0x33000000),
        borderRadius: BorderRadius.circular(BefRadius.lg),
        child: child,
      ),
      onReorder: (from, to) {
        final next = [...items];
        if (to > from) to -= 1;
        next.insert(to, next.removeAt(from));
        onChanged(next);
      },
      children: [
        for (var i = 0; i < items.length; i++)
          Container(
            key: ValueKey(idOf(items[i])),
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.fromLTRB(4, 4, 12, 4),
            decoration: BoxDecoration(
              color: c.card,
              borderRadius: BorderRadius.circular(BefRadius.lg),
              border: Border.all(color: c.border),
            ),
            child: Row(
              children: [
                ReorderableDragStartListener(
                  index: i,
                  child: Semantics(
                    label: 'Drag to reorder',
                    child: Padding(
                      padding: const EdgeInsets.all(10),
                      child: BefIcon(BefIcons.grip, size: 16, color: c.mutedForeground),
                    ),
                  ),
                ),
                Expanded(child: itemBuilder(context, items[i], i)),
              ],
            ),
          ),
      ],
    );
  }
}
