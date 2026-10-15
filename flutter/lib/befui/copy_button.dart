import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// An icon button that copies [value] and turns into a check for two seconds.
class BefCopyButton extends StatefulWidget {
  const BefCopyButton({super.key, required this.value, this.onCopied});
  final String value;
  final VoidCallback? onCopied;

  @override
  State<BefCopyButton> createState() => _BefCopyButtonState();
}

class _BefCopyButtonState extends State<BefCopyButton> {
  bool _done = false;
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _copy() async {
    await Clipboard.setData(ClipboardData(text: widget.value));
    widget.onCopied?.call();
    if (!mounted) return;
    setState(() => _done = true);
    _timer?.cancel();
    _timer = Timer(const Duration(seconds: 2), () => mounted ? setState(() => _done = false) : null);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return BefPressable(
      semanticLabel: _done ? 'Copied' : 'Copy',
      onPressed: _copy,
      builder: (context, states) {
        final hover = states.contains(WidgetState.hovered);
        return Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: c.background,
            borderRadius: BorderRadius.circular(BefRadius.md),
            border: Border.all(color: c.border),
            boxShadow: states.contains(WidgetState.focused)
                ? [BoxShadow(color: befOpacity(c.ring, 0.5), spreadRadius: 2)]
                : null,
          ),
          alignment: Alignment.center,
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 200),
            transitionBuilder: (child, a) => ScaleTransition(
              scale: Tween(begin: 0.5, end: 1.0).animate(a),
              child: FadeTransition(opacity: a, child: child),
            ),
            child: BefIcon(
              _done ? BefIcons.check : BefIcons.copy,
              key: ValueKey(_done),
              size: 16,
              color: hover || _done ? c.foreground : c.mutedForeground,
            ),
          ),
        );
      },
    );
  }
}
