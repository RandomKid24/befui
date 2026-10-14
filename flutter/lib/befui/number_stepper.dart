import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// A number with minus and plus buttons on either side. The number can be typed too.
class BefNumberStepper extends StatefulWidget {
  const BefNumberStepper({
    super.key,
    required this.value,
    required this.onChanged,
    this.min = 0,
    this.max = 99,
    this.step = 1,
  });
  final int value;
  final ValueChanged<int> onChanged;
  final int min, max, step;

  @override
  State<BefNumberStepper> createState() => _BefNumberStepperState();
}

class _BefNumberStepperState extends State<BefNumberStepper> {
  late final TextEditingController _text = TextEditingController(text: '${widget.value}');

  @override
  void didUpdateWidget(BefNumberStepper old) {
    super.didUpdateWidget(old);
    if (int.tryParse(_text.text) != widget.value) _text.text = '${widget.value}';
  }

  @override
  void dispose() {
    _text.dispose();
    super.dispose();
  }

  void _set(int v) => widget.onChanged(v.clamp(widget.min, widget.max));

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    Widget btn(Widget icon, String label, VoidCallback? onTap) => BefPressable(
      enabled: onTap != null,
      semanticLabel: label,
      pressScale: 0.9,
      onPressed: onTap,
      builder: (context, states) => Opacity(
        opacity: onTap == null ? 0.4 : 1,
        child: Container(
          width: 36,
          height: 36,
          alignment: Alignment.center,
          color: states.contains(WidgetState.hovered) ? c.secondary : null,
          child: icon,
        ),
      ),
    );
    return Container(
      decoration: BoxDecoration(
        color: c.background,
        borderRadius: BorderRadius.circular(BefRadius.md),
        border: Border.all(color: c.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          btn(
            BefIcon(BefIcons.minus, size: 16, color: c.mutedForeground),
            'Decrease',
            widget.value > widget.min ? () => _set(widget.value - widget.step) : null,
          ),
          Container(
            width: 48,
            height: 36,
            decoration: BoxDecoration(
              border: Border.symmetric(vertical: BorderSide(color: c.border)),
            ),
            alignment: Alignment.center,
            child: TextField(
              controller: _text,
              textAlign: TextAlign.center,
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              style: BefText.style(
                context,
                weight: FontWeight.w500,
              ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
              cursorColor: c.primary,
              decoration: const InputDecoration.collapsed(hintText: ''),
              onChanged: (t) {
                final v = int.tryParse(t);
                if (v != null) _set(v);
              },
              onTapOutside: (_) => _text.text = '${widget.value}',
            ),
          ),
          btn(
            BefIcon(BefIcons.plus, size: 16, color: c.mutedForeground),
            'Increase',
            widget.value < widget.max ? () => _set(widget.value + widget.step) : null,
          ),
        ],
      ),
    );
  }
}
