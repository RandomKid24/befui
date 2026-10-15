import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// Audio level bars for a voice input: they dance while [active] and settle to a flat line when not. Give it a real [level] (0 to 1, from your recorder) to drive the height, or leave it out for a gentle idle motion.
class BefVoiceWave extends StatefulWidget {
  const BefVoiceWave({super.key, this.active = true, this.level, this.bars = 24, this.height = 40});
  final bool active;
  final double? level;
  final int bars;
  final double height;

  @override
  State<BefVoiceWave> createState() => _BefVoiceWaveState();
}

class _BefVoiceWaveState extends State<BefVoiceWave> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _sync();
  }

  @override
  void didUpdateWidget(BefVoiceWave old) {
    super.didUpdateWidget(old);
    _sync();
  }

  void _sync() {
    if (widget.active && widget.level == null && !befReduceMotion(context)) {
      if (!_c.isAnimating) _c.repeat();
    } else {
      _c.stop();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Semantics(
      label: widget.active ? 'Listening' : 'Not listening',
      child: SizedBox(
        height: widget.height,
        child: AnimatedBuilder(
          animation: _c,
          builder: (context, _) => Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var i = 0; i < widget.bars; i++)
                () {
                  final seed = ((i * 7919) % 97) / 97;
                  final f = !widget.active
                      ? 0.1
                      : widget.level != null
                      ? math.max(0.12, widget.level! * (0.5 + seed * 0.5))
                      : 0.25 + 0.75 * (0.5 + 0.5 * math.sin((_c.value * 2 * math.pi) + seed * 6.28));
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 90),
                    width: 3,
                    height: widget.height * f,
                    margin: const EdgeInsets.symmetric(horizontal: 1.5),
                    decoration: BoxDecoration(
                      color: widget.active
                          ? c.primary.withValues(alpha: 0.5 + seed * 0.5)
                          : c.mutedForeground.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  );
                }(),
            ],
          ),
        ),
      ),
    );
  }
}
