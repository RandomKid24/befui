import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/dropdown_menu.dart';
import '../befui/icons.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
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
