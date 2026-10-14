import 'package:flutter/material.dart';

import 'theme.dart';

class BefTableColumn {
  const BefTableColumn(this.label, {this.width, this.alignRight = false});
  final String label;

  /// A fixed width in logical pixels; columns without one size to their content.
  final double? width;
  final bool alignRight;
}

/// A simple table: small uppercase headers, rows with a bottom border, and a hover tint. Wide tables scroll sideways.
class BefTable extends StatelessWidget {
  const BefTable({super.key, required this.columns, required this.rows, this.onRowTap});
  final List<BefTableColumn> columns;

  /// One list of cells per row. Strings are styled for you; pass widgets for anything else.
  final List<List<Object>> rows;
  final ValueChanged<int>? onRowTap;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return LayoutBuilder(
      builder: (context, box) {
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: ConstrainedBox(
            constraints: BoxConstraints(minWidth: box.maxWidth),
            child: Table(
              defaultVerticalAlignment: TableCellVerticalAlignment.middle,
              columnWidths: {
                for (var i = 0; i < columns.length; i++)
                  i: columns[i].width != null
                      ? FixedColumnWidth(columns[i].width!)
                      : const IntrinsicColumnWidth(),
              },
              children: [
                TableRow(
                  decoration: BoxDecoration(
                    border: Border(bottom: BorderSide(color: c.border)),
                  ),
                  children: [
                    for (final col in columns) _cell(context, c, col, col.label.toUpperCase(), header: true),
                  ],
                ),
                for (var r = 0; r < rows.length; r++)
                  TableRow(
                    decoration: r == rows.length - 1
                        ? null
                        : BoxDecoration(
                            border: Border(bottom: BorderSide(color: c.border)),
                          ),
                    children: [
                      for (var i = 0; i < columns.length; i++)
                        _cell(context, c, columns[i], rows[r][i], row: r),
                    ],
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _cell(
    BuildContext context,
    BefColors c,
    BefTableColumn col,
    Object cell, {
    bool header = false,
    int? row,
  }) {
    final child = cell is Widget
        ? cell
        : Text(
            '$cell',
            maxLines: 1,
            softWrap: false,
            style: header
                ? BefText.style(
                    context,
                    size: 11,
                    weight: FontWeight.w500,
                    color: c.mutedForeground,
                    letterSpacing: 0.8,
                  )
                : BefText.style(context, size: 13),
          );
    final box = Container(
      height: header ? 36 : null,
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: header ? 0 : 12),
      alignment: col.alignRight ? Alignment.centerRight : Alignment.centerLeft,
      child: child,
    );
    if (header || onRowTap == null) return box;
    return GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => onRowTap!(row!), child: box);
  }
}
