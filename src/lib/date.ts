const MILLISECONDS_PER_DAY = 86400000;

/**
Returns the current day in local time as UTC.
*/
export function today() {
    const date = new Date();

    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    ));
}

/**
Returns the date that is n days after the original date.
*/
export function shiftDate(date: Date, n: number) {
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + n,
    ));
}

/**
Returns the day of the week of the date where Monday is 0.
*/
export function getDay(date: Date) {
    return [6, 0, 1, 2, 3, 4, 5][date.getUTCDay()];
}

/**
Returns the number of days between the start and end dates.
*/
export function daysBetween(startDate: Date, endDate: Date) {
    return Math.round((endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY);
}
