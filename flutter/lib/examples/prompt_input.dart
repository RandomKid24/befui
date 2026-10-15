import 'dart:async';

import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/icons.dart';
import '../befui/prompt_input.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  final text = TextEditingController();
  bool streaming = false;
  Timer? timer;

  @override
  void dispose() {
    timer?.cancel();
    text.dispose();
    super.dispose();
  }

  void send(String _) {
    text.clear();
    setState(() => streaming = true);
    timer = Timer(const Duration(seconds: 3), () => mounted ? setState(() => streaming = false) : null);
  }

  void stop() {
    timer?.cancel();
    setState(() => streaming = false);
  }

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Grows as you type, send becomes Stop',
      BefPromptInput(
        controller: text,
        streaming: streaming,
        onSubmit: send,
        onStop: stop,
        maxLength: 400,
        placeholder: 'Ask about leave, payroll or onboarding',
        leading: BefButton(
          size: BefButtonSize.iconSm,
          variant: BefButtonVariant.ghost,
          semanticLabel: 'Attach a file',
          onPressed: () {},
          child: const BefIcon(BefIcons.paperclip),
        ),
      ),
    ),
    ('Plain', BefPromptInput(controller: TextEditingController(), onSubmit: (_) {})),
  ]);
}

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
