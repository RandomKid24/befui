import 'package:flutter/material.dart';

import 'icons.dart';
import 'theme.dart';

/// Styles for the menu panel and its rows, shared with [BefSelect].
MenuStyle befMenuStyle(BuildContext context, {double minWidth = 160}) {
  final c = context.bef;
  return MenuStyle(
    backgroundColor: WidgetStatePropertyAll(c.popover),
    surfaceTintColor: const WidgetStatePropertyAll(Colors.transparent),
    elevation: const WidgetStatePropertyAll(8),
    shadowColor: const WidgetStatePropertyAll(Color(0x33000000)),
    padding: const WidgetStatePropertyAll(EdgeInsets.all(4)),
    minimumSize: WidgetStatePropertyAll(Size(minWidth, 0)),
    shape: WidgetStatePropertyAll(
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(BefRadius.lg),
        side: BorderSide(color: c.border),
      ),
    ),
  );
}

ButtonStyle befMenuItemStyle(BuildContext context, {bool destructive = false}) {
  final c = context.bef;
  return ButtonStyle(
    minimumSize: const WidgetStatePropertyAll(Size(0, 34)),
    padding: const WidgetStatePropertyAll(EdgeInsets.symmetric(horizontal: 8, vertical: 6)),
    shape: WidgetStatePropertyAll(RoundedRectangleBorder(borderRadius: BorderRadius.circular(BefRadius.md))),
    overlayColor: WidgetStatePropertyAll(destructive ? c.destructive.withValues(alpha: 0.1) : c.secondary),
    foregroundColor: WidgetStatePropertyAll(destructive ? c.destructive : c.popoverForeground),
    iconColor: WidgetStatePropertyAll(destructive ? c.destructive : c.mutedForeground),
    textStyle: WidgetStatePropertyAll(BefText.style(context, size: 13)),
  );
}

sealed class BefMenuEntry {
  const BefMenuEntry();
}

/// A row in the menu.
class BefMenuItem extends BefMenuEntry {
  const BefMenuItem({
    required this.label,
    this.icon,
    this.shortcut,
    this.destructive = false,
    this.onSelected,
  });
  final String label;
  final Widget? icon;
  final String? shortcut;
  final bool destructive;
  final VoidCallback? onSelected;
}

/// A small uppercase heading inside the menu.
class BefMenuLabel extends BefMenuEntry {
  const BefMenuLabel(this.label);
  final String label;
}

class BefMenuSeparator extends BefMenuEntry {
  const BefMenuSeparator();
}

/// A row with a check you can switch.
class BefMenuCheckboxItem extends BefMenuEntry {
  const BefMenuCheckboxItem({required this.label, required this.checked, required this.onChanged});
  final String label;
  final bool checked;
  final ValueChanged<bool> onChanged;
}

/// A menu that opens from [child] (usually a button) when tapped.
class BefDropdownMenu extends StatelessWidget {
  const BefDropdownMenu({super.key, required this.items, required this.child, this.minWidth = 176});
  final List<BefMenuEntry> items;
  final Widget child;
  final double minWidth;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return MenuAnchor(
      style: befMenuStyle(context, minWidth: minWidth),
      alignmentOffset: const Offset(0, 6),
      menuChildren: [
        for (final e in items)
          switch (e) {
            BefMenuItem() => MenuItemButton(
              style: befMenuItemStyle(context, destructive: e.destructive),
              leadingIcon: e.icon == null
                  ? null
                  : IconTheme.merge(
                      data: IconThemeData(size: 16, color: e.destructive ? c.destructive : c.mutedForeground),
                      child: e.icon!,
                    ),
              trailingIcon: e.shortcut == null
                  ? null
                  : Text(
                      e.shortcut!,
                      style: BefText.style(context, size: 11, color: c.mutedForeground, mono: true),
                    ),
              onPressed: e.onSelected ?? () {},
              child: Text(e.label),
            ),
            BefMenuLabel() => Padding(
              padding: const EdgeInsets.fromLTRB(8, 6, 8, 4),
              child: Text(
                e.label.toUpperCase(),
                style: BefText.style(
                  context,
                  size: 11,
                  weight: FontWeight.w500,
                  color: c.mutedForeground,
                  letterSpacing: 0.8,
                ),
              ),
            ),
            BefMenuSeparator() => Container(
              height: 1,
              margin: const EdgeInsets.symmetric(vertical: 4),
              color: c.border,
            ),
            BefMenuCheckboxItem() => MenuItemButton(
              style: befMenuItemStyle(context),
              closeOnActivate: false,
              leadingIcon: SizedBox(
                width: 16,
                child: e.checked ? BefIcon(BefIcons.check, size: 14, color: c.primary, weight: 2.5) : null,
              ),
              onPressed: () => e.onChanged(!e.checked),
              child: Text(e.label),
            ),
          },
      ],
      builder: (context, controller, _) => GestureDetector(
        onTap: () => controller.isOpen ? controller.close() : controller.open(),
        child: child,
      ),
    );
  }
}
