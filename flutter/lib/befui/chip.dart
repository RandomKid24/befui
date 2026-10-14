import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// A pill you can switch on and off. When selected it fills with `primary` and a check slides in.
class BefChip extends StatelessWidget {
  const BefChip({super.key, required this.label, this.selected = false, this.onPressed});
  final String label;
  final bool selected;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Semantics(
      toggled: selected,
      button: true,
      label: label,
      child: BefPressable(
        semanticsRole: false,
        pressScale: 0.95,
        onPressed: onPressed,
        builder: (context, states) {
          final hover = states.contains(WidgetState.hovered);
          final focused = states.contains(WidgetState.focused);
          final fg = selected ? c.primaryForeground : (hover ? c.foreground : c.mutedForeground);
          return AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            height: 32,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: selected ? c.primary : null,
              borderRadius: BorderRadius.circular(BefRadius.full),
              border: Border.all(
                color: selected ? c.primary : (hover ? befOpacity(c.foreground, 0.3) : c.border),
              ),
              boxShadow: [
                if (selected) ...BefShadow.sm,
                if (focused) BoxShadow(color: befOpacity(c.ring, 0.5), spreadRadius: 2),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedSize(
                  duration: const Duration(milliseconds: 200),
                  child: selected
                      ? Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: BefIcon(BefIcons.check, size: 14, color: fg),
                        )
                      : const SizedBox.shrink(),
                ),
                Text(
                  label,
                  style: BefText.style(context, size: 13, weight: FontWeight.w500, color: fg, height: 1),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

/// A row of chips where picking toggles them. [multiple] false makes it a single choice.
class BefChipGroup extends StatelessWidget {
  const BefChipGroup({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.multiple = true,
  });
  final List<String> options;
  final List<String> value;
  final ValueChanged<List<String>> onChanged;
  final bool multiple;

  @override
  Widget build(BuildContext context) {
    void toggle(String o) =>
        onChanged(value.contains(o) ? value.where((x) => x != o).toList() : (multiple ? [...value, o] : [o]));
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final o in options) BefChip(label: o, selected: value.contains(o), onPressed: () => toggle(o)),
      ],
    );
  }
}
