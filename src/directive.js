'use strict';

angular.module('eonardol.angular-humble-inline-daterangepicker', []).directive('humbleInlineDaterangepicker', [function () {
	var startDayOfWeek = 1; // TODO: options
	var numberOfMonths = 3; // TODO: options
	var stepAmount = 1;			// TODO: options
	var autoFixEnabled = false;
	return {
		restrict: "E",
		templateUrl: "directive.html",
		scope: {
			fromDate: "=",
			toDate: "="
		},
		link: function (scope) {
			// scope.fromDate = _removeTime(scope.fromDate || moment());
			var isFromDate = true;

			scope.weekdays = [];
			var m = moment().day(startDayOfWeek);
			for (var i = 0; i < 7; i++) {
				scope.weekdays.push(_capitalize(m.clone().add(i, 'days').format('dd')));
			}

			scope.months = _buildCalendar((scope.fromDate || moment()).clone().startOf('day'));
			
			scope.select = function (day) {
				if (!scope.fromDate || isFromDate) {
					scope.fromDate = day.date;
				}
				else {
					scope.toDate = day.date;
				}
				isFromDate = !isFromDate;

				// 
				if (autoFixEnabled && scope.fromDate && scope.toDate && scope.toDate.isBefore(scope.fromDate)){
					var temp = scope.fromDate;
					scope.fromDate = scope.toDate;
					scope.toDate = temp;
					isFromDate = true;
				}
			};

			scope.next = function () {
				var next = scope.months[0].clone();
				next.date(1);
				next.add(stepAmount, 'months');
				scope.months = _buildCalendar(next);
			};

			scope.previous = function () {
				var prev = scope.months[0].clone();
				prev.date(1);
				prev.add(stepAmount * -1, 'months');
				scope.months = _buildCalendar(prev);
			};
		}
	};

	function _buildCalendar(reference){
		console.log("______buildCalendar", reference);
		var months = [];
		for (var i = 0; i < numberOfMonths; i++) {
			var month = reference.clone();
			month.date(1);
			month.add(i, 'months').startOf('day');
			_buildMonth(month);
			months.push(month);
			console.log("aggiunto mese", month);
		}
		return months;
	}

	function _buildMonth(month) {
		var weeks = [];
		var done = false, date = month.clone().day(startDayOfWeek), monthIndex = month.month(), count = 0;
		console.log("date", date);
		while (!done) {
			weeks.push({ days: _buildWeek(date.clone(), month) });
			date.add(1, "w");
			done = count++ > 4 && monthIndex !== date.month();
			// monthIndex = date.month();
		}
		month.weeks = weeks;
	}

	function _buildWeek(date, month) {
		var days = [];
		for (var i = 0; i < 7; i++) {
			days.push({
				name: date.format("dd").substring(0, 1),
				number: date.date(),
				isCurrentMonth: date.month() === month.month(),
				isToday: date.isSame(new Date(), "day"),
				date: date
			});
			date = date.clone();
			date.add(1, "d");
		}
		return days;
	}

	function _capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}]);