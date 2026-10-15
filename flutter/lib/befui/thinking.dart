import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefThinkingStep {
  const BefThinkingStep(this.label, {this.done = false});
  final String label;
  final bool done;
}

/// "Thinking" status for a model that is working: a shimmering label with three bouncing dots. Give it [steps] and it becomes a collapsible list with a check on each finished step. Set [done] to settle it into "Thought for 4s".
class BefThinking extends StatefulWidget {
  const BefThinking({super.key, this.label = 'Thinking', this.steps, this.done = false, this.took});
  final String label;
  final List<BefThinkingStep>? steps;
  final bool done;
  final String? took;

  @override
  State<BefThinking> createState() => _BefThinkingState();
}

class _BefThinkingState extends State<BefThinking> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1500),
  );
  bool _open = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!widget.done && !befReduceMotion(context)) {
      if (!_c.isAnimating) _c.repeat();
    } else {
      _c.stop();
    }
  }

  @override
  void didUpdateWidget(BefThinking old) {
    super.didUpdateWidget(old);
    if (widget.done) {
      _c.stop();
    } else if (!_c.isAnimating && !befReduceMotion(context)) {
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
    final text = widget.done ? 'Thought${widget.took == null ? '' : ' for ${widget.took}'}' : widget.label;
    final style = BefText.style(context, weight: FontWeight.w500, color: Colors.white);
    final head = AnimatedBuilder(
      animation: _c,
      builder: (context, _) => Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (!widget.done) ...[
            for (var i = 0; i < 3; i++)
              Container(
                width: 6,
                height: 6,
                margin: EdgeInsets.only(
                  right: 4,
                  bottom: 4 * (0.5 - (((_c.value * 3 - i) % 3) / 3 - 0.5).abs()).clamp(0, 1) * 2,
                ),
                decoration: BoxDecoration(color: c.primary, shape: BoxShape.circle),
              ),
            const SizedBox(width: 4),
          ],
          widget.done
              ? Text(text, style: BefText.style(context, color: c.mutedForeground))
              : ShaderMask(
                  blendMode: BlendMode.srcIn,
                  shaderCallback: (r) {
                    final x = -1 + 3 * _c.value;
                    return LinearGradient(
                      begin: Alignment(x - 1, 0),
                      end: Alignment(x + 1, 0),
                      colors: [c.mutedForeground, c.foreground, c.mutedForeground],
                      stops: const [0.4, 0.5, 0.6],
                    ).createShader(r);
                  },
                  child: Text(text, style: style),
                ),
        ],
      ),
    );
    final steps = widget.steps;
    if (steps == null || steps.isEmpty) return Semantics(liveRegion: true, child: head);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BefPressable(
          pressScale: 1,
          semanticLabel: text,
          onPressed: () => setState(() => _open = !_open),
          builder: (context, s) => Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              head,
              const SizedBox(width: 6),
              AnimatedRotation(
                turns: _open ? 0.5 : 0,
                duration: const Duration(milliseconds: 200),
                child: BefIcon(BefIcons.chevronDown, size: 14, color: c.mutedForeground),
              ),
            ],
          ),
        ),
        AnimatedSize(
          duration: const Duration(milliseconds: 250),
          alignment: Alignment.topCenter,
          child: !_open
              ? const SizedBox(width: double.infinity)
              : Container(
                  margin: const EdgeInsets.only(top: 8, left: 3),
                  padding: const EdgeInsets.only(left: 16),
                  decoration: BoxDecoration(
                    border: Border(left: BorderSide(color: c.border)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      for (final s in steps)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 3),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 16,
                                height: 16,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: s.done
                                      ? c.success.withValues(alpha: 0.15)
                                      : c.primary.withValues(alpha: 0.1),
                                ),
                                child: Center(
                                  child: s.done
                                      ? BefIcon(BefIcons.check, size: 10, color: c.success, weight: 3)
                                      : Container(
                                          width: 6,
                                          height: 6,
                                          decoration: BoxDecoration(color: c.primary, shape: BoxShape.circle),
                                        ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                s.label,
                                style: BefText.style(
                                  context,
                                  size: 13,
                                  color: s.done ? c.mutedForeground : c.foreground,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
        ),
      ],
    );
  }
}
