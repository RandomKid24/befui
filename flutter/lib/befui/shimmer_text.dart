import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// Text with a light sweep passing over it. Good for "new" labels and loading copy.
class BefShimmerText extends StatefulWidget {
  const BefShimmerText(this.text, {super.key, this.style});
  final String text;
  final TextStyle? style;

  @override
  State<BefShimmerText> createState() => _BefShimmerTextState();
}

class _BefShimmerTextState extends State<BefShimmerText> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 2200),
  );

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
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return AnimatedBuilder(
      animation: _c,
      builder: (context, _) => ShaderMask(
        blendMode: BlendMode.srcIn,
        shaderCallback: (r) {
          final x = -1 + 3 * _c.value; // sweeps from left of the text to right of it
          return LinearGradient(
            begin: Alignment(x - 1, 0),
            end: Alignment(x + 1, 0),
            colors: [c.mutedForeground, c.foreground, c.mutedForeground],
            stops: const [0.4, 0.5, 0.6],
          ).createShader(r);
        },
        child: Text(
          widget.text,
          style: (widget.style ?? BefText.style(context)).copyWith(color: Colors.white),
        ),
      ),
    );
  }
}
