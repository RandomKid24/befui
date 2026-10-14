import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// A 36 x 20 switch. Give it a [label] and the whole row is tappable.
class BefSwitch extends StatelessWidget {
  const BefSwitch({super.key, required this.value, this.onChanged, this.label});
  final bool value;
  final ValueChanged<bool>? onChanged;
  final String? label;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Semantics(
      toggled: value,
      enabled: onChanged != null,
      label: label,
      child: BefPressable(
        semanticsRole: false,
        enabled: onChanged != null,
        onPressed: () => onChanged?.call(!value),
        pressScale: 1,
        builder: (context, states) {
          final focused = states.contains(WidgetState.focused);
          final track = AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            width: 36,
            height: 20,
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              color: value ? c.primary : c.input,
              borderRadius: BorderRadius.circular(BefRadius.full),
              boxShadow: focused ? [BoxShadow(color: befOpacity(c.ring, 0.25), spreadRadius: 3)] : null,
            ),
            alignment: value ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              width: 16,
              height: 16,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: Color(0x1A000000), blurRadius: 3, offset: Offset(0, 1))],
              ),
            ),
          );
          return Opacity(
            opacity: onChanged == null ? 0.5 : 1,
            child: label == null
                ? track
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      track,
                      const SizedBox(width: 12),
                      Text(label!, style: BefText.style(context, weight: FontWeight.w500, height: 1)),
                    ],
                  ),
          );
        },
      ),
    );
  }
}
