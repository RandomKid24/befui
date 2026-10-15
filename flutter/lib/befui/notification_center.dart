import 'package:flutter/material.dart';

import 'bottom_sheet.dart';
import 'button.dart';
import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefNotice {
  const BefNotice({required this.id, required this.title, required this.time, this.body, this.read = false});
  final String id, title, time;
  final String? body;
  final bool read;
  BefNotice markRead() => BefNotice(id: id, title: title, time: time, body: body, read: true);
}

/// Bell with an unread count. Tapping opens a sheet listing the notices; tapping one marks it read and "Mark all read" clears the count. Controlled: pass [notices] and update them in [onChanged].
class BefNotificationCenter extends StatelessWidget {
  const BefNotificationCenter({super.key, required this.notices, required this.onChanged, this.onOpenNotice});
  final List<BefNotice> notices;
  final ValueChanged<List<BefNotice>> onChanged;
  final ValueChanged<BefNotice>? onOpenNotice;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final unread = notices.where((n) => !n.read).length;
    return Stack(
      clipBehavior: Clip.none,
      children: [
        BefButton(
          variant: BefButtonVariant.ghost,
          size: BefButtonSize.icon,
          semanticLabel: 'Notifications${unread > 0 ? ', $unread unread' : ''}',
          child: BefIcon(BefIcons.bell, size: 18),
          onPressed: () => showBefBottomSheet<void>(
            context: context,
            title: 'Notifications',
            builder: (_) => _Sheet(notices: notices, onChanged: onChanged, onOpen: onOpenNotice),
          ),
        ),
        if (unread > 0)
          Positioned(
            right: 2,
            top: 2,
            child: IgnorePointer(
              child: Container(
                constraints: const BoxConstraints(minWidth: 16),
                height: 16,
                padding: const EdgeInsets.symmetric(horizontal: 4),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: c.destructive,
                  borderRadius: BorderRadius.circular(BefRadius.full),
                ),
                child: Text(
                  unread > 9 ? '9+' : '$unread',
                  style: BefText.style(
                    context,
                    size: 10,
                    weight: FontWeight.w600,
                    color: Colors.white,
                    height: 1,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _Sheet extends StatefulWidget {
  const _Sheet({required this.notices, required this.onChanged, this.onOpen});
  final List<BefNotice> notices;
  final ValueChanged<List<BefNotice>> onChanged;
  final ValueChanged<BefNotice>? onOpen;
  @override
  State<_Sheet> createState() => _SheetState();
}

class _SheetState extends State<_Sheet> {
  late List<BefNotice> _list = widget.notices;

  void _set(List<BefNotice> next) {
    setState(() => _list = next);
    widget.onChanged(next);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final unread = _list.where((n) => !n.read).length;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Align(
          alignment: Alignment.centerRight,
          child: BefButton(
            label: 'Mark all read',
            variant: BefButtonVariant.link,
            size: BefButtonSize.xs,
            leading: BefIcon(BefIcons.check, size: 14),
            onPressed: unread == 0 ? null : () => _set([for (final n in _list) n.markRead()]),
          ),
        ),
        for (final n in _list)
          BefPressable(
            pressScale: 1,
            onPressed: () {
              _set([for (final x in _list) x.id == n.id ? x.markRead() : x]);
              widget.onOpen?.call(n);
            },
            builder: (context, s) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 10),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: c.border)),
                color: s.contains(WidgetState.pressed) ? c.secondary : Colors.transparent,
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    margin: const EdgeInsets.only(top: 6, right: 10),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: n.read ? Colors.transparent : c.primary,
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          n.title,
                          style: BefText.style(context, weight: n.read ? FontWeight.w400 : FontWeight.w500),
                        ),
                        if (n.body != null)
                          Text(n.body!, style: BefText.style(context, size: 13, color: c.mutedForeground)),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(n.time, style: BefText.style(context, size: 12, color: c.mutedForeground)),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
