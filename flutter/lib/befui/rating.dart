import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// Stars. With [onChanged] you can tap to rate (tap the same star again to clear); without it the rating is read-only.
class BefRating extends StatefulWidget {
  const BefRating({super.key, required this.value, this.onChanged, this.max = 5, this.size = 20});
  final int value;
  final ValueChanged<int>? onChanged;
  final int max;
  final double size;

  @override
  State<BefRating> createState() => _BefRatingState();
}

class _BefRatingState extends State<BefRating> {
  int _hover = 0;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final shown = _hover > 0 ? _hover : widget.value;
    return Semantics(
      label: '${widget.value} of ${widget.max} stars',
      child: MouseRegion(
        onExit: (_) => setState(() => _hover = 0),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var n = 1; n <= widget.max; n++) ...[
              if (n > 1) const SizedBox(width: 2),
              Builder(
                builder: (context) {
                  final star = AnimatedScale(
                    duration: const Duration(milliseconds: 150),
                    scale: widget.onChanged != null && n == _hover ? 1.25 : 1,
                    child: BefIcon(
                      BefIcons.star,
                      size: widget.size,
                      color: n <= shown ? c.warning : c.border,
                      fill: n <= shown ? c.warning : null,
                    ),
                  );
                  if (widget.onChanged == null) return star;
                  return MouseRegion(
                    onEnter: (_) => setState(() => _hover = n),
                    child: Semantics(
                      inMutuallyExclusiveGroup: true,
                      checked: n == widget.value,
                      label: '$n star${n > 1 ? 's' : ''}',
                      child: BefPressable(
                        semanticsRole: false,
                        pressScale: 1,
                        onPressed: () => widget.onChanged!(n == widget.value ? 0 : n),
                        builder: (_, _) => star,
                      ),
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
