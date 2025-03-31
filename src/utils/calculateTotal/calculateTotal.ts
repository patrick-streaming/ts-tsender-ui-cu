export function calculateTotal(amounts: string): number {
    // Split by both commas and newlines, then clean up the results
    const amountArray = amounts
        .split(/[\n,]+/)
        .map(amt => amt.trim()) // Remove whitespace around each value
        .filter(amt => amt !== '') // Remove empty strings
        .map(amt => parseFloat(amt)); // Convert to numbers

    // Sum all valid numbers (filter out NaN values)
    return amountArray
        .filter(num => !isNaN(num))
        .reduce((sum, num) => sum + num, 0);
}