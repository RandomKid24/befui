import 'package:flutter/material.dart';

import 'button.dart';
import 'dialog.dart';
import 'icons.dart';
import 'theme.dart';

/// Asks the user to confirm. Resolves to true when they confirm, false or null otherwise.
Future<bool?> showBefAlertDialog({
  required BuildContext context,
  required String title,
  String? description,
  String confirmLabel = 'Confirm',
  String cancelLabel = 'Cancel',
  bool destructive = false,
}) {
  return showBefDialog<bool>(
    context: context,
    builder: (context) => BefAlertDialog(
      title: title,
      description: description,
      confirmLabel: confirmLabel,
      cancelLabel: cancelLabel,
      destructive: destructive,
      onResult: (v) => Navigator.of(context).pop(v),
    ),
  );
}

/// The panel of a confirmation dialog. Use [showBefAlertDialog] unless you need to place it yourself.
class BefAlertDialog extends StatelessWidget {
  const BefAlertDialog({
    super.key,
    required this.title,
    this.description,
    this.confirmLabel = 'Confirm',
    this.cancelLabel = 'Cancel',
    this.destructive = false,
    required this.onResult,
  });
  final String title;
  final String? description;
  final String confirmLabel, cancelLabel;
  final bool destructive;
  final ValueChanged<bool> onResult;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Semantics(
      scopesRoute: true,
      explicitChildNodes: true,
      namesRoute: true,
      label: title,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 384),
        child: BefDialog(
          maxWidth: 384,
          actions: [
            BefButton(
              label: cancelLabel,
              variant: BefButtonVariant.outline,
              onPressed: () => onResult(false),
            ),
            BefButton(
              label: confirmLabel,
              variant: destructive ? BefButtonVariant.destructive : BefButtonVariant.primary,
              onPressed: () => onResult(true),
            ),
          ],
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: destructive ? c.destructive.withValues(alpha: 0.1) : c.accent,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: BefIcon(
                  BefIcons.alert,
                  size: 20,
                  color: destructive ? c.destructive : c.accentForeground,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: BefText.style(context, size: 16, weight: FontWeight.w600, letterSpacing: -0.2),
              ),
              if (description != null) ...[
                const SizedBox(height: 4),
                Text(description!, style: BefText.style(context, size: 13, color: c.mutedForeground)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
