import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// Row of toggle buttons. [multiple] lets several be pressed at once (formatting toolbars); otherwise one stays pressed. Give every [BefToggleGroupItem] a value and a child (an icon or text).
class BefToggleGroup extends StatelessWidget {
  const BefToggleGroup({
    super.key,
    required this.items,
    required this.value,
    required this.onChanged,
    this.multiple = false,
    this.outline = false,
  });
  final List<BefToggleGroupItem> items;

  /// The pressed values.
  final List<String> value;
  final ValueChanged<List<String>> onChanged;
  final bool multiple, outline;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Wrap(
      spacing: 4,
      runSpacing: 4,
      children: [
        for (final it in items)
          BefPressable(
            semanticLabel: it.label,
            onPressed: () {
              final on = value.contains(it.value);
              if (multiple) {
                onChanged(on ? value.where((v) => v != it.value).toList() : [...value, it.value]);
              } else if (!on) {
                onChanged([it.value]);
              }
            },
            builder: (context, s) {
              final on = value.contains(it.value);
              return AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                constraints: const BoxConstraints(minWidth: 36),
                height: 36,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: on ? c.accent : (s.contains(WidgetState.hovered) ? c.secondary : Colors.transparent),
                  borderRadius: BorderRadius.circular(BefRadius.md),
                  border: outline ? Border.all(color: on ? c.primary : c.border) : null,
                ),
                child: Center(
                  child: IconTheme(
                    data: IconThemeData(color: on ? c.accentForeground : c.mutedForeground, size: 16),
                    child: DefaultTextStyle(
                      style: BefText.style(
                        context,
                        weight: FontWeight.w500,
                        color: on ? c.accentForeground : c.mutedForeground,
                      ),
                      child: it.child,
                    ),
                  ),
                ),
              );
            },
          ),
      ],
    );
  }
}

class BefToggleGroupItem {
  const BefToggleGroupItem({required this.value, required this.label, required this.child});
  final String value, label;
  final Widget child;
}
