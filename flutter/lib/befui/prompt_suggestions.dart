import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

class BefSuggestion {
  const BefSuggestion({required this.id, required this.label, this.hint, this.icon});
  final String id, label;
  final String? hint;

  /// Usually a small BefIcon.
  final Widget? icon;
}

/// Starter prompts under an empty chat. [chips] false shows two-line cards (label and hint), true shows compact pills that wrap. Selecting one calls [onSelect], usually to fill the BefPromptInput.
class BefPromptSuggestions extends StatelessWidget {
  const BefPromptSuggestions({super.key, required this.items, required this.onSelect, this.chips = false});
  final List<BefSuggestion> items;
  final ValueChanged<BefSuggestion> onSelect;
  final bool chips;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    if (chips) {
      return Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          for (final s in items)
            BefPressable(
              semanticLabel: s.label,
              onPressed: () => onSelect(s),
              builder: (context, st) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                decoration: BoxDecoration(
                  color: st.contains(WidgetState.hovered) || st.contains(WidgetState.pressed)
                      ? c.accent
                      : c.card,
                  borderRadius: BorderRadius.circular(BefRadius.full),
                  border: Border.all(color: c.border),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (s.icon != null) ...[
                      IconTheme(
                        data: IconThemeData(color: c.mutedForeground, size: 14),
                        child: s.icon!,
                      ),
                      const SizedBox(width: 6),
                    ],
                    Text(s.label, style: BefText.style(context, size: 13)),
                  ],
                ),
              ),
            ),
        ],
      );
    }
    return Column(
      children: [
        for (final s in items)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: BefPressable(
              semanticLabel: s.label,
              pressScale: 0.99,
              onPressed: () => onSelect(s),
              builder: (context, st) => Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: c.card,
                  borderRadius: BorderRadius.circular(BefRadius.xl),
                  border: Border.all(
                    color: st.contains(WidgetState.hovered) ? c.primary.withValues(alpha: 0.4) : c.border,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (s.icon != null)
                      Container(
                        width: 28,
                        height: 28,
                        margin: const EdgeInsets.only(right: 12, top: 2),
                        decoration: BoxDecoration(
                          color: c.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(BefRadius.lg),
                        ),
                        child: Center(
                          child: IconTheme(
                            data: IconThemeData(color: c.primary, size: 16),
                            child: s.icon!,
                          ),
                        ),
                      ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.label, style: BefText.style(context, weight: FontWeight.w500)),
                          if (s.hint != null)
                            Text(s.hint!, style: BefText.style(context, size: 13, color: c.mutedForeground)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}
