import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'spinner.dart';
import 'theme.dart';

enum BefToolStatus { running, done, error }

/// A card for one tool or function call an AI made: name, status, how long it took, and the input and output you can expand.
class BefToolCall extends StatefulWidget {
  const BefToolCall({
    super.key,
    required this.name,
    required this.status,
    this.input,
    this.output,
    this.duration,
    this.initiallyOpen = false,
  });
  final String name;
  final BefToolStatus status;
  final String? input, output, duration;
  final bool initiallyOpen;

  @override
  State<BefToolCall> createState() => _BefToolCallState();
}

class _BefToolCallState extends State<BefToolCall> {
  late bool _open = widget.initiallyOpen;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final has = widget.input != null || widget.output != null;
    final (Widget icon, String text) = switch (widget.status) {
      BefToolStatus.running => (BefSpinner(size: 14, color: c.primary), 'Running'),
      BefToolStatus.done => (BefIcon(BefIcons.checkCircle, size: 16, color: c.success), 'Done'),
      BefToolStatus.error => (BefIcon(BefIcons.alertCircle, size: 16, color: c.destructive), 'Failed'),
    };
    Widget block(String label, String body) => Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            label.toUpperCase(),
            style: BefText.style(
              context,
              size: 11,
              weight: FontWeight.w500,
              color: c.mutedForeground,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 4),
          Container(
            constraints: const BoxConstraints(maxHeight: 180),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: c.muted.withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(BefRadius.lg),
            ),
            child: SingleChildScrollView(
              child: Text(body, style: BefText.style(context, size: 12, mono: true, height: 20 / 12)),
            ),
          ),
        ],
      ),
    );
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          BefPressable(
            pressScale: 1,
            semanticLabel: '${widget.name}, $text',
            onPressed: has ? () => setState(() => _open = !_open) : null,
            builder: (context, s) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              child: Row(
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(color: c.secondary, borderRadius: BorderRadius.circular(6)),
                    child: Center(child: BefIcon(BefIcons.terminal, size: 14, color: c.mutedForeground)),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      widget.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: BefText.style(context, size: 13, mono: true, weight: FontWeight.w500),
                    ),
                  ),
                  if (widget.duration != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: Text(
                        widget.duration!,
                        style: BefText.style(context, size: 12, color: c.mutedForeground),
                      ),
                    ),
                  icon,
                  const SizedBox(width: 6),
                  Text(text, style: BefText.style(context, size: 12, color: c.mutedForeground)),
                  if (has) ...[
                    const SizedBox(width: 6),
                    AnimatedRotation(
                      turns: _open ? 0.5 : 0,
                      duration: const Duration(milliseconds: 200),
                      child: BefIcon(BefIcons.chevronDown, size: 16, color: c.mutedForeground),
                    ),
                  ],
                ],
              ),
            ),
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 250),
            alignment: Alignment.topCenter,
            child: !_open || !has
                ? const SizedBox(width: double.infinity)
                : Container(
                    padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                    decoration: BoxDecoration(
                      border: Border(top: BorderSide(color: c.border)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        if (widget.input != null) block('Input', widget.input!),
                        if (widget.output != null)
                          block(widget.status == BefToolStatus.error ? 'Error' : 'Output', widget.output!),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
