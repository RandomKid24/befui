import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

enum BefTabsVariant { underline, pill }

class BefTab {
  const BefTab({required this.label, required this.child, this.icon});
  final String label;
  final Widget child;
  final Widget? icon;
}

/// Tabs with the content of the chosen one underneath. [BefTabsVariant.underline] is a row with a line, [BefTabsVariant.pill] a segmented track.
class BefTabs extends StatefulWidget {
  const BefTabs({
    super.key,
    required this.tabs,
    this.variant = BefTabsVariant.underline,
    this.initialIndex = 0,
    this.onChanged,
  });
  final List<BefTab> tabs;
  final BefTabsVariant variant;
  final int initialIndex;
  final ValueChanged<int>? onChanged;

  @override
  State<BefTabs> createState() => _BefTabsState();
}

class _BefTabsState extends State<BefTabs> {
  late int _index = widget.initialIndex;

  void _select(int i) {
    setState(() => _index = i);
    widget.onChanged?.call(i);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final underline = widget.variant == BefTabsVariant.underline;
    final triggers = [for (var i = 0; i < widget.tabs.length; i++) _trigger(context, c, i, underline)];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        LayoutBuilder(
          builder: (context, box) => SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: underline
                ? ConstrainedBox(
                    constraints: BoxConstraints(minWidth: box.maxWidth),
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        border: Border(bottom: BorderSide(color: c.border)),
                      ),
                      child: Row(
                        children: [
                          for (var i = 0; i < triggers.length; i++) ...[
                            if (i > 0) const SizedBox(width: 20),
                            triggers[i],
                          ],
                        ],
                      ),
                    ),
                  )
                : Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: c.secondary,
                      borderRadius: BorderRadius.circular(BefRadius.lg),
                    ),
                    child: Row(
                      children: [
                        for (var i = 0; i < triggers.length; i++) ...[
                          if (i > 0) const SizedBox(width: 2),
                          triggers[i],
                        ],
                      ],
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 16),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          child: KeyedSubtree(key: ValueKey(_index), child: widget.tabs[_index].child),
        ),
      ],
    );
  }

  Widget _trigger(BuildContext context, BefColors c, int i, bool underline) {
    final tab = widget.tabs[i];
    final on = i == _index;
    return Semantics(
      selected: on,
      label: tab.label,
      child: BefPressable(
        semanticsRole: false,
        pressScale: 1,
        onPressed: () => _select(i),
        builder: (context, states) {
          final fg = on || states.contains(WidgetState.hovered) ? c.foreground : c.mutedForeground;
          final label = Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (tab.icon != null) ...[
                IconTheme.merge(
                  data: IconThemeData(size: 16, color: fg),
                  child: tab.icon!,
                ),
                const SizedBox(width: 6),
              ],
              Text(
                tab.label,
                style: BefText.style(context, size: 13, weight: FontWeight.w500, color: fg, height: 1.2),
              ),
            ],
          );
          if (underline) {
            return Transform.translate(
              offset: const Offset(0, 1),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: on ? c.primary : Colors.transparent, width: 2)),
                ),
                child: label,
              ),
            );
          }
          return AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: on ? c.background : Colors.transparent,
              borderRadius: BorderRadius.circular(BefRadius.md),
              boxShadow: on ? BefShadow.sm : null,
            ),
            child: label,
          );
        },
      ),
    );
  }
}
