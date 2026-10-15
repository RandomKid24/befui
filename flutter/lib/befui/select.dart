import 'package:flutter/material.dart';

import 'dropdown_menu.dart';
import 'icons.dart';
import 'theme.dart';

class BefSelectOption<T> {
  const BefSelectOption({required this.value, required this.label});
  final T value;
  final String label;
}

/// A dropdown that looks like an input: pick one option from a list.
class BefSelect<T> extends StatefulWidget {
  const BefSelect({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.placeholder = 'Select...',
    this.enabled = true,
  });
  final List<BefSelectOption<T>> options;
  final T? value;
  final ValueChanged<T> onChanged;
  final String placeholder;
  final bool enabled;

  @override
  State<BefSelect<T>> createState() => _BefSelectState<T>();
}

class _BefSelectState<T> extends State<BefSelect<T>> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final selected = widget.options.where((o) => o.value == widget.value).firstOrNull;
    return LayoutBuilder(
      builder: (context, box) {
        return MenuAnchor(
          style: befMenuStyle(context, minWidth: box.maxWidth.isFinite ? box.maxWidth : 160),
          alignmentOffset: const Offset(0, 6),
          menuChildren: [
            for (final o in widget.options)
              MenuItemButton(
                style: befMenuItemStyle(context),
                leadingIcon: SizedBox(
                  width: 16,
                  child: o.value == widget.value
                      ? BefIcon(BefIcons.check, size: 14, color: c.primary, weight: 2.5)
                      : null,
                ),
                onPressed: () => widget.onChanged(o.value),
                child: Text(o.label),
              ),
          ],
          builder: (context, controller, _) => Opacity(
            opacity: widget.enabled ? 1 : 0.5,
            child: MouseRegion(
              onEnter: (_) => setState(() => _hover = true),
              onExit: (_) => setState(() => _hover = false),
              child: Semantics(
                button: true,
                enabled: widget.enabled,
                label: selected?.label ?? widget.placeholder,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: widget.enabled
                      ? () => controller.isOpen ? controller.close() : controller.open()
                      : null,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    height: 36,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: c.background,
                      borderRadius: BorderRadius.circular(BefRadius.md),
                      border: Border.all(
                        color: controller.isOpen
                            ? c.ring
                            : (_hover ? c.mutedForeground.withValues(alpha: 0.4) : c.input),
                      ),
                      boxShadow: controller.isOpen
                          ? [BoxShadow(color: c.ring.withValues(alpha: 0.15), spreadRadius: 3)]
                          : null,
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            selected?.label ?? widget.placeholder,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: BefText.style(
                              context,
                              color: selected == null ? c.mutedForeground : c.foreground,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        BefIcon(BefIcons.chevronDown, size: 16, color: c.mutedForeground),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
