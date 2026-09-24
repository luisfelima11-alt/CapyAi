// Day boundaries follow Brazil time (America/Sao_Paulo, UTC-3, no DST since 2019).

// "YYYY-MM-DD" for today in Brazil.
function todayBRT() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}

// "YYYY-MM-DD" shifted by n days.
function addDays(day, n) {
    const d = new Date(day + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
}

function secondsUntilBrtMidnight() {
    const now = new Date();
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 3, 0, 0)); // 00:00 BRT = 03:00 UTC
    if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
    return Math.ceil((next - now) / 1000);
}

module.exports = { todayBRT, addDays, secondsUntilBrtMidnight };
