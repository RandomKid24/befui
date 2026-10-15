import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'button.dart';
import 'core.dart';
import 'icons.dart';
import 'input.dart';
import 'theme.dart';

/// A promo-code field. [onApply] says whether the code is good; while it works the button shows a spinner.
/// [applied] (controlled by you) swaps the field for a green chip with a remove button.
class BefCouponInput extends StatefulWidget {
  const BefCouponInput({super.key, required this.onApply, this.onRemove, this.applied, this.hint});
  final Future<bool> Function(String code) onApply;
  final VoidCallback? onRemove;
  final String? applied;
  final String? hint;

  @override
  State<BefCouponInput> createState() => _BefCouponInputState();
}

class _BefCouponInputState extends State<BefCouponInput> {
  final TextEditingController _code = TextEditingController();
  bool _busy = false;
  String _error = '';

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final code = _code.text.trim();
    if (code.isEmpty) return;
    setState(() {
      _busy = true;
      _error = '';
    });
    final ok = await widget.onApply(code);
    if (!mounted) return;
    setState(() => _busy = false);
    if (ok) {
      _code.clear();
    } else {
      setState(() => _error = 'That code is not valid.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    if (widget.applied != null) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: c.success.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(BefRadius.md),
              border: Border.all(color: c.success.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                BefIcon(BefIcons.checkCircle, size: 16, color: c.success),
                const SizedBox(width: 8),
                Expanded(
                  child: Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(
                          text: widget.applied,
                          style: BefText.style(
                            context,
                            size: 13,
                            weight: FontWeight.w500,
                            color: c.success,
                            mono: true,
                          ),
                        ),
                        const TextSpan(text: ' applied'),
                      ],
                    ),
                    style: BefText.style(context, size: 13, color: c.success),
                  ),
                ),
                if (widget.onRemove != null)
                  BefPressable(
                    semanticLabel: 'Remove code',
                    pressScale: 0.9,
                    onPressed: widget.onRemove,
                    builder: (_, _) => Padding(
                      padding: const EdgeInsets.all(3),
                      child: BefIcon(BefIcons.x, size: 14, color: c.success),
                    ),
                  ),
              ],
            ),
          ),
          if (widget.hint != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 4, 4, 0),
              child: Text(widget.hint!, style: BefText.style(context, size: 12, color: c.mutedForeground)),
            ),
        ],
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Expanded(
              child: BefInput(
                controller: _code,
                placeholder: 'Promo code',
                invalid: _error.isNotEmpty,
                textInputAction: TextInputAction.done,
                inputFormatters: [
                  TextInputFormatter.withFunction((o, n) => n.copyWith(text: n.text.toUpperCase())),
                ],
                onChanged: (_) => setState(() => _error = ''),
                onSubmitted: (_) => _submit(),
              ),
            ),
            const SizedBox(width: 8),
            BefButton(
              label: 'Apply',
              variant: BefButtonVariant.outline,
              loading: _busy,
              onPressed: _code.text.trim().isEmpty ? null : _submit,
            ),
          ],
        ),
        if (_error.isNotEmpty)
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 4, 4, 0),
            child: Text(_error, style: BefText.style(context, size: 12, color: c.destructive)),
          ),
      ],
    );
  }
}
