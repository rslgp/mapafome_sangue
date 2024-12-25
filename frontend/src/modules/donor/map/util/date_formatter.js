const getDateFormat = (timestamp) => {
    if (timestamp && timestamp.length !== 13) return false;
    const date = new Date(Number(timestamp));  // Convert timestamp to Date object

    // const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDate = `${month}/${year} ${hours}:${minutes}`;

    return formattedDate;
}
export default getDateFormat;