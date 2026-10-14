import 'package:flutter/material.dart';

import 'theme.dart';

/// A slider with a filled track and a value bubble above the thumb while you drag.
class BefSlider extends StatefulWidget {
  const BefSlider({
    super.key,
    required this.value,
    required this.onChanged,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.showValue = true,
    this.format,
    this.semanticLabel,
  });
  final double value;
  final ValueChanged<double> onChanged;
  final double min, max, step;
  final bool showValue;
  final String Function(double)? format;
  final String? semanticLabel;

  @override
  State<BefSlider> createState() => _BefSliderState();
}

class _BefSliderState extends State<BefSlider> {
  bool _drag = false;

  String _fmt(double v) => widget.format != null
      ? widget.format!(v)
      : (v == v.roundToDouble() ? v.toInt().toString() : v.toString());

  void _set(double dx, double width) {
    final t = ((dx - 8) / (width - 16)).clamp(0.0, 1.0);
    var v = widget.min + t * (widget.max - widget.min);
    v = (v / widget.step).round() * widget.step;
    widget.onChanged(v.clamp(widget.min, widget.max));
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final span = widget.max - widget.min;
    final t = ((widget.value - widget.min) / span).clamp(0.0, 1.0);
    return Semantics(
      slider: true,
      label: widget.semanticLabel,
      value: _fmt(widget.value),
      increasedValue: _fmt((widget.value + widget.step).clamp(widget.min, widget.max)),
      decreasedValue: _fmt((widget.value - widget.step).clamp(widget.min, widget.max)),
      onIncrease: () => widget.onChanged((widget.value + widget.step).clamp(widget.min, widget.max)),
      onDecrease: () => widget.onChanged((widget.value - widget.step).clamp(widget.min, widget.max)),
      child: LayoutBuilder(
        builder: (context, box) {
          final w = box.maxWidth;
          final x = 8 + t * (w - 16);
          return GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTapDown: (d) => _set(d.localPosition.dx, w),
            onHorizontalDragStart: (d) => setState(() => _drag = true),
            onHorizontalDragUpdate: (d) => _set(d.localPosition.dx, w),
            onHorizontalDragEnd: (_) => setState(() => _drag = false),
            onHorizontalDragCancel: () => setState(() => _drag = false),
            child: SizedBox(
              height: 44,
              child: Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.centerLeft,
                children: [
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 8,
                    height: 16,
                    child: Stack(
                      clipBehavior: Clip.none,
                      alignment: Alignment.centerLeft,
                      children: [
                        Container(
                          height: 6,
                          decoration: BoxDecoration(
                            color: c.secondary,
                            borderRadius: BorderRadius.circular(BefRadius.full),
                          ),
                        ),
                        Container(
                          width: x,
                          height: 6,
                          decoration: BoxDecoration(
                            color: c.primary,
                            borderRadius: BorderRadius.circular(BefRadius.full),
                          ),
                        ),
                        Positioned(
                          left: x - 8,
                          child: AnimatedScale(
                            duration: const Duration(milliseconds: 150),
                            scale: _drag ? 1.3 : 1,
                            child: Container(
                              width: 16,
                              height: 16,
                              decoration: BoxDecoration(
                                color: c.background,
                                shape: BoxShape.circle,
                                border: Border.all(color: c.primary, width: 2),
                                boxShadow: const [
                                  BoxShadow(color: Color(0x33000000), blurRadius: 3, offset: Offset(0, 1)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (widget.showValue)
                    Positioned(
                      left: x,
                      top: 0,
                      child: FractionalTranslation(
                        translation: const Offset(-0.5, 0),
                        child: AnimatedOpacity(
                          duration: const Duration(milliseconds: 150),
                          opacity: _drag ? 1 : 0,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: c.foreground,
                              borderRadius: BorderRadius.circular(BefRadius.md),
                            ),
                            child: Text(
                              _fmt(widget.value),
                              style: BefText.style(
                                context,
                                size: 11,
                                weight: FontWeight.w500,
                                color: c.background,
                                height: 1.2,
                              ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
