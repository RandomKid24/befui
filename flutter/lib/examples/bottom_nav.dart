import 'package:flutter/material.dart';

import '../befui/bottom_nav.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final c = context.bef;
      return _groups(context, [
        (
          'Four tabs with a badge',
          Center(
            child: Container(
              width: 288,
              height: 256,
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(
                color: c.background,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: c.foreground.withValues(alpha: 0.8), width: 4),
              ),
              child: Column(
                children: [
                  Expanded(
                    child: Center(
                      child: Text(
                        _tab[0].toUpperCase() + _tab.substring(1),
                        style: BefText.style(context, weight: FontWeight.w500, color: c.mutedForeground),
                      ),
                    ),
                  ),
                  BefBottomNav(
                    value: _tab,
                    onChanged: (v) => set(() => _tab = v),
                    items: const [
                      BefNavItem(id: 'home', label: 'Home', icon: BefIcon(BefIcons.home)),
                      BefNavItem(id: 'search', label: 'Search', icon: BefIcon(BefIcons.search)),
                      BefNavItem(id: 'alerts', label: 'Alerts', icon: BefIcon(BefIcons.bell), badge: 3),
                      BefNavItem(id: 'profile', label: 'Profile', icon: BefIcon(BefIcons.user)),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ]);
    },
  );
}

String _tab = 'home';

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
