import 'package:flutter/material.dart';

import 'theme.dart';

/// A form label: 14px, medium weight.
class BefLabel extends StatelessWidget {
  const BefLabel(this.text, {super.key, this.weight = FontWeight.w500, this.required = false});
  final String text;
  final FontWeight weight;
  final bool required;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Text.rich(
      TextSpan(
        children: [
          TextSpan(text: text),
          if (required)
            TextSpan(
              text: ' *',
              style: TextStyle(color: c.destructive),
            ),
        ],
      ),
      style: BefText.style(context, weight: weight, height: 1),
    );
  }
}

/// A label, the control, and a hint or an error underneath.
class BefField extends StatelessWidget {
  const BefField({super.key, this.label, this.hint, this.error, this.required = false, required this.child});
  final String? label;
  final String? hint;
  final String? error;
  final bool required;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[BefLabel(label!, required: required), const SizedBox(height: 6)],
        child,
        if (error != null) ...[
          const SizedBox(height: 6),
          Text(error!, style: BefText.style(context, size: 12, color: c.destructive)),
        ] else if (hint != null) ...[
          const SizedBox(height: 6),
          Text(hint!, style: BefText.style(context, size: 12, color: c.mutedForeground)),
        ],
      ],
    );
  }
}
