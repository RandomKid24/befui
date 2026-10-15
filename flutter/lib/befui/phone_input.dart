import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'bottom_sheet.dart';
import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefCountry {
  const BefCountry(this.code, this.name, this.dial, this.flag, this.digits);
  final String code, name, dial, flag;

  /// Digits in a national number, used to group and to validate.
  final int digits;
}

const befCountries = [
  BefCountry('IN', 'India', '91', '🇮🇳', 10),
  BefCountry('US', 'United States', '1', '🇺🇸', 10),
  BefCountry('GB', 'United Kingdom', '44', '🇬🇧', 10),
  BefCountry('AE', 'United Arab Emirates', '971', '🇦🇪', 9),
  BefCountry('SA', 'Saudi Arabia', '966', '🇸🇦', 9),
  BefCountry('SG', 'Singapore', '65', '🇸🇬', 8),
  BefCountry('AU', 'Australia', '61', '🇦🇺', 9),
  BefCountry('CA', 'Canada', '1', '🇨🇦', 10),
  BefCountry('DE', 'Germany', '49', '🇩🇪', 10),
  BefCountry('FR', 'France', '33', '🇫🇷', 9),
  BefCountry('JP', 'Japan', '81', '🇯🇵', 10),
  BefCountry('BR', 'Brazil', '55', '🇧🇷', 11),
  BefCountry('ZA', 'South Africa', '27', '🇿🇦', 9),
  BefCountry('NG', 'Nigeria', '234', '🇳🇬', 10),
  BefCountry('EG', 'Egypt', '20', '🇪🇬', 10),
];

class BefPhoneValue {
  const BefPhoneValue({required this.country, required this.national});
  final String country;

  /// Digits only, without the country code.
  final String national;

  BefCountry get _c => befCountries.firstWhere((c) => c.code == country);

  /// International format, like +919876543210. Empty until a number is typed.
  String get e164 => national.isEmpty ? '' : '+${_c.dial}$national';

  /// True once the national number has the length the country expects.
  bool get valid => national.length == _c.digits;
}

/// Mobile number field with a country picker (flag and dial code, opens a sheet). Digits are grouped as you type.
class BefPhoneInput extends StatefulWidget {
  const BefPhoneInput({super.key, this.value, required this.onChanged, this.invalid = false});
  final BefPhoneValue? value;
  final ValueChanged<BefPhoneValue> onChanged;
  final bool invalid;

  @override
  State<BefPhoneInput> createState() => _BefPhoneInputState();
}

class _BefPhoneInputState extends State<BefPhoneInput> {
  final _focus = FocusNode();
  late final TextEditingController _text = TextEditingController(text: _group(widget.value?.national ?? ''));

  String get _country => widget.value?.country ?? 'IN';
  BefCountry get _c => befCountries.firstWhere((c) => c.code == _country);

  static String _group(String d) => d.replaceAllMapped(RegExp(r'(\d{3,5})(?=\d)'), (m) => '${m[1]} ');

  @override
  void dispose() {
    _focus.dispose();
    _text.dispose();
    super.dispose();
  }

  void _emit(String country, String national) =>
      widget.onChanged(BefPhoneValue(country: country, national: national));

  Future<void> _pick() async {
    final picked = await showBefBottomSheet<BefCountry>(
      context: context,
      title: 'Country',
      builder: (ctx) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (final c in befCountries)
            ListTile(
              dense: true,
              leading: Text(c.flag, style: const TextStyle(fontSize: 22)),
              title: Text(c.name, style: BefText.style(ctx)),
              trailing: Text('+${c.dial}', style: BefText.style(ctx, color: ctx.bef.mutedForeground)),
              onTap: () => Navigator.of(ctx).pop(c),
            ),
        ],
      ),
    );
    if (picked != null) _emit(picked.code, widget.value?.national ?? '');
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return AnimatedBuilder(
      animation: _focus,
      builder: (context, _) => AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        height: 40,
        decoration: BoxDecoration(
          color: c.background,
          borderRadius: BorderRadius.circular(BefRadius.md),
          border: Border.all(color: widget.invalid ? c.destructive : (_focus.hasFocus ? c.ring : c.input)),
          boxShadow: _focus.hasFocus
              ? [
                  BoxShadow(
                    color: (widget.invalid ? c.destructive : c.ring).withValues(alpha: 0.15),
                    spreadRadius: 3,
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            BefPressable(
              semanticLabel: 'Country ${_c.name}, +${_c.dial}',
              pressScale: 1,
              onPressed: _pick,
              builder: (context, s) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  border: Border(right: BorderSide(color: c.border)),
                ),
                child: Row(
                  children: [
                    Text(_c.flag, style: const TextStyle(fontSize: 18)),
                    const SizedBox(width: 6),
                    Text('+${_c.dial}', style: BefText.style(context, color: c.mutedForeground)),
                    const SizedBox(width: 2),
                    BefIcon(BefIcons.chevronDown, size: 14, color: c.mutedForeground),
                  ],
                ),
              ),
            ),
            Expanded(
              child: TextField(
                controller: _text,
                focusNode: _focus,
                keyboardType: TextInputType.phone,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(_c.digits + 3),
                ],
                style: BefText.style(context),
                cursorColor: c.primary,
                decoration: InputDecoration(
                  border: InputBorder.none,
                  isCollapsed: true,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                  hintText: _group('9' * _c.digits),
                  hintStyle: BefText.style(context, color: c.mutedForeground),
                ),
                onChanged: (v) {
                  final d = v.replaceAll(RegExp(r'\D'), '');
                  final cut = d.length > _c.digits ? d.substring(0, _c.digits) : d;
                  final g = _group(cut);
                  _text.value = TextEditingValue(
                    text: g,
                    selection: TextSelection.collapsed(offset: g.length),
                  );
                  _emit(_country, cut);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
