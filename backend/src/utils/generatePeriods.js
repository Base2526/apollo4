export const generatePeriodsFromDates = (startYear, startMonth, endYear, endMonth) => {
    const periods = [];
    let startDate = new Date(startYear, startMonth - 1, 1, 0, 0); // Month is 0-indexed, so subtract 1
    const endDate = new Date(endYear, endMonth, 1, 0, 0); // Period will go until the end of endMonth

    while (startDate <= endDate) {
        const year = startDate.getFullYear();
        const month = startDate.getMonth();

        // First period: 7th 00:00 to 13th 23:59
        periods.push({
            start: new Date(year, month, 7, 0, 0),
            end: new Date(year, month, 13, 23, 59),
        });

        // Second period: 14th 00:00 to 20th 23:59
        periods.push({
            start: new Date(year, month, 14, 0, 0),
            end: new Date(year, month, 20, 23, 59),
        });

        // Third period: 21st 00:00 to 27th 23:59
        periods.push({
            start: new Date(year, month, 21, 0, 0),
            end: new Date(year, month, 27, 23, 59),
        });

        // Fourth period: 28th 00:00 to 6th of the next month 23:59
        const nextMonth = new Date(year, month + 1, 6, 23, 59);
        periods.push({
            start: new Date(year, month, 28, 0, 0),
            end: nextMonth,
        });

        // Move to the next month
        startDate.setMonth(startDate.getMonth() + 1);
    }

    return periods;
};

// Example: Generate periods from January 2023 to December 2025
// const customPeriods = generatePeriodsFromDates(2023, 1, 2025, 12);
// console.log(customPeriods);
