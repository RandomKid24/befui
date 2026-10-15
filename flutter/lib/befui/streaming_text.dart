import 'dart:async';

import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// Text that arrives word by word, each word fading up, with a caret that follows the last one. Pass the whole [text] and a [speed] in words per second, or grow [text] yourself as tokens arrive. Reduced motion shows everything at once.
class BefStreamingText extends StatefulWidget {
  const BefStreamingText({
    super.key,
    required this.text,
    this.speed = 14,
    this.caret = true,
    this.onDone,
    this.style,
  });
  final String text;
  final double speed;
  final bool caret;
  final VoidCallback? onDone;
  final TextStyle? style;

  @override
  State<BefStreamingText> createState() => _BefStreamingTextState();
}

class _BefStreamingTextState extends State<BefStreamingText> with SingleTickerProviderStateMixin {
  late final AnimationController _blink = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  );
  Timer? _t;
  late List<String> _words = _split(widget.text);
  int _shown = 0;
  bool _started = false;

  static List<String> _split(String t) => RegExp(r'\S+\s*').allMatches(t).map((m) => m[0]!).toList();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    if (befReduceMotion(context)) {
      _shown = _words.length;
    } else {
      _blink.repeat(reverse: true);
      _schedule();
    }
  }

  void _schedule() {
    _t?.cancel();
    if (_shown >= _words.length) {
      _blink.stop();
      widget.onDone?.call();
      return;
    }
    _t = Timer(Duration(milliseconds: (1000 / widget.speed).round()), () {
      if (!mounted) return;
      setState(() => _shown++);
      _schedule();
    });
  }

  @override
  void didUpdateWidget(BefStreamingText old) {
    super.didUpdateWidget(old);
    if (old.text != widget.text) {
      _words = _split(widget.text);
      if (_shown > _words.length) _shown = _words.length;
      if (!_blink.isAnimating) _blink.repeat(reverse: true);
      _schedule();
    }
  }

  @override
  void dispose() {
    _t?.cancel();
    _blink.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final style = widget.style ?? BefText.style(context, height: 1.6);
    final done = _shown >= _words.length;
    return Semantics(
      label: widget.text,
      child: ExcludeSemantics(
        child: Text.rich(
          TextSpan(
            style: style,
            children: [
              for (var i = 0; i < _shown; i++)
                WidgetSpan(
                  alignment: PlaceholderAlignment.baseline,
                  baseline: TextBaseline.alphabetic,
                  child: i >= _shown - 2 && !befReduceMotion(context)
                      ? TweenAnimationBuilder<double>(
                          tween: Tween(begin: 0, end: 1),
                          duration: const Duration(milliseconds: 400),
                          curve: Curves.easeOutCubic,
                          builder: (context, v, child) => Opacity(
                            opacity: v,
                            child: Transform.translate(offset: Offset(0, 3 * (1 - v)), child: child),
                          ),
                          child: Text(_words[i], style: style),
                        )
                      : Text(_words[i], style: style),
                ),
              if (widget.caret && !done)
                WidgetSpan(
                  alignment: PlaceholderAlignment.middle,
                  child: FadeTransition(
                    opacity: _blink,
                    child: Container(
                      width: 2,
                      height: (style.fontSize ?? 14) + 2,
                      margin: const EdgeInsets.only(left: 2),
                      color: c.primary,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
