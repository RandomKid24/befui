import 'package:flutter/material.dart';

import 'bottom_sheet.dart';
import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefModel {
  const BefModel({
    required this.id,
    required this.name,
    this.description,
    this.context,
    this.tags = const [],
  });
  final String id, name;
  final String? description;

  /// Context window, already formatted, e.g. "200K".
  final String? context;
  final List<String> tags;
}

/// Picker for which model answers: a compact button that opens a bottom sheet listing each model with a description, context size and tags such as Fast or Vision.
class BefModelPicker extends StatelessWidget {
  const BefModelPicker({super.key, required this.models, required this.value, required this.onChanged});
  final List<BefModel> models;
  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final current = models.firstWhere((m) => m.id == value, orElse: () => models.first);
    return BefPressable(
      semanticLabel: 'Model: ${current.name}',
      onPressed: () => showBefBottomSheet<void>(
        context: context,
        title: 'Model',
        builder: (ctx) => Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (final m in models)
              InkWell(
                borderRadius: BorderRadius.circular(BefRadius.lg),
                onTap: () {
                  onChanged(m.id);
                  Navigator.of(ctx).pop();
                },
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 24,
                        child: m.id == value ? BefIcon(BefIcons.check, size: 16, color: c.primary) : null,
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(m.name, style: BefText.style(ctx, weight: FontWeight.w500)),
                                if (m.context != null) ...[
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                    decoration: BoxDecoration(
                                      color: c.muted,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      m.context!,
                                      style: BefText.style(
                                        ctx,
                                        size: 10,
                                        mono: true,
                                        color: c.mutedForeground,
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            if (m.description != null)
                              Text(
                                m.description!,
                                style: BefText.style(ctx, size: 13, color: c.mutedForeground),
                              ),
                            if (m.tags.isNotEmpty)
                              Padding(
                                padding: const EdgeInsets.only(top: 6),
                                child: Wrap(
                                  spacing: 4,
                                  runSpacing: 4,
                                  children: [
                                    for (final t in m.tags)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 1),
                                        decoration: BoxDecoration(
                                          borderRadius: BorderRadius.circular(BefRadius.full),
                                          border: Border.all(color: c.border),
                                        ),
                                        child: Text(
                                          t,
                                          style: BefText.style(ctx, size: 11, color: c.mutedForeground),
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
                ),
              ),
          ],
        ),
      ),
      builder: (context, s) => Container(
        height: 32,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: s.contains(WidgetState.hovered) || s.contains(WidgetState.pressed)
              ? c.secondary
              : Colors.transparent,
          borderRadius: BorderRadius.circular(BefRadius.full),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              current.name,
              style: BefText.style(context, size: 13, weight: FontWeight.w500, color: c.mutedForeground),
            ),
            const SizedBox(width: 6),
            BefIcon(BefIcons.chevronsUpDown, size: 14, color: c.mutedForeground),
          ],
        ),
      ),
    );
  }
}
