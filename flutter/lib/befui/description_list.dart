import 'package:flutter/material.dart';

import 'theme.dart';

class BefDescriptionItem {
  const BefDescriptionItem({required this.label, required this.value, this.wide = false});
  final String label;

  /// A string or any widget.
  final Object value;

  /// Spans the whole row, for long text.
  final bool wide;
}

/// Label and value pairs for a details panel. [columns] applies on wider screens; on a phone it is one column.
class BefDescriptionList extends StatelessWidget {
  const BefDescriptionList({super.key, required this.items, this.columns = 2, this.bordered = false});
  final List<BefDescriptionItem> items;
  final int columns;
  final bool bordered;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return LayoutBuilder(
      builder: (context, box) {
        final cols = box.maxWidth >= 560 ? columns : 1;
        final w = (box.maxWidth - (cols - 1) * 24) / cols;
        Widget item(BefDescriptionItem it, double width, {bool last = false}) => SizedBox(
          width: width,
          child: Container(
            padding: EdgeInsets.symmetric(vertical: bordered ? 12 : 0),
            decoration: bordered && !last
                ? BoxDecoration(
                    border: Border(bottom: BorderSide(color: c.border)),
                  )
                : null,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  it.label,
                  style: BefText.style(context, size: 12, weight: FontWeight.w500, color: c.mutedForeground),
                ),
                const SizedBox(height: 2),
                it.value is Widget ? it.value as Widget : Text('${it.value}', style: BefText.style(context)),
              ],
            ),
          ),
        );
        return Wrap(
          spacing: 24,
          runSpacing: bordered ? 0 : 16,
          children: [
            for (var i = 0; i < items.length; i++)
              item(items[i], items[i].wide ? box.maxWidth : w, last: i >= items.length - (cols == 1 ? 1 : 1)),
          ],
        );
      },
    );
  }
}
