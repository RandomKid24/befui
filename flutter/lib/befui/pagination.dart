import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// Page buttons with "..." for long ranges. [page] starts at 1.
class BefPagination extends StatelessWidget {
  const BefPagination({super.key, required this.page, required this.pageCount, required this.onPageChanged});
  final int page;
  final int pageCount;
  final ValueChanged<int> onPageChanged;

  List<int?> _pages() {
    if (pageCount <= 7) return [for (var i = 1; i <= pageCount; i++) i];
    if (page <= 3) return [1, 2, 3, 4, null, pageCount];
    if (page >= pageCount - 2) return [1, null, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    return [1, null, page - 1, page, page + 1, null, pageCount];
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    Widget btn({required Widget child, VoidCallback? onTap, bool on = false, String? label}) => BefPressable(
      enabled: onTap != null,
      semanticLabel: label,
      pressScale: 1,
      onPressed: onTap,
      builder: (context, states) {
        final hover = states.contains(WidgetState.hovered);
        return Opacity(
          opacity: onTap == null ? 0.4 : 1,
          child: Container(
            constraints: const BoxConstraints(minWidth: 32),
            height: 32,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: on || hover ? c.secondary : null,
              borderRadius: BorderRadius.circular(BefRadius.md),
            ),
            child: DefaultTextStyle.merge(
              style: BefText.style(
                context,
                size: 13,
                weight: FontWeight.w500,
                color: on || hover ? c.foreground : c.mutedForeground,
              ),
              child: child,
            ),
          ),
        );
      },
    );
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        btn(
          label: 'Previous page',
          onTap: page > 1 ? () => onPageChanged(page - 1) : null,
          child: BefIcon(BefIcons.chevronLeft, size: 16, color: c.mutedForeground),
        ),
        const SizedBox(width: 4),
        for (final p in _pages()) ...[
          if (p == null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text('…', style: BefText.style(context, color: c.mutedForeground)),
            )
          else
            btn(label: 'Page $p', on: p == page, onTap: () => onPageChanged(p), child: Text('$p')),
          const SizedBox(width: 4),
        ],
        btn(
          label: 'Next page',
          onTap: page < pageCount ? () => onPageChanged(page + 1) : null,
          child: BefIcon(BefIcons.chevronRight, size: 16, color: c.mutedForeground),
        ),
      ],
    );
  }
}
