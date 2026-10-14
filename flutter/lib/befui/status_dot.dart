import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

enum BefStatusTone { success, warning, danger, info, neutral }

/// A coloured dot with a label. [pulse] adds the expanding ring for "live".
class BefStatusDot extends StatefulWidget {
  const BefStatusDot({super.key, this.tone = BefStatusTone.success, this.pulse = false, this.label});
  final BefStatusTone tone;
  final bool pulse;
  final String? label;

  @override
  State<BefStatusDot> createState() => _BefStatusDotState();
}

class _BefStatusDotState extends State<BefStatusDot> with SingleTickerProviderStateMixin {
  late final AnimationController _c;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(seconds: 1));
    if (widget.pulse) _c.repeat();
  }

  @override
  void didUpdateWidget(BefStatusDot old) {
    super.didUpdateWidget(old);
    if (widget.pulse && !_c.isAnimating) _c.repeat();
    if (!widget.pulse) _c.stop();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final color = switch (widget.tone) {
      BefStatusTone.success => c.success,
      BefStatusTone.warning => c.warning,
      BefStatusTone.danger => c.destructive,
      BefStatusTone.info => c.info,
      BefStatusTone.neutral => c.mutedForeground,
    };
    final dot = Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    );
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 8,
          height: 8,
          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.center,
            children: [
              if (widget.pulse && !befReduceMotion(context))
                AnimatedBuilder(
                  animation: _c,
                  builder: (context, _) => Opacity(
                    opacity: 0.6 * (1 - _c.value),
                    child: Transform.scale(
                      scale: 1 + _c.value,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                      ),
                    ),
                  ),
                ),
              dot,
            ],
          ),
        ),
        if (widget.label != null) ...[
          const SizedBox(width: 8),
          Text(widget.label!, style: BefText.style(context, size: 13)),
        ],
      ],
    );
  }
}
