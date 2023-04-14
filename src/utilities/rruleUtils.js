// rruleUtils.js
const buildRRuleString = (recurrenceType, recurrenceWeekOfMonth, exclusionDates) => {
    let rrule = 'RRULE:FREQ=';

    switch (recurrenceType) {
        case 'None':
            return null;
        case 'Weekly':
            rrule += 'WEEKLY';
            break;
        case 'Monthly':
            rrule += 'MONTHLY';
            break;
        default:
            return null;
    }

    if (recurrenceWeekOfMonth && recurrenceType === 'Monthly') {
        rrule += `;BYSETPOS=${recurrenceWeekOfMonth}`;
    }

    if (exclusionDates) {
        const exclusionDatesArray = exclusionDates
            .split(',')
            .map((date) => date.trim())
            .filter((date) => date.length > 0);
        rrule += ';EXDATE=' + exclusionDatesArray.join(',');
    }

    return rrule;
};

export { buildRRuleString };
