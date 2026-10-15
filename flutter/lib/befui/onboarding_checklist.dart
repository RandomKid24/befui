import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'progress.dart';
import 'theme.dart';

class BefChecklistItem {
  const BefChecklistItem({
    required this.id,
    required this.title,
    required this.done,
    this.description,
    this.action,
  });
  final String id, title;
  final bool done;
  final String? description;

  /// Button shown while the item is open.
  final Widget? action;
}

/// Getting-started card: progress bar, tick-off items with a short description and an action, collapsible. Controlled by [onToggle].
class BefOnboardingChecklist extends StatefulWidget {
  const BefOnboardingChecklist({
    super.key,
    this.title = 'Get started',
    required this.items,
    required this.onToggle,
  });
  final String title;
  final List<BefChecklistItem> items;
  final void Function(String id, bool done) onToggle;

  @override
  State<BefOnboardingChecklist> createState() => _BefOnboardingChecklistState();
}

class _BefOnboardingChecklistState extends State<BefOnboardingChecklist> {
  bool _open = true;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final done = widget.items.where((i) => i.done).length;
    final pct = done / widget.items.length * 100;
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
        boxShadow: BefShadow.sm,
      ),
      child: Column(
        children: [
          BefPressable(
            pressScale: 1,
            semanticLabel: '${widget.title}, $done of ${widget.items.length} done',
            onPressed: () => setState(() => _open = !_open),
            builder: (context, s) => Padding(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          pct == 100 ? 'All set' : widget.title,
                          style: BefText.style(context, weight: FontWeight.w600, color: c.cardForeground),
                        ),
                        Text(
                          '$done of ${widget.items.length} done',
                          style: BefText.style(context, size: 12, color: c.mutedForeground),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    width: 96,
                    child: BefProgress(
                      value: pct,
                      tone: pct == 100 ? BefProgressTone.success : BefProgressTone.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  AnimatedRotation(
                    turns: _open ? 0.5 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: BefIcon(BefIcons.chevronDown, size: 16, color: c.mutedForeground),
                  ),
                ],
              ),
            ),
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 200),
            alignment: Alignment.topCenter,
            child: !_open
                ? const SizedBox(width: double.infinity)
                : Column(
                    children: [
                      for (final it in widget.items)
                        Container(
                          decoration: BoxDecoration(
                            border: Border(top: BorderSide(color: c.border)),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              BefPressable(
                                semanticLabel: it.title,
                                onPressed: () => widget.onToggle(it.id, !it.done),
                                builder: (context, s) => Container(
                                  width: 20,
                                  height: 20,
                                  margin: const EdgeInsets.only(top: 1),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: it.done ? c.success : Colors.transparent,
                                    border: Border.all(color: it.done ? c.success : c.input, width: 1.5),
                                  ),
                                  child: it.done
                                      ? const Center(
                                          child: BefIcon(
                                            BefIcons.check,
                                            size: 12,
                                            color: Colors.white,
                                            weight: 3,
                                          ),
                                        )
                                      : null,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      it.title,
                                      style: BefText.style(
                                        context,
                                        size: 13,
                                        weight: FontWeight.w500,
                                        color: it.done ? c.mutedForeground : c.cardForeground,
                                      ).copyWith(decoration: it.done ? TextDecoration.lineThrough : null),
                                    ),
                                    if (!it.done && it.description != null)
                                      Padding(
                                        padding: const EdgeInsets.only(top: 2),
                                        child: Text(
                                          it.description!,
                                          style: BefText.style(context, size: 12, color: c.mutedForeground),
                                        ),
                                      ),
                                    if (!it.done && it.action != null)
                                      Padding(padding: const EdgeInsets.only(top: 8), child: it.action!),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}
