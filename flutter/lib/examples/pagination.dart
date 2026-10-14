import 'package:flutter/material.dart';

import '../befui/pagination.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) =>
        BefPagination(page: _page, pageCount: 12, onPageChanged: (p) => set(() => _page = p)),
  );
}

int _page = 5;
