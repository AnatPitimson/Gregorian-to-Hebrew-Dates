function isValidDate(dateString) {
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.match(regex) !== null;
}

function convertGregorianToHebrew() {
    var gregorianDate = document.getElementById("gregorianDate").value;

    if (!isValidDate(gregorianDate)) {
        alert("Invalid date format. Please use YYYY-MM-DD.");
        return;
    }

    var apiUrl = "https://www.hebcal.com/converter?cfg=json&g2h=1&strict=1&date=" + gregorianDate;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            var hebrewDate = data.hebrew;
            console.log(data + " " + JSON.stringify(data, null, 2));
            document.getElementById("gregorianToHebrewResult").innerText = hebrewDate;
        })
        .catch(error => console.error('Error converting Gregorian to Hebrew:', error));
}

function daysBetweenDates(date1, date2) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay));
}

function convertRangeGregorianToHebrew() {
    var startGregorianDate = document.getElementById("startGregorianDate").value;
    var endGregorianDate = document.getElementById("endGregorianDate").value;

    // Check if the start date is before or equal to the end date
    if (!isValidDate(startGregorianDate) || !isValidDate(endGregorianDate) || startGregorianDate > endGregorianDate) {
        alert("Invalid date range. Please ensure the start date is before or equal to the end date.");
        return;
    }

    // Check if the difference in days is larger than 180
    if (daysBetweenDates(startGregorianDate, endGregorianDate) > 180) {
        alert("The date range exceeds 180 days. Displaying results for the first 180 days.");
        // Adjust the end date to be 180 days from the start date
        var endDate180 = new Date(startGregorianDate);
        endDate180.setDate(endDate180.getDate() + 179); // 179 days to account for the start date
        endGregorianDate = endDate180.toISOString().split('T')[0];
    }

    var apiUrl = "https://www.hebcal.com/converter?cfg=json&start=" + startGregorianDate +
        "&end=" + endGregorianDate + "&g2h=1";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            var hebrewDateRange = Object.keys(data.hdates).map(key => data.hdates[key].hebrew);
            document.getElementById("rangeGregorianToHebrewResult").innerText = hebrewDateRange.join('\n');
        })
        .catch(error => console.error('Error converting range Gregorian to Hebrew:', error));
}