import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// A placeholder block with a shimmer. Size it with [width] and [height]; [circle] makes an avatar-style disc.
class BefSkeleton extends StatefulWidget {
  const BefSkeleton({
    super.key,
    this.width,
    this.height = 16,
    this.radius = BefRadius.md,
    this.circle = false,
  });
  final double? width;
  final double height;
  final double radius;
  final bool circle;

  @override
  State<BefSkeleton> createState() => _BefSkeletonState();
}

class _BefSkeletonState extends State<BefSkeleton> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1500),
  )..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final still = befReduceMotion(context);
    return AnimatedBuilder(
      animation: _c,
      builder: (context, _) => Container(
        width: widget.circle ? widget.height : widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(widget.circle ? BefRadius.full : widget.radius),
          gradient: still
              ? null
              : LinearGradient(
                  begin: Alignment(-3 + _c.value * 4, 0),
                  end: Alignment(-1 + _c.value * 4, 0),
                  colors: [c.secondary, c.muted, c.secondary],
                  stops: const [0.25, 0.5, 0.75],
                ),
          color: still ? c.secondary : null,
        ),
      ),
    );
  }
}
