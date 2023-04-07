// dateUtils.js
export function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}`;
}

export const isValidDates = (start, end, category) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
        alert('End date must be greater than start date');
        return false;
    }

    const maxEndDate = new Date(startDate);
    if (category === 'Festival' || category === 'Workshop') {
        maxEndDate.setDate(maxEndDate.getDate() + 1);
        maxEndDate.setHours(3);
        maxEndDate.setMinutes(0);
    } else {
        maxEndDate.setHours(maxEndDate.getHours() + 27);
        maxEndDate.setMinutes(0);
    }

    if (endDate > maxEndDate) {
        alert('End date cannot be beyond 3 AM the next day, unless it is a Festival or Workshop');
        return false;
    }

    return true;
};
