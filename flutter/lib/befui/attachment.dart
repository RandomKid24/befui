import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

enum BefAttachmentStatus { uploading, done, error }

/// A file attached to a prompt: icon or thumbnail, name, size and a thin progress line while it uploads. [status] error turns it red. [onRemove] shows the x.
class BefAttachment extends StatelessWidget {
  const BefAttachment({
    super.key,
    required this.name,
    this.size,
    this.status = BefAttachmentStatus.done,
    this.progress,
    this.preview,
    this.onRemove,
    this.width = 224,
  });
  final String name;
  final String? size;
  final BefAttachmentStatus status;

  /// 0 to 100, while uploading.
  final double? progress;
  final ImageProvider? preview;
  final VoidCallback? onRemove;
  final double width;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final err = status == BefAttachmentStatus.error;
    final image = RegExp(r'\.(png|jpe?g|gif|webp|svg)$', caseSensitive: false).hasMatch(name);
    return Container(
      width: width,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: err ? c.destructive.withValues(alpha: 0.05) : c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: err ? c.destructive.withValues(alpha: 0.4) : c.border),
      ),
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(8, 8, 36, 8),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  clipBehavior: Clip.antiAlias,
                  decoration: BoxDecoration(
                    color: err ? c.destructive.withValues(alpha: 0.1) : c.secondary,
                    borderRadius: BorderRadius.circular(BefRadius.lg),
                  ),
                  child: preview != null
                      ? Image(image: preview!, fit: BoxFit.cover)
                      : Center(
                          child: BefIcon(
                            err
                                ? BefIcons.alertCircle
                                : image
                                ? BefIcons.image
                                : BefIcons.fileText,
                            size: 16,
                            color: err ? c.destructive : c.mutedForeground,
                          ),
                        ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: BefText.style(context, size: 13, weight: FontWeight.w500),
                      ),
                      Text(
                        err
                            ? 'Upload failed'
                            : status == BefAttachmentStatus.uploading
                            ? 'Uploading ${(progress ?? 0).round()}%'
                            : (size ?? ''),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: BefText.style(
                          context,
                          size: 12,
                          color: err ? c.destructive : c.mutedForeground,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          if (onRemove != null)
            Positioned(
              right: 6,
              top: 6,
              child: BefPressable(
                semanticLabel: 'Remove $name',
                onPressed: onRemove,
                builder: (context, s) => Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: s.contains(WidgetState.hovered) || s.contains(WidgetState.pressed)
                        ? c.secondary
                        : Colors.transparent,
                  ),
                  child: Center(child: BefIcon(BefIcons.x, size: 14, color: c.mutedForeground)),
                ),
              ),
            ),
          if (status == BefAttachmentStatus.uploading)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                height: 2,
                color: c.secondary,
                alignment: Alignment.centerLeft,
                child: FractionallySizedBox(
                  widthFactor: ((progress ?? 0) / 100).clamp(0.0, 1.0),
                  child: Container(color: c.primary),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
