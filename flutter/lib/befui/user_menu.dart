import 'package:flutter/material.dart';

import 'avatar.dart';
import 'bottom_sheet.dart';
import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefUserMenuItem {
  const BefUserMenuItem({required this.label, this.icon, this.onSelected});
  final String label;
  final BefIconData? icon;
  final VoidCallback? onSelected;
}

/// Avatar button that opens a sheet: name and email on top, your [items], then Sign out (when [onSignOut] is set).
class BefUserMenu extends StatelessWidget {
  const BefUserMenu({super.key, required this.name, this.email, this.items = const [], this.onSignOut});
  final String name;
  final String? email;
  final List<BefUserMenuItem> items;
  final VoidCallback? onSignOut;

  @override
  Widget build(BuildContext context) {
    return BefPressable(
      semanticLabel: 'Account menu',
      onPressed: () => showBefBottomSheet<void>(
        context: context,
        title: name,
        description: email,
        builder: (ctx) {
          final c = ctx.bef;
          Widget row(String label, BefIconData? icon, VoidCallback? tap, {bool danger = false}) => InkWell(
            borderRadius: BorderRadius.circular(BefRadius.lg),
            onTap: () {
              Navigator.of(ctx).pop();
              tap?.call();
            },
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 13),
              child: Row(
                children: [
                  if (icon != null) ...[
                    BefIcon(icon, size: 18, color: danger ? c.destructive : c.mutedForeground),
                    const SizedBox(width: 12),
                  ],
                  Text(
                    label,
                    style: BefText.style(
                      ctx,
                      weight: FontWeight.w500,
                      color: danger ? c.destructive : c.foreground,
                    ),
                  ),
                ],
              ),
            ),
          );
          return Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              for (final i in items) row(i.label, i.icon, i.onSelected),
              if (onSignOut != null) ...[
                Divider(height: 12, color: c.border),
                row('Sign out', BefIcons.logOut, onSignOut, danger: true),
              ],
            ],
          );
        },
      ),
      builder: (context, s) => Padding(
        padding: const EdgeInsets.all(4),
        child: BefAvatar(name: name, size: BefAvatarSize.sm),
      ),
    );
  }
}
