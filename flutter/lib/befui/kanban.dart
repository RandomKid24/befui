import 'package:flutter/material.dart';

import 'icons.dart';
import 'theme.dart';

enum BefKanbanTone { normal, info, warning, success, danger }

class BefKanbanColumn {
  const BefKanbanColumn({required this.id, required this.title, this.tone = BefKanbanTone.normal});
  final String id, title;
  final BefKanbanTone tone;
}

/// Board of columns with cards you move by long-pressing and dragging them onto another column (or another spot in the same one). Scrolls sideways. Controlled: [value] maps a column id to its cards, [onChanged] gets the new map. Cards need a unique [idOf].
class BefKanban<T extends Object> extends StatelessWidget {
  const BefKanban({
    super.key,
    required this.columns,
    required this.value,
    required this.onChanged,
    required this.cardBuilder,
    required this.idOf,
    this.onAdd,
    this.columnWidth = 260,
  });
  final List<BefKanbanColumn> columns;
  final Map<String, List<T>> value;
  final ValueChanged<Map<String, List<T>>> onChanged;
  final Widget Function(BuildContext context, T item) cardBuilder;
  final String Function(T item) idOf;
  final ValueChanged<String>? onAdd;
  final double columnWidth;

  void _move(T item, String toColumn, int toIndex) {
    final next = {
      for (final e in value.entries) e.key: [...e.value],
    };
    for (final l in next.values) {
      l.removeWhere((x) => idOf(x) == idOf(item));
    }
    final list = next[toColumn] ?? [];
    list.insert(toIndex.clamp(0, list.length), item);
    next[toColumn] = list;
    onChanged(next);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    Color dot(BefKanbanTone t) => switch (t) {
      BefKanbanTone.normal => c.mutedForeground,
      BefKanbanTone.info => c.info,
      BefKanbanTone.warning => c.warning,
      BefKanbanTone.success => c.success,
      BefKanbanTone.danger => c.destructive,
    };
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final col in columns)
            DragTarget<T>(
              onWillAcceptWithDetails: (_) => true,
              onAcceptWithDetails: (d) => _move(d.data, col.id, (value[col.id] ?? []).length),
              builder: (context, hover, _) => Container(
                width: columnWidth,
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: hover.isEmpty ? c.muted.withValues(alpha: 0.5) : c.accent,
                  borderRadius: BorderRadius.circular(BefRadius.xl),
                  border: Border.all(color: hover.isEmpty ? c.border : c.primary.withValues(alpha: 0.5)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(4, 2, 4, 10),
                      child: Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(color: dot(col.tone), shape: BoxShape.circle),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              col.title,
                              style: BefText.style(context, size: 13, weight: FontWeight.w600),
                            ),
                          ),
                          Text(
                            '${(value[col.id] ?? []).length}',
                            style: BefText.style(context, size: 12, color: c.mutedForeground),
                          ),
                          if (onAdd != null) ...[
                            const SizedBox(width: 6),
                            GestureDetector(
                              onTap: () => onAdd!(col.id),
                              child: Semantics(
                                label: 'Add to ${col.title}',
                                button: true,
                                child: BefIcon(BefIcons.plus, size: 16, color: c.mutedForeground),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    for (final item in value[col.id] ?? <T>[])
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: DragTarget<T>(
                          onWillAcceptWithDetails: (d) => idOf(d.data) != idOf(item),
                          onAcceptWithDetails: (d) => _move(
                            d.data,
                            col.id,
                            (value[col.id] ?? []).indexWhere((x) => idOf(x) == idOf(item)),
                          ),
                          builder: (context, over, _) => LongPressDraggable<T>(
                            data: item,
                            feedback: Material(
                              color: Colors.transparent,
                              elevation: 8,
                              borderRadius: BorderRadius.circular(BefRadius.lg),
                              child: SizedBox(width: columnWidth - 20, child: _card(context, c, item)),
                            ),
                            childWhenDragging: Opacity(opacity: 0.35, child: _card(context, c, item)),
                            child: Column(
                              children: [
                                if (over.isNotEmpty)
                                  Container(
                                    height: 3,
                                    margin: const EdgeInsets.only(bottom: 6),
                                    decoration: BoxDecoration(
                                      color: c.primary,
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                  ),
                                _card(context, c, item),
                              ],
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _card(BuildContext context, BefColors c, T item) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: c.card,
      borderRadius: BorderRadius.circular(BefRadius.lg),
      border: Border.all(color: c.border),
      boxShadow: BefShadow.sm,
    ),
    child: cardBuilder(context, item),
  );
}
