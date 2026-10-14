import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'input.dart';
import 'theme.dart';

/// Score 0 to 4 from length and character mix. A hint for the user, not a security check.
int befPasswordScore(String v) {
  if (v.isEmpty) return 0;
  var s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (RegExp('[a-z]').hasMatch(v) && RegExp('[A-Z]').hasMatch(v)) s++;
  if (RegExp(r'\d').hasMatch(v) && RegExp('[^A-Za-z0-9]').hasMatch(v)) s++;
  return s < 1 ? 1 : s;
}

/// A password field with a show/hide button and an optional strength meter.
class BefPasswordInput extends StatefulWidget {
  const BefPasswordInput({super.key, this.controller, this.onChanged, this.placeholder, this.meter = false});
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final String? placeholder;
  final bool meter;

  @override
  State<BefPasswordInput> createState() => _BefPasswordInputState();
}

class _BefPasswordInputState extends State<BefPasswordInput> {
  bool _show = false;
  String _value = '';

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final score = befPasswordScore(_value);
    final colors = [Colors.transparent, c.destructive, c.warning, c.info, c.success];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        BefInput(
          controller: widget.controller,
          placeholder: widget.placeholder,
          obscureText: !_show,
          keyboardType: TextInputType.visiblePassword,
          autofillHints: const [AutofillHints.password],
          onChanged: (t) {
            setState(() => _value = t);
            widget.onChanged?.call(t);
          },
          trailing: BefPressable(
            semanticLabel: _show ? 'Hide password' : 'Show password',
            pressScale: 0.9,
            onPressed: () => setState(() => _show = !_show),
            builder: (_, _) => Padding(
              padding: const EdgeInsets.all(4),
              child: BefIcon(_show ? BefIcons.eyeOff : BefIcons.eye, color: c.mutedForeground),
            ),
          ),
        ),
        if (widget.meter) ...[
          const SizedBox(height: 8),
          Semantics(
            liveRegion: true,
            child: Row(
              children: [
                Expanded(
                  child: Row(
                    children: [
                      for (var i = 1; i <= 4; i++) ...[
                        if (i > 1) const SizedBox(width: 4),
                        Expanded(
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            height: 4,
                            decoration: BoxDecoration(
                              color: i <= score ? colors[score] : c.secondary,
                              borderRadius: BorderRadius.circular(BefRadius.full),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                SizedBox(
                  width: 44,
                  child: Text(
                    labels[score],
                    style: BefText.style(context, size: 12, color: c.mutedForeground),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}
