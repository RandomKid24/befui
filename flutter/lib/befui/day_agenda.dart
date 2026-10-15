import 'package:flutter/material.dart';

import 'theme.dart';

class BefAgendaEvent {
  const BefAgendaEvent({
    required this.id,
    required this.title,
    required this.start,
    required this.end,
    this.location,
    this.color,
  });
  final String id, title;

  /// 24-hour "HH:MM".
  final String start, end;
  final String? location;
  final Color? color;
}

int _mins(String t) {
  final p = t.split(':').map(int.parse).toList();
  return p[0] * 60 + (p.length > 1 ? p[1] : 0);
}

/// One day as a time grid: events sit at their start time with height for their length, and overlapping events share the width side by side. [now] ("HH:MM") draws a red now-line. [onSelect] makes events tappable. Scrolls inside [height].
class BefDayAgenda extends StatelessWidget {
  const BefDayAgenda({
    super.key,
    required this.events,
    this.startHour = 8,
    this.endHour = 19,
    this.hourHeight = 56,
    this.now,
    this.onSelect,
    this.height,
  });
  final List<BefAgendaEvent> events;
  final int startHour, endHour;
  final double hourHeight;
  final String? now;
  final ValueChanged<BefAgendaEvent>? onSelect;
  final double? height;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final total = (endHour - startHour + 1) * hourHeight;
    double top(int m) => (m - startHour * 60) / 60 * hourHeight;

    // give overlapping events their own column
    final sorted = [...events]
      ..sort(
        (a, b) => _mins(a.start) - _mins(b.start) != 0
            ? _mins(a.start) - _mins(b.start)
            : _mins(b.end) - _mins(a.end),
      );
    final cols = <int>[];
    final colEnds = <int>[];
    for (final e in sorted) {
      var k = colEnds.indexWhere((end) => end <= _mins(e.start));
      if (k < 0) {
        k = colEnds.length;
        colEnds.add(0);
      }
      colEnds[k] = _mins(e.end);
      cols.add(k);
    }
    // width of an event's overlap group
    int groupSize(int i) {
      var n = cols[i] + 1;
      for (var j = 0; j < sorted.length; j++) {
        if (_mins(sorted[j].start) < _mins(sorted[i].end) && _mins(sorted[j].end) > _mins(sorted[i].start)) {
          n = n > cols[j] + 1 ? n : cols[j] + 1;
        }
      }
      return n;
    }

    final body = SizedBox(
      height: total,
      child: LayoutBuilder(
        builder: (context, box) {
          final left = 48.0;
          final w = box.maxWidth - left - 4;
          return Stack(
            children: [
              for (var h = startHour; h <= endHour; h++) ...[
                Positioned(
                  left: 0,
                  top: (h - startHour) * hourHeight - 7,
                  child: SizedBox(
                    width: 40,
                    child: Text(
                      '${h.toString().padLeft(2, '0')}:00',
                      textAlign: TextAlign.right,
                      style: BefText.style(context, size: 11, color: c.mutedForeground),
                    ),
                  ),
                ),
                Positioned(
                  left: left,
                  right: 0,
                  top: (h - startHour) * hourHeight,
                  child: Divider(height: 1, color: c.border),
                ),
              ],
              for (var i = 0; i < sorted.length; i++)
                Builder(
                  builder: (context) {
                    final e = sorted[i];
                    final n = groupSize(i);
                    final color = e.color ?? c.primary;
                    final h = (top(_mins(e.end)) - top(_mins(e.start)) - 2).clamp(20.0, double.infinity);
                    return Positioned(
                      left: left + w / n * cols[i],
                      width: w / n - 2,
                      top: top(_mins(e.start)) + 1,
                      height: h,
                      child: GestureDetector(
                        onTap: onSelect == null ? null : () => onSelect!(e),
                        child: Container(
                          padding: const EdgeInsets.fromLTRB(8, 4, 6, 4),
                          clipBehavior: Clip.antiAlias,
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(BefRadius.md),
                            border: Border(left: BorderSide(color: color, width: 3)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                e.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: BefText.style(
                                  context,
                                  size: 12,
                                  weight: FontWeight.w600,
                                  color: c.foreground,
                                  height: 1.3,
                                ),
                              ),
                              if (h > 36)
                                Text(
                                  '${e.start} – ${e.end}${e.location == null ? '' : ' · ${e.location}'}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: BefText.style(
                                    context,
                                    size: 11,
                                    color: c.mutedForeground,
                                    height: 1.3,
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              if (now != null)
                Positioned(
                  left: left - 4,
                  right: 0,
                  top: top(_mins(now!)),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(color: c.destructive, shape: BoxShape.circle),
                      ),
                      Expanded(child: Container(height: 1.5, color: c.destructive)),
                    ],
                  ),
                ),
            ],
          );
        },
      ),
    );
    return Container(
      height: height,
      clipBehavior: Clip.antiAlias,
      padding: const EdgeInsets.fromLTRB(8, 12, 8, 8),
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
      ),
      child: height == null ? body : SingleChildScrollView(child: body),
    );
  }
}
