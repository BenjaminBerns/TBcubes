export const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 1000);

    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');

    if (hours > 0) {
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        return `${hours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
    } else if (minutes > 0) {
        const formattedSeconds = seconds.toString().padStart(2, '0');
        return `${minutes}:${formattedSeconds}.${formattedMilliseconds}`;
    } else {
        return `${seconds}.${formattedMilliseconds}`;
    }
};
