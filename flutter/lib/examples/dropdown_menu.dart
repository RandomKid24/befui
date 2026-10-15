import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/dropdown_menu.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return _groups(context, [('Tap Account', _menu(set))]);
    },
  );
}

Widget _menu(void Function(VoidCallback) set) {
  return StatefulBuilder(
    builder: (context, _) {
      return BefDropdownMenu(
        items: [
          const BefMenuLabel('My account'),
          BefMenuItem(
            label: 'Profile',
            icon: const BefIcon(BefIcons.user),
            shortcut: '⇧P',
            onSelected: () {},
          ),
          BefMenuItem(label: 'Settings', icon: const BefIcon(BefIcons.settings), onSelected: () {}),
          const BefMenuSeparator(),
          BefMenuCheckboxItem(
            label: 'Show sidebar',
            checked: _sidebar,
            onChanged: (v) => set(() => _sidebar = v),
          ),
          const BefMenuSeparator(),
          BefMenuItem(
            label: 'Sign out',
            icon: const BefIcon(BefIcons.logOut),
            destructive: true,
            onSelected: () {},
          ),
        ],
        child: IgnorePointer(
          child: BefButton(
            label: 'Account',
            variant: BefButtonVariant.outline,
            trailing: const BefIcon(BefIcons.chevronDown),
            onPressed: () {},
          ),
        ),
      );
    },
  );
}

bool _sidebar = true;

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
