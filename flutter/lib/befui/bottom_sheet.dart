import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import 'theme.dart';

/// Slides a sheet up from the bottom with a drag handle, a title and your content. Drag it down or tap outside to dismiss.
Future<T?> showBefBottomSheet<T>({
  required BuildContext context,
  required String title,
  String? description,
  required WidgetBuilder builder,
}) {
  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    barrierColor: const Color(0x66000000),
    elevation: 0,
    constraints: const BoxConstraints(maxWidth: 512),
    builder: (context) => BefBottomSheet(title: title, description: description, child: builder(context)),
  );
}

/// The sheet itself. Use [showBefBottomSheet] unless you place it yourself.
class BefBottomSheet extends StatelessWidget {
  const BefBottomSheet({super.key, required this.title, this.description, required this.child});
  final String title;
  final String? description;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final bottom = MediaQuery.paddingOf(context).bottom;
    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(context).height * 0.85),
      child: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(BefRadius.xl + 2)),
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: 0, sigmaY: 0),
          child: Container(
            decoration: BoxDecoration(
              color: c.popover,
              border: Border(
                top: BorderSide(color: c.border),
                left: BorderSide(color: c.border),
                right: BorderSide(color: c.border),
              ),
            ),
            padding: EdgeInsets.only(bottom: bottom < 16 ? 16 : bottom),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 12),
                    width: 40,
                    height: 6,
                    decoration: BoxDecoration(
                      color: c.mutedForeground.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(BefRadius.full),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: BefText.style(
                          context,
                          size: 16,
                          weight: FontWeight.w600,
                          color: c.popoverForeground,
                        ),
                      ),
                      if (description != null) ...[
                        const SizedBox(height: 4),
                        Text(description!, style: BefText.style(context, size: 13, color: c.mutedForeground)),
                      ],
                    ],
                  ),
                ),
                Flexible(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: child,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
