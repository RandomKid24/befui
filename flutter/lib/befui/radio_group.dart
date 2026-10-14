import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

class BefRadioOption<T> {
  const BefRadioOption({required this.value, required this.label, this.description, this.disabled = false});
  final T value;
  final String label;
  final String? description;
  final bool disabled;
}

/// Radios as selectable cards: the chosen one gets a `primary` border and an `accent` fill.
class BefRadioGroup<T> extends StatelessWidget {
  const BefRadioGroup({super.key, required this.options, required this.value, required this.onChanged});
  final List<BefRadioOption<T>> options;
  final T? value;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Semantics(
      container: true,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < options.length; i++) ...[
            if (i > 0) const SizedBox(height: 8),
            _tile(context, c, options[i]),
          ],
        ],
      ),
    );
  }

  Widget _tile(BuildContext context, BefColors c, BefRadioOption<T> o) {
    final selected = o.value == value;
    return Semantics(
      inMutuallyExclusiveGroup: true,
      checked: selected,
      enabled: !o.disabled,
      label: o.label,
      child: BefPressable(
        semanticsRole: false,
        enabled: !o.disabled,
        pressScale: 1,
        onPressed: () => onChanged(o.value),
        builder: (context, states) {
          final hover = states.contains(WidgetState.hovered);
          final focused = states.contains(WidgetState.focused);
          return Opacity(
            opacity: o.disabled ? 0.5 : 1,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: selected ? c.accent : (hover ? c.muted : null),
                borderRadius: BorderRadius.circular(BefRadius.lg),
                border: Border.all(color: selected ? c.primary : c.border),
                boxShadow: [
                  if (selected) ...BefShadow.sm,
                  if (focused) BoxShadow(color: befOpacity(c.ring, 0.5), spreadRadius: 2),
                ],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 2),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: selected ? c.primary : c.input, width: 2),
                      ),
                      alignment: Alignment.center,
                      child: AnimatedScale(
                        duration: const Duration(milliseconds: 200),
                        scale: selected ? 1 : 0,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(color: c.primary, shape: BoxShape.circle),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          o.label,
                          style: BefText.style(context, weight: FontWeight.w500, height: 16 / 14),
                        ),
                        if (o.description != null) ...[
                          const SizedBox(height: 2),
                          Text(
                            o.description!,
                            style: BefText.style(context, size: 12, color: c.mutedForeground),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
