import 'package:flutter/material.dart';

import 'icons.dart';
import 'search_input.dart';
import 'theme.dart';

class BefSearchItem {
  const BefSearchItem({required this.id, required this.label, this.hint, this.icon});
  final String id, label;
  final String? hint;
  final BefIconData? icon;
}

/// Search field with a live results list under it. The matching part of each result is bold. With an empty query it shows [recent].
class BefSearchBar extends StatefulWidget {
  const BefSearchBar({
    super.key,
    required this.items,
    this.recent = const [],
    this.onSelect,
    this.placeholder = 'Search',
    this.empty = 'No results',
  });
  final List<BefSearchItem> items, recent;
  final ValueChanged<BefSearchItem>? onSelect;
  final String placeholder, empty;

  @override
  State<BefSearchBar> createState() => _BefSearchBarState();
}

class _BefSearchBarState extends State<BefSearchBar> {
  String _q = '';

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final q = _q.trim().toLowerCase();
    final list = q.isEmpty
        ? widget.recent
        : widget.items
              .where((i) => i.label.toLowerCase().contains(q) || (i.hint?.toLowerCase().contains(q) ?? false))
              .toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        BefSearchInput(value: _q, placeholder: widget.placeholder, onChanged: (v) => setState(() => _q = v)),
        if (q.isNotEmpty || list.isNotEmpty)
          Container(
            margin: const EdgeInsets.only(top: 8),
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: c.popover,
              borderRadius: BorderRadius.circular(BefRadius.lg),
              border: Border.all(color: c.border),
              boxShadow: BefShadow.md,
            ),
            child: list.isEmpty
                ? Padding(
                    padding: const EdgeInsets.all(16),
                    child: Center(
                      child: Text(
                        widget.empty,
                        style: BefText.style(context, size: 13, color: c.mutedForeground),
                      ),
                    ),
                  )
                : Column(
                    children: [
                      if (q.isEmpty)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(12, 10, 12, 4),
                          child: Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              'RECENT',
                              style: BefText.style(
                                context,
                                size: 11,
                                weight: FontWeight.w500,
                                color: c.mutedForeground,
                                letterSpacing: 0.8,
                              ),
                            ),
                          ),
                        ),
                      for (final i in list)
                        InkWell(
                          onTap: () => widget.onSelect?.call(i),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
                            child: Row(
                              children: [
                                if (i.icon != null) ...[
                                  BefIcon(i.icon!, size: 16, color: c.mutedForeground),
                                  const SizedBox(width: 10),
                                ],
                                Expanded(child: _mark(context, c, i.label, q)),
                                if (i.hint != null)
                                  Text(
                                    i.hint!,
                                    style: BefText.style(context, size: 12, color: c.mutedForeground),
                                  ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
          ),
      ],
    );
  }

  Widget _mark(BuildContext context, BefColors c, String text, String q) {
    final i = q.isEmpty ? -1 : text.toLowerCase().indexOf(q);
    final base = BefText.style(context, color: c.mutedForeground);
    if (i < 0) return Text(text, style: BefText.style(context, color: c.foreground));
    return Text.rich(
      TextSpan(
        style: base,
        children: [
          TextSpan(text: text.substring(0, i)),
          TextSpan(
            text: text.substring(i, i + q.length),
            style: TextStyle(fontWeight: FontWeight.w700, color: c.foreground),
          ),
          TextSpan(text: text.substring(i + q.length)),
        ],
      ),
    );
  }
}
