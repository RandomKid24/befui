import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

class BefNavItem {
  const BefNavItem({required this.id, required this.label, required this.icon, this.badge});
  final String id;
  final String label;
  final Widget icon;

  /// A count shown on the icon (99+ above 99).
  final int? badge;
}

/// The tab bar at the bottom of a phone screen. Respects the safe area under it.
class BefBottomNav extends StatelessWidget {
  const BefBottomNav({super.key, required this.items, required this.value, required this.onChanged});
  final List<BefNavItem> items;
  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final bottom = MediaQuery.paddingOf(context).bottom;
    return Container(
      decoration: BoxDecoration(
        color: c.background.withValues(alpha: 0.95),
        border: Border(top: BorderSide(color: c.border)),
      ),
      padding: EdgeInsets.fromLTRB(8, 4, 8, bottom < 4 ? 4 : bottom),
      child: Row(children: [for (final it in items) Expanded(child: _tab(context, c, it))]),
    );
  }

  Widget _tab(BuildContext context, BefColors c, BefNavItem it) {
    final on = it.id == value;
    return Semantics(
      selected: on,
      label: it.badge == null ? it.label : '${it.label}, ${it.badge} new',
      button: true,
      child: BefPressable(
        semanticsRole: false,
        pressScale: 0.96,
        onPressed: () => onChanged(it.id),
        builder: (context, states) {
          final fg = on
              ? c.primary
              : (states.contains(WidgetState.hovered) ? c.foreground : c.mutedForeground);
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 48,
                      height: 28,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: on ? c.primary.withValues(alpha: 0.1) : Colors.transparent,
                        borderRadius: BorderRadius.circular(BefRadius.full),
                      ),
                      child: IconTheme.merge(
                        data: IconThemeData(size: 20, color: fg),
                        child: it.icon,
                      ),
                    ),
                    if ((it.badge ?? 0) > 0)
                      Positioned(
                        right: 6,
                        top: 0,
                        child: Container(
                          constraints: const BoxConstraints(minWidth: 16),
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          decoration: BoxDecoration(
                            color: c.destructive,
                            borderRadius: BorderRadius.circular(BefRadius.full),
                          ),
                          child: Text(
                            it.badge! > 99 ? '99+' : '${it.badge}',
                            textAlign: TextAlign.center,
                            style: BefText.style(
                              context,
                              size: 10,
                              weight: FontWeight.w600,
                              color: Colors.white,
                              height: 16 / 10,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  it.label,
                  style: BefText.style(context, size: 11, weight: FontWeight.w500, color: fg, height: 1.2),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
