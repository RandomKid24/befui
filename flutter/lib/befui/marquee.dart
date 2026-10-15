import 'package:flutter/material.dart';

import 'core.dart';

/// Endless horizontal scroll with soft edge fade. [speed] is seconds per loop. Static with reduced motion.
class BefMarquee extends StatefulWidget {
  const BefMarquee({super.key, required this.children, this.speed = 30, this.reverse = false, this.gap = 32});
  final List<Widget> children;
  final double speed, gap;
  final bool reverse;

  @override
  State<BefMarquee> createState() => _BefMarqueeState();
}

class _BefMarqueeState extends State<BefMarquee> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: Duration(milliseconds: (widget.speed * 1000).round()),
  );
  final _scroll = ScrollController();

  // Three copies in a row; scrolling by one copy's width (a third of the content) and wrapping looks endless. Needs one copy wider than the viewport.
  void _sync() {
    if (!_scroll.hasClients) return;
    final one = (_scroll.position.maxScrollExtent + _scroll.position.viewportDimension) / 3;
    final t = widget.reverse ? 1 - _c.value : _c.value;
    _scroll.jumpTo(one * t);
  }

  @override
  void initState() {
    super.initState();
    _c.addListener(_sync);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (befReduceMotion(context)) {
      _c.stop();
    } else if (!_c.isAnimating) {
      _c.repeat();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Widget copy() => Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (final w in widget.children)
          Padding(
            padding: EdgeInsets.only(right: widget.gap),
            child: w,
          ),
      ],
    );
    return ShaderMask(
      shaderCallback: (r) => const LinearGradient(
        colors: [Colors.transparent, Colors.black, Colors.black, Colors.transparent],
        stops: [0, 0.12, 0.88, 1],
      ).createShader(r),
      blendMode: BlendMode.dstIn,
      child: SingleChildScrollView(
        controller: _scroll,
        scrollDirection: Axis.horizontal,
        physics: const NeverScrollableScrollPhysics(),
        child: Row(mainAxisSize: MainAxisSize.min, children: [copy(), copy(), copy()]),
      ),
    );
  }
}
