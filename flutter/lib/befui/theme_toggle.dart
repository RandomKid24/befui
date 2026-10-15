import 'package:flutter/material.dart';

import 'button.dart';
import 'icons.dart';

/// Icon button that flips light and dark. You own the state: pass [dark] and flip your `ThemeMode` in [onChanged].
class BefThemeToggle extends StatelessWidget {
  const BefThemeToggle({super.key, required this.dark, required this.onChanged});
  final bool dark;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) => BefButton(
    variant: BefButtonVariant.ghost,
    size: BefButtonSize.iconSm,
    semanticLabel: dark ? 'Switch to light mode' : 'Switch to dark mode',
    onPressed: () => onChanged(!dark),
    child: AnimatedSwitcher(
      duration: const Duration(milliseconds: 200),
      child: BefIcon(dark ? BefIcons.sun : BefIcons.moon, key: ValueKey(dark), size: 16),
    ),
  );
}
