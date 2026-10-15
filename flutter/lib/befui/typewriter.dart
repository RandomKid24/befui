import 'dart:async';

import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// Types each phrase, holds, deletes it and moves on. Pass one phrase for a one-off type-in. Static text for reduced motion.
class BefTypewriter extends StatefulWidget {
  const BefTypewriter({
    super.key,
    required this.phrases,
    this.speed = const Duration(milliseconds: 55),
    this.hold = const Duration(milliseconds: 1400),
    this.loop = true,
    this.style,
  });
  final List<String> phrases;
  final Duration speed, hold;
  final bool loop;
  final TextStyle? style;

  @override
  State<BefTypewriter> createState() => _BefTypewriterState();
}

class _BefTypewriterState extends State<BefTypewriter> {
  Timer? _t;
  String _text = '';
  int _i = 0, _n = 0;
  bool _del = false, _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    if (befReduceMotion(context)) {
      _text = widget.phrases.first;
    } else {
      _t = Timer(widget.speed, _tick);
    }
  }

  void _tick() {
    final word = widget.phrases[_i];
    _n += _del ? -1 : 1;
    setState(() => _text = word.substring(0, _n));
    var wait = _del ? widget.speed ~/ 2 : widget.speed;
    if (!_del && _n == word.length) {
      if (!widget.loop && _i == widget.phrases.length - 1) return;
      _del = true;
      wait = widget.hold;
    } else if (_del && _n == 0) {
      _del = false;
      _i = (_i + 1) % widget.phrases.length;
      wait = const Duration(milliseconds: 300);
    }
    _t = Timer(wait, _tick);
  }

  @override
  void dispose() {
    _t?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final style = widget.style ?? BefText.style(context, size: 20, weight: FontWeight.w600);
    return Text.rich(
      TextSpan(
        children: [
          TextSpan(text: _text),
          TextSpan(
            text: '|',
            style: TextStyle(color: context.bef.primary),
          ),
        ],
      ),
      style: style,
    );
  }
}
