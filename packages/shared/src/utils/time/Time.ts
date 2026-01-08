import { DateTime, Interval } from 'luxon';

export enum TimeDuration {
    Hour = 'hour',
}

export enum DateFormat {
    /** 8/ 6/ 2014, 1:07:04 PM */
    DATE_WITH_TIME_SECONDS = 'F',
    /** 2025-09-27 */
    YYYY_MM_DD = 'yyyy-MM-dd',
    /** 27/09/2025 */
    DD_MM_YYYY_SLASH = 'dd/MM/yyyy',
    /** 27.09.2025 */
    DD_MM_YYYY_DOT = 'dd.MM.yyyy',
    /** 27 September 2025 */
    FULL_DATE = 'dd LLLL yyyy',
    /** 17:14 */
    TIME_ONLY = 'HH:mm',
    /** 27 Sep 17:14 */
    SHORT_WITH_TIME = 'dd LLL HH:mm',
}

class Time {
    public static utc(): DateTime<boolean> {
        return DateTime.utc();
    }
    public static getISODateNow(): string {
        return DateTime.now().toISO();
    }

    public static toJSDate(time: string): Date {
        return DateTime.fromISO(time).toJSDate();
    }
    public static fromISO(isoString: string, throwOnInvalid = true): DateTime {
        const dt = DateTime.fromISO(isoString, { zone: 'utc' });

        if (!dt.isValid) {
            if (throwOnInvalid) {
                throw new Error(`Invalid ISO date: ${isoString}`);
            } else {
                return DateTime.invalid('Invalid ISO date');
            }
        }

        return dt;
    }
    public static parseUTC(iso: string): DateTime {
        const dt = DateTime.fromISO(iso, { setZone: true });

        if (!dt.isValid) {
            throw new Error(`Invalid ISO date: ${iso}`);
        }

        if (dt.zoneName !== 'UTC') {
            throw new Error(`Date must be in UTC: ${iso}`);
        }

        return dt;
    }
    public static isValidISODate(date: string): boolean {
        const dt = DateTime.fromISO(date, { zone: 'utc' });
        return dt.isValid && dt.toISODate() === date;
    }
    public static getDiff({ from = new Date(), to, duration }: { from?: Date; to: Date; duration: TimeDuration }): number {
        const startLuxon = DateTime.fromJSDate(from);
        const endLuxon = DateTime.fromJSDate(to);

        const interval = Interval.fromDateTimes(startLuxon, endLuxon);

        return interval.length(duration);
    }
    public static getSeconds(timestamp?: number): number {
        return timestamp ? timestamp : Math.floor(DateTime.now().toSeconds());
    }

    public static getMilliseconds(timestamp?: number): number {
        return timestamp ? timestamp * 1000 : DateTime.now().toMillis();
    }

    public static getISOString(timestamp?: number): string {
        const dt = timestamp ? DateTime.fromSeconds(timestamp) : DateTime.now();
        return dt.toUTC().toISO(); // Формат Z
    }

    public static diffSeconds(from: number, to: number): number {
        return to - from;
    }

    public static diffMilliseconds(from: number, to: number): number {
        return (to - from) * 1000;
    }

    public static diffISO(from: number, to: number): string {
        const dtFrom = DateTime.fromSeconds(from).toUTC();
        const dtTo = DateTime.fromSeconds(to).toUTC();
        const duration = dtTo.diff(dtFrom);
        return duration.toISO();
    }
    public static getSecondsLeft(isoString: string): number {
        const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const target = DateTime.fromISO(isoString, { zone: userZone });
        const now = DateTime.now().setZone(userZone);

        const diff = target.toSeconds() - now.toSeconds();
        return Math.max(0, Math.floor(diff));
    }
    public static secondsToMinutes(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;

        const secStr = sec < 10 ? `0${sec}` : `${sec}`;

        return `${minutes}:${secStr}`;
    }

    public static formatDate(isoString: string, format: DateFormat): string {
        const date = DateTime.fromISO(isoString);
        if (!date.isValid) return '';
        return date.toFormat(format);
    }
    private static parseISO(dateISO: string): DateTime {
        const dt = DateTime.fromISO(dateISO, { zone: 'utc' });
        if (!dt.isValid) {
            throw new Error(`Invalid ISO date: ${dateISO}`);
        }
        return dt;
    }
    /**
     * * >= start of day (inclusive)
     */
    public static toInclusiveFrom(dateISO: string): string | null {
        return Time.parseISO(dateISO).startOf('day').toISO();
    }

    /**
     * < start of next day (exclusive)
     */
    public static toExclusiveTo(dateISO: string): string | null {
        return Time.parseISO(dateISO).plus({ days: 1 }).startOf('day').toISO();
    }

    /**
     * >= start of month (inclusive)
     */
    public static toMonthStart(dateISO: string): string | null {
        return Time.parseISO(dateISO).startOf('month').toISO();
    }

    /**
     * < start of next month (exclusive)
     */
    public static toMonthEndExclusive(dateISO: string): string | null {
        return Time.parseISO(dateISO).startOf('month').plus({ months: 1 }).toISO();
    }
}

export { Time, DateTime };
