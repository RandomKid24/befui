import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// Code with an optional title, line numbers and a copy button. Plain text, no syntax highlighter. Long lines scroll sideways.
class BefCodeBlock extends StatefulWidget {
  const BefCodeBlock({super.key, required this.code, this.title, this.lineNumbers = false, this.maxHeight});
  final String code;
  final String? title;
  final bool lineNumbers;
  final double? maxHeight;

  @override
  State<BefCodeBlock> createState() => _BefCodeBlockState();
}

class _BefCodeBlockState extends State<BefCodeBlock> {
  bool _copied = false;

  Future<void> _copy() async {
    await Clipboard.setData(ClipboardData(text: widget.code));
    if (!mounted) return;
    setState(() => _copied = true);
    await Future<void>.delayed(const Duration(milliseconds: 1500));
    if (mounted) setState(() => _copied = false);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final lines = widget.code.replaceFirst(RegExp(r'\n$'), '').split('\n');
    final mono = BefText.style(context, size: 12.5, mono: true, height: 24 / 12.5);
    final body = SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (var i = 0; i < lines.length; i++)
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (widget.lineNumbers)
                  SizedBox(
                    width: 36,
                    child: Padding(
                      padding: const EdgeInsets.only(right: 16),
                      child: Text(
                        '${i + 1}',
                        textAlign: TextAlign.right,
                        style: mono.copyWith(color: c.mutedForeground.withValues(alpha: 0.5)),
                      ),
                    ),
                  ),
                Text(lines[i].isEmpty ? ' ' : lines[i], style: mono),
              ],
            ),
        ],
      ),
    );
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.muted.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(BefRadius.lg),
        border: Border.all(color: c.border),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            height: 36,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: c.muted,
              border: Border(bottom: BorderSide(color: c.border)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    widget.title ?? '',
                    style: BefText.style(context, size: 12, mono: true, color: c.mutedForeground),
                  ),
                ),
                BefPressable(
                  semanticLabel: 'Copy code',
                  onPressed: _copy,
                  builder: (context, s) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                    child: Row(
                      children: [
                        BefIcon(
                          _copied ? BefIcons.check : BefIcons.copy,
                          size: 14,
                          color: _copied ? c.success : c.mutedForeground,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _copied ? 'Copied' : 'Copy',
                          style: BefText.style(context, size: 12, color: c.mutedForeground),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          if (widget.maxHeight != null)
            ConstrainedBox(
              constraints: BoxConstraints(maxHeight: widget.maxHeight!),
              child: SingleChildScrollView(child: body),
            )
          else
            body,
        ],
      ),
    );
  }
}
