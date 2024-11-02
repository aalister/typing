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
