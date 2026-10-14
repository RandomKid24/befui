import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'input.dart';
import 'theme.dart';

/// A search field with a clear button. The search icon turns `primary` while it has focus.
class BefSearchInput extends StatefulWidget {
  const BefSearchInput({
    super.key,
    required this.value,
    required this.onChanged,
    this.placeholder = 'Search',
    this.onSubmitted,
  });
  final String value;
  final ValueChanged<String> onChanged;
  final ValueChanged<String>? onSubmitted;
  final String placeholder;

  @override
  State<BefSearchInput> createState() => _BefSearchInputState();
}

class _BefSearchInputState extends State<BefSearchInput> {
  late final TextEditingController _c = TextEditingController(text: widget.value);
  final FocusNode _focus = FocusNode();

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() {}));
    _c.addListener(() => setState(() {}));
  }

  @override
  void didUpdateWidget(BefSearchInput old) {
    super.didUpdateWidget(old);
    if (_c.text != widget.value) _c.text = widget.value;
  }

  @override
  void dispose() {
    _c.dispose();
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return BefInput(
      controller: _c,
      focusNode: _focus,
      placeholder: widget.placeholder,
      keyboardType: TextInputType.text,
      textInputAction: TextInputAction.search,
      onChanged: widget.onChanged,
      onSubmitted: widget.onSubmitted,
      leading: BefIcon(BefIcons.search, color: _focus.hasFocus ? c.primary : c.mutedForeground),
      trailing: _c.text.isEmpty
          ? null
          : BefPressable(
              semanticLabel: 'Clear',
              pressScale: 0.9,
              onPressed: () {
                _c.clear();
                widget.onChanged('');
              },
              builder: (_, _) => Padding(
                padding: const EdgeInsets.all(4),
                child: BefIcon(BefIcons.x, size: 14, color: c.mutedForeground),
              ),
            ),
    );
  }
}
