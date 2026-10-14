import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

enum BefToggleVariant { defaultStyle, outline }

enum BefToggleSize { sm, md, icon }

/// A two-state button (bold, favourite, mute). Pressed gets the `accent` fill.
class BefToggle extends StatelessWidget {
  const BefToggle({
    super.key,
    required this.pressed,
    required this.onChanged,
    required this.child,
    this.variant = BefToggleVariant.defaultStyle,
    this.size = BefToggleSize.md,
    this.semanticLabel,
  });
  final bool pressed;
  final ValueChanged<bool>? onChanged;
  final Widget child;
  final BefToggleVariant variant;
  final BefToggleSize size;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final (h, w, padX) = switch (size) {
      BefToggleSize.sm => (32.0, null, 10.0),
      BefToggleSize.md => (36.0, null, 12.0),
      BefToggleSize.icon => (36.0, 36.0, 0.0),
    };
    return Semantics(
      toggled: pressed,
      button: true,
      label: semanticLabel,
      child: BefPressable(
        semanticsRole: false,
        enabled: onChanged != null,
        pressScale: 0.95,
        onPressed: () => onChanged?.call(!pressed),
        builder: (context, states) {
          final hover = states.contains(WidgetState.hovered);
          final focused = states.contains(WidgetState.focused);
          final fg = pressed ? c.accentForeground : (hover ? c.foreground : c.mutedForeground);
          return Opacity(
            opacity: onChanged == null ? 0.5 : 1,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              height: h,
              width: w,
              padding: EdgeInsets.symmetric(horizontal: padX),
              alignment: w == null ? null : Alignment.center,
              decoration: BoxDecoration(
                color: pressed ? c.accent : (hover ? c.secondary : null),
                borderRadius: BorderRadius.circular(BefRadius.md),
                border: variant == BefToggleVariant.outline
                    ? Border.all(color: pressed ? c.primary : c.border)
                    : null,
                boxShadow: focused ? [BoxShadow(color: befOpacity(c.ring, 0.5), spreadRadius: 2)] : null,
              ),
              child: DefaultTextStyle.merge(
                style: BefText.style(context, weight: FontWeight.w500, color: fg),
                child: IconTheme.merge(
                  data: IconThemeData(size: 16, color: fg),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [child],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
