import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

class BefSegment<T> {
  const BefSegment({required this.value, this.label, this.child}) : assert(label != null || child != null);
  final T value;
  final String? label;
  final Widget? child;
}

/// Pick one of a few options: a `secondary` track with a raised pill under the chosen one.
class BefSegmented<T> extends StatelessWidget {
  const BefSegmented({super.key, required this.segments, required this.value, required this.onChanged});
  final List<BefSegment<T>> segments;
  final T value;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(color: c.secondary, borderRadius: BorderRadius.circular(BefRadius.lg)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < segments.length; i++) ...[
            if (i > 0) const SizedBox(width: 2),
            _item(context, c, segments[i]),
          ],
        ],
      ),
    );
  }

  Widget _item(BuildContext context, BefColors c, BefSegment<T> s) {
    final on = s.value == value;
    return Semantics(
      inMutuallyExclusiveGroup: true,
      selected: on,
      label: s.label,
      child: BefPressable(
        semanticsRole: false,
        pressScale: 1,
        onPressed: () => onChanged(s.value),
        builder: (context, states) {
          final hover = states.contains(WidgetState.hovered);
          final fg = on || hover ? c.foreground : c.mutedForeground;
          return AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            height: 28,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: on ? c.background : Colors.transparent,
              borderRadius: BorderRadius.circular(BefRadius.md),
              boxShadow: on ? BefShadow.sm : null,
            ),
            child: DefaultTextStyle.merge(
              style: BefText.style(context, size: 13, weight: FontWeight.w500, color: fg),
              child: IconTheme.merge(
                data: IconThemeData(size: 16, color: fg),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [if (s.child != null) s.child! else Text(s.label!)],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
