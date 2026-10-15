import 'package:flutter/material.dart';

import 'theme.dart';

class BefBarListItem {
  const BefBarListItem({required this.label, required this.value});
  final String label;
  final double value;
}

/// Ranked rows with a soft bar behind each label, sized by value.
class BefBarList extends StatelessWidget {
  const BefBarList({super.key, required this.items, this.format});
  final List<BefBarListItem> items;
  final String Function(double)? format;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final mx = items.map((i) => i.value).reduce((a, b) => a > b ? a : b);
    String fmt(double v) {
      if (format != null) return format!(v);
      final s = v.round().toString();
      if (s.length <= 3) return s;
      final head = s.substring(0, s.length - 3);
      return '${head.replaceAllMapped(RegExp(r'\B(?=(\d{2})+(?!\d))'), (_) => ',')},${s.substring(s.length - 3)}';
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < items.length; i++) ...[
          if (i > 0) const SizedBox(height: 6),
          LayoutBuilder(
            builder: (context, box) {
              return Stack(
                children: [
                  Positioned(
                    left: 0,
                    top: 0,
                    bottom: 0,
                    child: Container(
                      width: box.maxWidth * items[i].value / mx,
                      decoration: BoxDecoration(
                        color: c.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(BefRadius.md),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            items[i].label,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: BefText.style(context, size: 13, weight: FontWeight.w500),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          fmt(items[i].value),
                          style: BefText.style(
                            context,
                            size: 13,
                            color: c.mutedForeground,
                          ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ],
    );
  }
}
