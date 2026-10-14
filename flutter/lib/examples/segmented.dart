import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/segmented.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BefSegmented<String>(
            value: _range,
            onChanged: (v) => set(() => _range = v),
            segments: const [
              BefSegment(value: '7d', label: '7 days'),
              BefSegment(value: '30d', label: '30 days'),
              BefSegment(value: '90d', label: '90 days'),
            ],
          ),
          const SizedBox(height: 16),
          BefSegmented<String>(
            value: _view,
            onChanged: (v) => set(() => _view = v),
            segments: const [
              BefSegment(
                value: 'list',
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [BefIcon(BefIcons.list), SizedBox(width: 6), Text('List')],
                ),
              ),
              BefSegment(
                value: 'grid',
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [BefIcon(BefIcons.layoutGrid), SizedBox(width: 6), Text('Grid')],
                ),
              ),
            ],
          ),
        ],
      );
    },
  );
}

String _range = '30d', _view = 'list';
