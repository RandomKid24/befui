import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// A 16px checkbox. [value] is true, false or null (the indeterminate dash). Give it a [label] and the whole row is tappable.
class BefCheckbox extends StatelessWidget {
  const BefCheckbox({
    super.key,
    required this.value,
    this.onChanged,
    this.label,
    this.labelWeight = FontWeight.w400,
  });
  final bool? value;
  final ValueChanged<bool>? onChanged;
  final String? label;
  final FontWeight labelWeight;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final on = value != false;
    return Semantics(
      checked: value == true,
      mixed: value == null,
      enabled: onChanged != null,
      label: label,
      child: BefPressable(
        semanticsRole: false,
        enabled: onChanged != null,
        onPressed: () => onChanged?.call(value != true),
        pressScale: 1,
        builder: (context, states) {
          final focused = states.contains(WidgetState.focused);
          final hover = states.contains(WidgetState.hovered);
          final box = AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            width: 16,
            height: 16,
            decoration: BoxDecoration(
              color: on ? c.primary : c.background,
              borderRadius: BorderRadius.circular(5),
              border: Border.all(
                color: on ? c.primary : (hover ? befOpacity(c.mutedForeground, 0.6) : c.input),
              ),
              boxShadow: focused ? [BoxShadow(color: befOpacity(c.ring, 0.25), spreadRadius: 3)] : null,
            ),
            alignment: Alignment.center,
            child: on
                ? BefIcon(
                    value == null ? BefIcons.minus : BefIcons.check,
                    size: 12,
                    color: c.primaryForeground,
                    weight: 3,
                  )
                : null,
          );
          return Opacity(
            opacity: onChanged == null ? 0.5 : 1,
            child: label == null
                ? box
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      box,
                      const SizedBox(width: 10),
                      Text(label!, style: BefText.style(context, weight: labelWeight, height: 1)),
                    ],
                  ),
          );
        },
      ),
    );
  }
}
