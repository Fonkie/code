/**
 * 本地排序，兼容字段值类型为数字（整型、浮点型）、字符串，或者字段值为空
 * @param list {array} 要排序的列表
 * @param field  {string|function} 要排序的字段或者排序函数
 * @param order  {int} order=1升序，order=0降序
 * @returns {array}  排序后的list
 */
function localSort(list, field, order) {
	var sortFn;
	if (!field) {
		return list;
	} else if (typeof (field) === 'function') {
		sortFn = field;
	} else {
		sortFn = function (a, b) {
			var ret, x, y;

			x = a[field];
			y = b[field];

			if (typeof (x) == "undefined") {
				ret = 1;
			} else if (typeof (y) == "undefined") {
				ret = -1;
			} else {

				if (isNaN(x)) {
					x = x.toLowerCase();
					y = y.toLowerCase();
				} else {
					x = parseFloat(x);
					y = parseFloat(y);
				}

				if (!!order) { // 升序（asc）
					ret = y > x ? -1 : 1;
				} else {// 降序（desc）
					ret = y > x ? 1 : -1;
				}
			}
			return ret;
		};
	}
	return list.sort(sortFn);
}
