import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'input.dart';
import 'theme.dart';

String _group(String digits, bool indian) {
  if (digits.length <= 3) return digits;
  if (!indian) return digits.replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ',');
  final head = digits.substring(0, digits.length - 3);
  final tail = digits.substring(digits.length - 3);
  return '${head.replaceAllMapped(RegExp(r'\B(?=(\d{2})+(?!\d))'), (_) => ',')},$tail';
}

/// A money field: a currency symbol in front and digits grouped as you type (1,25,000 for ₹, 125,000 otherwise). [value] is a plain number or null.
class BefCurrencyInput extends StatefulWidget {
  const BefCurrencyInput({
    super.key,
    required this.value,
    required this.onChanged,
    this.currency = '₹',
    this.placeholder = '0',
    this.semanticLabel,
  });
  final int? value;
  final ValueChanged<int?> onChanged;
  final String currency;
  final String placeholder;
  final String? semanticLabel;

  @override
  State<BefCurrencyInput> createState() => _BefCurrencyInputState();
}

class _BefCurrencyInputState extends State<BefCurrencyInput> {
  bool get _indian => widget.currency == '₹';
  late final TextEditingController _c = TextEditingController(
    text: widget.value == null ? '' : _group('${widget.value}', _indian),
  );

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return BefInput(
      controller: _c,
      placeholder: widget.placeholder,
      keyboardType: TextInputType.number,
      semanticLabel: widget.semanticLabel,
      leading: Text(widget.currency, style: BefText.style(context, color: c.mutedForeground)),
      inputFormatters: [
        FilteringTextInputFormatter.digitsOnly,
        TextInputFormatter.withFunction((old, v) {
          final text = _group(v.text, _indian);
          return TextEditingValue(
            text: text,
            selection: TextSelection.collapsed(offset: text.length),
          );
        }),
      ],
      onChanged: (t) => widget.onChanged(t.isEmpty ? null : int.tryParse(t.replaceAll(',', ''))),
    );
  }
}
