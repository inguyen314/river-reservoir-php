document.addEventListener('DOMContentLoaded', () => {
    // Show the loading indicator
    const loadingIndicator = document.getElementById('loading_river_reservoir');
    loadingIndicator.style.display = 'block';

    // Gage control json file
    const jsonFileURL = '../../../php_data_api/public/json/gage_control.json';
    console.log('jsonFileURL: ', jsonFileURL);
    
    // Fetch the initial gage control data
    fetch(jsonFileURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async gageControlJsonData => {
            console.log('gageControlJsonData: ', gageControlJsonData);

            // Create an array of promises for the second fetch based on basin data
            const fetchPromises = gageControlJsonData.map(item => {
                const basin = item.basin;
                const fetchGageControlMetaDataUrl = `https://wm.mvs.ds.usace.army.mil/php_data_api/public/get_gage_control_by_basin.php?basin=${basin}`;
                console.log('fetchGageControlMetaDataUrl: ', fetchGageControlMetaDataUrl);

                // Return the fetch promise for each basin
                return fetch(fetchGageControlMetaDataUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    });
            });

            // Wait for all fetch operations to complete
            return Promise.all(fetchPromises)
                .then(gageControlMetaData => {
                    console.log('gageControlMetaData: ', gageControlMetaData);

                    // Merge the initial gage control data with the second fetch data
                    const mergedData = mergeData(gageControlJsonData, gageControlMetaData);
                    console.log('mergedData: ', mergedData);

                    // Remove basins that you dont need
                    const basinsToRemove = ["Castor"]; 
                    //const basinsToRemove = ["Castor", "Salt", "St Francis"];
                    const filteredBasins = mergedData.filter(basin => !basinsToRemove.includes(basin.basin));
                    console.log("filteredBasins: ", filteredBasins);

                    // Define a custom order array
                    const customOrder = ["Salt", "Mississippi", "Illinois", "Cuivre", "Missouri", "Meramec", "Ohio", "Kaskaskia", "Big Muddy", "St Francis"];

                    // Sort the array by the custom order
                    filteredBasins.sort((a, b) => customOrder.indexOf(a.basin) - customOrder.indexOf(b.basin));
                    console.log('filteredBasins: ', filteredBasins);

                    // =================================================================== // 
                    // ========================== GET DATE TIME ========================== // 
                    // =================================================================== //  
                    // Get the current time in JavaScript (equivalent to PHP's strtotime('now'))
                    const now = new Date();
                    const timestamp = now.getTime(); // Get the current timestamp in milliseconds
                    console.log('timestamp: ', timestamp);
                    
                    // Create a new JavaScript Date object
                    const date = new Date(timestamp);
                    console.log('date: ', date);

                    // =================================================================== // 
                    // ========================== GET NWS DATE =========================== // 
                    // =================================================================== //
                    // Day 1
                    var day1 = new Date(timestamp);
                    day1.setDate(date.getDate() + 1);
                    var nws_day1_date = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2) + '-' + day1.getFullYear();
                    var nws_day1_date_title = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2);
                    console.log('nws_day1_date: ', nws_day1_date);
                    console.log('nws_day1_date_title: ', nws_day1_date_title);

                    // Day 2
                    var day2 = new Date(date);
                    day2.setDate(date.getDate() + 2);
                    var nws_day2_date = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2) + '-' + day2.getFullYear();
                    var nws_day2_date_title = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2);
                    console.log('nws_day2_date: ', nws_day2_date);
                    console.log('nws_day2_date_title: ', nws_day2_date_title);

                    // Day 3
                    var day3 = new Date(date);
                    day3.setDate(date.getDate() + 3);
                    var nws_day3_date = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2) + '-' + day3.getFullYear();
                    var nws_day3_date_title = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2);
                    console.log('nws_day3_date: ', nws_day3_date);
                    console.log('nws_day3_date_title: ', nws_day3_date_title);

                    // ================================================================================== // 
                    // ========================== CREATE RIVER TABLE HEADER ============================= // 
                    // ================================================================================== //
                    // Call the function to create and populate the river table header
                    console.log('Calling createRiverTableHeader');
                    createRiverTableHeader(nws_day1_date_title, nws_day2_date_title, nws_day3_date_title);


                    // ================================================================================ // 
                    // ========================== CREATE RIVER TABLE BODY ============================= // 
                    // ================================================================================ //
                    // Call the function to create and populate the river table body
                    console.log('Calling createRiverTableBody');
                    createRiverTableBody(filteredBasins, nws_day1_date, nws_day2_date, nws_day3_date);


                    // ====================================================================================== // 
                    // ========================== CREATE RESERVOIR TABLE HEADER ============================= // 
                    // ====================================================================================== //
                    // Call the function to create and populate the reservoir table header
                    console.log('Calling createReservoirTableHeader');
                    createReservoirTableHeader();


                    // ==================================================================================== // 
                    // ========================== CREATE RESERVOIR TABLE BODY ============================= // 
                    // ==================================================================================== //
                    // Call the function to create and populate the reservoir table body
                    console.log('Calling createReservoirTableBody');
                    createReservoirTableBody(mergedData);

                    // Hide the loading indicator after data processing
                    loadingIndicator.style.display = 'none';
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);

            // Hide the loading indicator in case of an error
            loadingIndicator.style.display = 'none';
        });
});



// ======================================================================= // 
// ========================== JSON FUNCTIONS ============================= // 
// ======================================================================= //
// Function to merge two jsons based on basin and location
function mergeData(data, gageControlMetaData) {
    if (Array.isArray(data) && data.length > 0) {
        // Iterate through each basin in data
        data.forEach(basin => {
            console.log('Processing basin:', basin);

            // Check if basin has gages and gages is an array
            if (Array.isArray(basin.gages) && basin.gages.length > 0) {
                // Iterate through each gage in the current basin's gages
                basin.gages.forEach(gage => {
                    // Find the matching data in gageControlMetaData based on location_id
                    gageControlMetaData.forEach(dataArr => {
                        const matchedObj = dataArr.find(obj => obj.location_id === gage.location_id);
                        if (matchedObj) {
                            // Merge the matched data into the corresponding location object
                            Object.assign(gage, matchedObj);
                        }
                    });
                })
            }
        })
    }
    return data;
}


// ================================================================================== // 
// ========================== RESERVOIR RIVER FUNCTIONS ============================= // 
// ================================================================================== //
// Function to create and populate the river table header
function createRiverTableHeader(nws_day1_date_title, nws_day2_date_title, nws_day3_date_title) {
    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('id', 'webrep');

    // TITLE ROW 1
    // Create a table header row
    const headerRow = table.insertRow(0);

    // Create table headers for the desired columns
    const columns  = ["River Mile", "Gage Station", "Current Level", "24hr Delta", "National Weather Service River Forecast", "Flood Level", "Gage Zero", "Record Stage", "Record Date"];

    columns.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        if (columnName === "River Mile") {
            th.rowSpan = 3;
        }
        if (columnName === "Gage Station") {
            th.rowSpan = 3;
        }
        if (columnName === "Current Level") {
            th.rowSpan = 3;
        }
        if (columnName === "24hr Delta") {
            th.rowSpan = 3;
        }
        if (columnName === "National Weather Service River Forecast") {
            th.colSpan = 3;
        }
        if (columnName === "Flood Level") {
            th.rowSpan = 3;
        }
        if (columnName === "Gage Zero") {
            th.rowSpan = 3;
        }
        if (columnName === "Record Stage") {
            th.rowSpan = 3;
        }
        if (columnName === "Record Date") {
            th.rowSpan = 3;
        }
        headerRow.appendChild(th);
    });

    // TITLE ROW 2
    // Create a table header row
    const headerRow2 = table.insertRow(1);

    // Create table headers for the desired columns
    const columns2  = ["National Weather Service River Forecast"];

    columns2.forEach((columnName) => {
        if (columnName === "National Weather Service River Forecast") {
            const thNext3Days = document.createElement('th');
            thNext3Days.textContent = "Next 3 days";
            headerRow2.appendChild(thNext3Days);

            const thForecastTime = document.createElement('th');
            thForecastTime.textContent = "Forecast Time";
            thForecastTime.rowSpan = 2;
            headerRow2.appendChild(thForecastTime);

            const thCrest = document.createElement('th');
            thCrest.textContent = "Crest & Date";
            thCrest.rowSpan = 2;
            headerRow2.appendChild(thCrest);
        }
    });


    // TITLE ROW 3
    // Create a table header row
    const headerRow3 = table.insertRow(2);

    // Create table headers for the desired columns
    const columns3  = ["National Weather Service River Forecast"];

    columns3.forEach((columnName) => {
        if (columnName === "National Weather Service River Forecast") {
            const thNext3DaysDate = document.createElement('th');
            thNext3DaysDate.innerHTML = "<span style='margin-right: 7px;margin-left: 7px;'>" + nws_day1_date_title + "</span>" + "|";
            thNext3DaysDate.innerHTML += "<span style='margin-right: 7px;margin-left: 7px;'>" + nws_day2_date_title + "</span>" + "|";
            thNext3DaysDate.innerHTML += "<span style='margin-right: 7px;margin-left: 7px;'>" + nws_day3_date_title + "</span>";
            headerRow3.appendChild(thNext3DaysDate);
        }
    });
    // Append the table to the document or a specific container
    const tableContainerWebrep = document.getElementById('table_container_river_reservoir');
    if (tableContainerWebrep) {
        tableContainerWebrep.appendChild(table);
    }
}

// Function to create and populate the river table body
function createRiverTableBody(mergedData, nws_day1_date, nws_day2_date, nws_day3_date) {
    const tableBody = document.querySelector('#webrep tbody');

    mergedData.forEach(basinData => {
        // Create a row for the basin with colspan=11
        const basinRow = document.createElement('tr');
        const basinCell = document.createElement('td');
        basinCell.colSpan = 11;
        basinCell.innerHTML = basinData.basin;
        basinCell.style.textAlign = 'left';
        basinCell.style.fontWeight = 'bold';
        basinRow.appendChild(basinCell);
        tableBody.appendChild(basinRow);

        // Get current date and time
        const currentDateTime = new Date();
        console.log('currentDateTime:', currentDateTime);

        // Subtract two hours from current date and time
        const currentDateTimeMinus2Hours = subtractHoursFromDate(currentDateTime, 2);
        console.log('currentDateTimeMinus2Hours :', currentDateTimeMinus2Hours);

        // Subtract thirty hours from current date and time
        const currentDateTimeMinus30Hours = subtractHoursFromDate(currentDateTime, 64);
        console.log('currentDateTimeMinus30Hours :', currentDateTimeMinus30Hours);

        // Add thirty hours to current date and time
        const currentDateTimePlus30Hours = plusHoursFromDate(currentDateTime, 30);
        console.log('currentDateTimePlus30Hours :', currentDateTimePlus30Hours);

        // Add four days to current date and time
        const currentDateTimePlus4Days = addDaysToDate(currentDateTime, 4);
        console.log('currentDateTimePlus4Days :', currentDateTimePlus4Days);


        // Subtract thirty hours from current date and time
        const currentDateTimeMinus48Hours = subtractHoursFromDate(currentDateTime, 48);
        console.log('currentDateTimeMinus48Hours :', currentDateTimeMinus48Hours);

        
        // Check if basin has gages and gages is an array
        if (Array.isArray(basinData.gages) && basinData.gages.length > 0) {
            // Iterate through each gage in the current basin's gages
            basinData.gages.forEach(locData => {
                if (locData.river_reservoir === true) { // Check if river_reservoir is true
                    const locationRow = document.createElement('tr');

                        // SETTING UP VARIABLES
                        // Prepare c_count to get 24 hour values to calculate delta 
                        let c_count = null;
                        c_count = locData.c_count;
                        console.log("c_count hardcoded:", c_count);

                        let flood_level = null;
                        // Check if locData has the 'flood' property and if its 'constant-value' is not null
                        if (locData.flood_level !== null) {
                            // Check conditions for flood level value and format it to two decimal places if it falls within range
                            if (
                                locData.flood_level === null ||
                                parseFloat(locData.flood_level).toFixed(2) == 0.00 ||
                                parseFloat(locData.flood_level).toFixed(2) > 900
                            ) {
                                flood_level = null; // If flood level is null or outside range, set flood_level to an empty string
                            } else {
                                flood_level = parseFloat(locData.flood_level).toFixed(2); // Otherwise, format flood level to two decimal places
                            }
                        } else {
                            flood_level = null;
                        }

                        if (locData.visible === true && locData.river_reservoir === true) {
                            console.log("visible and river_reservoir are true");

                            // RIVER MILE
                            const rivermileCell = document.createElement('td');
                            if (Number(locData.station) > 900) {
                                rivermileCell.textContent = "";
                            } else if (Number(locData.station) < 9 || (Number.isInteger((Number(locData.station))))) {
                                rivermileCell.textContent = (Number(locData.station)).toFixed(1).padStart(4, '0');
                            } else {
                                rivermileCell.textContent = (Number(locData.station)).toFixed(1);
                            }
                            locationRow.appendChild(rivermileCell);
                            
                            // LOCATION
                            const locationCell = document.createElement('td');
                            locationCell.innerHTML = "<span title='" + locData.location_id + "'>" + locData.public_name + "<span>";
                            locationRow.appendChild(locationCell);

                            // STAGE
                            const stageCell = document.createElement('td');
                            stageCell.textContent = "";
                            
                            // DELTA
                            const deltaCell = document.createElement('td');
                            deltaCell.textContent = "";

                            fetchAndUpdateStage(stageCell, deltaCell, locData.tsid_stage_rev, locData.tsid_stage_29, locData.display_stage_29, flood_level, currentDateTimeMinus2Hours);
                            locationRow.appendChild(stageCell);
                            locationRow.appendChild(deltaCell);
                            

                            // NWS DAY1-DAY3
                            const nwsCell = document.createElement('td');
                            nwsCell.textContent = "";
                            
                            // FORECAST TIME
                            const forecastTimeCell = document.createElement('td');
                            forecastTimeCell.textContent = "";
                            
                            fetchAndUpdateNws(nwsCell, forecastTimeCell, locData.tsid_stage_nws_3_day_forecast, flood_level, nws_day1_date, nws_day2_date, nws_day3_date, currentDateTimeMinus48Hours);
                            locationRow.appendChild(nwsCell);
                            locationRow.appendChild(forecastTimeCell);


                            // CREST AND DATE
                            const crestCell = document.createElement('td');
                            crestCell.textContent = "";
                            fetchAndUpdateCrest(crestCell, locData.tsid_crest, flood_level);
                            locationRow.appendChild(crestCell);

                            // FLOOD LEVEL
                            const floodCell = document.createElement('td');
                            floodCell.innerHTML = "<span title='" + locData.level_id + "'>" + (flood_level === null ? "" : flood_level)  + "<span>";
                            locationRow.appendChild(floodCell);

                            // GAGE ZERO
                            const elevationCell = document.createElement('td');
                            elevationCell.innerHTML = "<span class='" + (locData.vertical_datum === "NGVD29" ? "ngvd29" : "--") + "' title='" + "Vertical Datum: " + locData.vertical_datum + "'>" + (parseFloat(locData.elevation)).toFixed(2)   + "<span>";
                            locationRow.appendChild(elevationCell);

                            // RECORD STAGE
                            const recordStageCell = document.createElement('td');
                            recordStageCell.textContent = "";
                            
                            // RECORD DATE
                            const recordStageDateCell = document.createElement('td');
                            recordStageDateCell.textContent = "";

                            fetchAndUpdateRecordStage(recordStageCell, recordStageDateCell, locData.tsid_stage_rev);
                            locationRow.appendChild(recordStageCell);
                            locationRow.appendChild(recordStageDateCell);
                        }

                    // Append locationRow to tableBody
                    tableBody.appendChild(locationRow);
                }
            })
        }
    });

}


// ================================================================================= // 
// ========================== RESERVOIR LAKE FUNCTIONS ============================= // 
// ================================================================================= //
// Function to create and populate the table header for Reservoirs
function createReservoirTableHeader() {
    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('id', 'webreplake');

    // TITLE ROW 1
    // Create a table header row
    const headerRow = table.insertRow(0);

    // Create table headers for the desired columns
    const columns = ["Lake", "Current Level", "24hr Delta", "Storage Utilized", "Precip (in)", "Yesterdays Inflow (dsf)", "Controlled Outflow", "Seasonal Rule Curve", "Pool Forecast", "Record Stage", "Record Date"];

    columns.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        if (["Lake", "Current Level", "24hr Delta", "Precip (in)", "Yesterdays Inflow (dsf)", "Seasonal Rule Curve", "Record Stage", "Record Date"].includes(columnName)) {
            th.rowSpan = 2;
        }
        if (["Storage Utilized", "Controlled Outflow", "Pool Forecast"].includes(columnName)) {
            th.colSpan = 2;
        }
        headerRow.appendChild(th);
    });

    // TITLE ROW 2
    // Create a table header row
    const headerRowLake2 = table.insertRow(1);

    // Create table headers for the desired columns
    const columns2 = ["Storage Utilized", "Controlled Outflow", "Pool Forecast"];

    columns2.forEach((columnName) => {
        if (columnName === "Storage Utilized") {
            const thStorageConsr = document.createElement('th');
            thStorageConsr.textContent = "Consr";
            headerRowLake2.appendChild(thStorageConsr);

            const thStorageFlood = document.createElement('th');
            thStorageFlood.textContent = "Flood";
            headerRowLake2.appendChild(thStorageFlood);
        }
        if (columnName === "Controlled Outflow") {
            const thMidnightOutflow = document.createElement('th');
            thMidnightOutflow.textContent = "Midnight";
            headerRowLake2.appendChild(thMidnightOutflow);

            const thEveningOutflow = document.createElement('th');
            thEveningOutflow.textContent = "Evening";
            headerRowLake2.appendChild(thEveningOutflow);
        }
        if (columnName === "Pool Forecast") {
            const thForecastCrest = document.createElement('th');
            thForecastCrest.textContent = "Crest";
            headerRowLake2.appendChild(thForecastCrest);

            const thForecastDate = document.createElement('th');
            thForecastDate.textContent = "Date";
            headerRowLake2.appendChild(thForecastDate);
        }
    });

    // Create and append tbody to the table
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    // Append the table to the document or a specific container
    const tableContainerWebrep = document.getElementById('table_container_river_reservoir_lake');
    if (tableContainerWebrep) {
        tableContainerWebrep.appendChild(table);
    }
}

// Function to create and populate the table body for Reservoirs
function createReservoirTableBody(mergedData) {
    const tableBodyLake = document.querySelector('#webreplake tbody');

    mergedData.forEach(basinLakeData => {
        // Create a row for the basin with colspan=14
        // const basinLakeRow = document.createElement('tr');
        // const basinLakeCell = document.createElement('td');
        // basinLakeCell.colSpan = 14;
        // basinLakeCell.innerHTML = basinLakeData.basin;
        // basinLakeCell.style.textAlign = 'left';
        // basinLakeCell.style.fontWeight = 'bold';
        // basinLakeRow.appendChild(basinLakeCell);
        // tableBodyLake.appendChild(basinLakeRow);

        // Get current date and time
        const currentDateTime = new Date();
        console.log('currentDateTime:', currentDateTime);

        // Subtract two hours from current date and time
        const currentDateTimeMinus2Hours = subtractHoursFromDate(currentDateTime, 2);
        console.log('currentDateTimeMinus2Hours :', currentDateTimeMinus2Hours);

        // Subtract thirty hours from current date and time
        const currentDateTimeMinus30Hours = subtractHoursFromDate(currentDateTime, 64);
        console.log('currentDateTimeMinus30Hours :', currentDateTimeMinus30Hours);

        // Add thirty hours to current date and time
        const currentDateTimePlus30Hours = plusHoursFromDate(currentDateTime, 30);
        console.log('currentDateTimePlus30Hours :', currentDateTimePlus30Hours);

        // Add four days to current date and time
        const currentDateTimePlus4Days = addDaysToDate(currentDateTime, 4);
        console.log('currentDateTimePlus4Days :', currentDateTimePlus4Days);

        // Loop through each location in the basin and create rows for them
        if (Array.isArray(basinLakeData.gages) && basinLakeData.gages.length > 0) {
            // Iterate through each gage in the current basin's gages
            basinLakeData.gages.forEach(locData => {
                if (locData.river_reservoir_lake === true) { // Check if river_reservoir_lake is true
                    const locationLakeRow = document.createElement('tr');

                    // SETTING UP VARIABLES
                    // Prepare c_count to get 24 hour values to calculate delta 
                    let c_count = null;
                    c_count = locData.c_count;
                    console.log("c_count hardcoded:", c_count);

                    let flood_level = null;
                    // Check if locData has the 'flood' property and if its 'constant-value' is not null
                    if (locData.flood_level !== null) {
                        // Check conditions for flood level value and format it to two decimal places if it falls within range
                        if (
                            locData.flood_level === null ||
                            parseFloat(locData.flood_level).toFixed(2) == 0.00 ||
                            parseFloat(locData.flood_level).toFixed(2) > 900
                        ) {
                            flood_level = null; // If flood level is null or outside range, set flood_level to an empty string
                        } else {
                            flood_level = parseFloat(locData.flood_level).toFixed(2); // Otherwise, format flood level to two decimal places
                        }
                    } else {
                        flood_level = null;
                    }

                    // LAKE
                    const locationLakeCell = document.createElement('td');
                    locationLakeCell.innerHTML = "<span title='" + locData.location_id + "'>" + locData.public_name + "<span>";
                    locationLakeRow.appendChild(locationLakeCell);

                    // CURRENT LEVEL
                    const levelCell = document.createElement('td');
                    levelCell.textContent = "--";
                    

                    // DELTA
                    const deltaCell = document.createElement('td');
                    deltaCell.textContent = "--";

                    fetchAndUpdateLevel(levelCell, deltaCell, locData.tsid_stage_29, flood_level, currentDateTimeMinus2Hours);
                    locationLakeRow.appendChild(levelCell);
                    locationLakeRow.appendChild(deltaCell);
                    

                    // CONSERVATION
                    const consrCell = document.createElement('td');
                    consrCell.textContent = "--";
                    

                    // FLOOD
                    const floodCell = document.createElement('td');
                    floodCell.textContent = "--";
                    
                    fetchAndUpdateStorage(consrCell, floodCell, locData.location_id);
                    locationLakeRow.appendChild(consrCell);
                    locationLakeRow.appendChild(floodCell);

                    // PRECIP
                    const precipCell = document.createElement('td');
                    precipCell.textContent = "--";
                    fetchAndUpdatePrecip(precipCell, locData.location_id);
                    locationLakeRow.appendChild(precipCell);

                    // YESTERDAY INFLOW
                    const yesterdayInflowCell = document.createElement('td');
                    yesterdayInflowCell.textContent = "--";
                    fetchAndUpdateInflow(yesterdayInflowCell, locData.location_id);
                    locationLakeRow.appendChild(yesterdayInflowCell);

                    // MIDNIGHT
                    const midnightCell = document.createElement('td');
                    midnightCell.textContent = "--";
                    

                    // EVENING
                    const eveningCell = document.createElement('td');
                    eveningCell.textContent = "--";

                    fetchAndUpdateOutflow(midnightCell, eveningCell, locData.location_id);
                    locationLakeRow.appendChild(midnightCell);
                    locationLakeRow.appendChild(eveningCell);

                    // SEASONAL RULE CURVE
                    const seasonalRuleCurveCell = document.createElement('td');
                    seasonalRuleCurveCell.textContent = "--";
                    fetchAndUpdateSeasonalRuleCurve(seasonalRuleCurveCell, locData.location_id);
                    locationLakeRow.appendChild(seasonalRuleCurveCell);

                    // CREST
                    const crestCell = document.createElement('td');
                    crestCell.textContent = "";
                    
                    // CREST DATE
                    const crestDateCell = document.createElement('td');
                    crestDateCell.textContent = "";

                    fetchAndUpdateCrestForecast(crestCell, crestDateCell, locData.location_id);
                    locationLakeRow.appendChild(crestCell);
                    locationLakeRow.appendChild(crestDateCell);

                    // RECORD STAGE
                    const recordStageCell = document.createElement('td');
                    recordStageCell.textContent = "--";

                    // RECORD STAGE DATE
                    const recordStageDateCell = document.createElement('td');
                    recordStageDateCell.textContent = "--";
                    
                    fetchAndUpdateRecordStage(recordStageCell, recordStageDateCell, locData.tsid_stage_rev);
                    locationLakeRow.appendChild(recordStageCell);
                    locationLakeRow.appendChild(recordStageDateCell);

                    tableBodyLake.appendChild(locationLakeRow);
                }
            })
        }
    });
}


// ============================================================================== // 
// ========================== RIVER FETCH FUNCTIONS ============================= // 
// ============================================================================== //
// Function to get stage data
function fetchAndUpdateStage(stageCell, deltaCell, tsid_stage_rev, tsid_stage_29, display_stage_29, flood_value, currentDateTimeMinusHours) {
    // Create an object to hold all the properties you want to pass
    let stageToSend = null;
    if (display_stage_29 === true) {
        stageToSend = {
            cwms_ts_id: encodeURIComponent(tsid_stage_29),
        };
        console.log("stageToSend: " + stageToSend);
    } else {
        stageToSend = {
            cwms_ts_id: encodeURIComponent(tsid_stage_rev),
        };
        console.log("stageToSend: " + stageToSend);
    }
    
    // Convert the object into a query string
    const stageQueryString = Object.keys(stageToSend).map(key => key + '=' + stageToSend[key]).join('&');
    console.log("stageQueryString: " + stageQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    const urlStage = `https://wm.mvs.ds.usace.army.mil/php_data_api/public/get_level.php?${stageQueryString}`;

    // Perform two fetch requests
    fetch(urlStage)
    .then(response => response.json())
    .then(data => {
        // Process the data as needed
        console.log('data:', data);

        if (data !== null) {
            const stage_cwms_ts_id = data.cwms_ts_id;
            console.log("stage_cwms_ts_id = ", stage_cwms_ts_id);

            // Format returned data time string to date time object
            const stage_date_time_cst =data.date_time_cst;
            const formattedDateTimeCST = formatStageDateTimeCST(stage_date_time_cst);

            const stage_value = (parseFloat(data.value)).toFixed(2);
            console.log("stage_value = ", stage_value);

            const stage_delta_24 = (parseFloat(data.delta_24)).toFixed(2);
            console.log("stage_delta_24 = ", stage_delta_24);

            // FLOOD CLASS
            const floodClass = determineStageClass(stage_value, flood_value);
            console.log("floodClass:", floodClass);

            // DATATIME CLASS
            const dateTimeClass = determineStageDateTimeClass(formattedDateTimeCST, currentDateTimeMinusHours);
            console.log("dateTimeClass:", dateTimeClass);

            const stageCellInnerHTML = 	"<span class='" + floodClass + "' title='" + stage_cwms_ts_id + ", Value = " + stage_value + ", DateTime = " + stage_date_time_cst + ", Flood = " + parseFloat(flood_value).toFixed(2) + "'>"
                                    // + "<a href='../../../web_apps/plot_macro/public/plot_macro.php?cwms_ts_id=" + stage_cwms_ts_id + "&start_day=4&end_day=0' target='_blank'>"
                                    + stage_value
                                    // + "</a>"
                                    +"</span>";
                        
            const deltaCellInnerHTML =  "<span title='" + stage_cwms_ts_id + ", Delta = " + stage_delta_24 + " = (" + stage_value + " - " + (parseFloat(data.value_24)).toFixed(2) +"), Value24 = " + (parseFloat(data.value_24)).toFixed(2) + ", DateTime = " + data.date_time_24_cst + ", Flood = " + parseFloat(flood_value).toFixed(2) + "'>" + stage_delta_24 + "</span>";

            // Set the combined value to the cell, preserving HTML
            console.log("stageCellInnerHTML = ", stageCellInnerHTML);

            // Set the HTML inside the cell once the fetch is complete
            stageCell.innerHTML = stageCellInnerHTML;
            deltaCell.innerHTML = deltaCellInnerHTML;
        }
    })
    .catch(error => {
        // Handle errors
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error for the caller to handle
    });
}

// Function to get nws data
function fetchAndUpdateNws(nwsCell, forecastTimeCell, tsid_stage_nws_3_day_forecast, flood_value, nws_day1_date, nws_day2_date, nws_day3_date, currentDateTimeMinus48Hours) {
    // Create an object to hold all the properties you want to pass
    const dataToSendNWSDay1 = {
        cwms_ts_id: encodeURIComponent(tsid_stage_nws_3_day_forecast),
        nws_day1_date: encodeURIComponent(nws_day1_date),
        nws_day2_date: encodeURIComponent(nws_day2_date),
        nws_day3_date: encodeURIComponent(nws_day3_date),
    };
    console.log("dataToSendNWSDay1: " + dataToSendNWSDay1);

    // Convert the object into a query string
    const queryStringNWS = Object.keys(dataToSendNWSDay1).map(key => key + '=' + dataToSendNWSDay1[key]).join('&');
    console.log("queryStringNWS: " + queryStringNWS);

    const urlNWS = `https://wm.mvs.ds.usace.army.mil/php_data_api/public/get_nws_forecast2.php?${queryStringNWS}`;
    console.log("urlNWS: " + urlNWS);

    fetch(urlNWS)
    .then(response => response.json())
    .then(nws => {
        console.log('nws:', nws);

        if (nws !== null && nws.data_entry_date_org_day1 !== null) {
            const day_data_entry_date = nws.data_entry_date_org_day1;
            console.log("day_data_entry_date = ", day_data_entry_date);
            var dateParts = day_data_entry_date.split(" ");
            var date = dateParts[0];
            var time = dateParts[1];
            var [month, day, year] = date.split("-");
            var [hours, minutes] = time.split(":");
            var day_data_entry_date_formatted = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
            console.log("day_data_entry_date_formatted: ", day_data_entry_date_formatted);
        }
        

        // Check if nws is not null and for late forecast entry date
        if (nws !== null && (day_data_entry_date_formatted > currentDateTimeMinus48Hours)) {
            console.log("day_data_entry_date_formatted > currentDateTimeMinus48Hours");

            // Get nws values from nwsData
            const nws1_value = formatNumberWithLeadingZero(parseFloat(nws.value_day1));
            console.log("nws1_value = ", nws1_value);

            const nws2_value = formatNumberWithLeadingZero(parseFloat(nws.value_day2));
            console.log("nws2_value = ", nws2_value);

            const nws3_value = formatNumberWithLeadingZero(parseFloat(nws.value_day3));
            console.log("nws3_value = ", nws3_value);


            // FLOOD CLASS
            const floodClassDay1 = determineStageClass(nws1_value, flood_value);
            console.log("floodClassDay1:", floodClassDay1);

            const floodClassDay2 = determineStageClass(nws2_value, flood_value);
            console.log("floodClassDay2:", floodClassDay2);

            const floodClassDay3 = determineStageClass(nws3_value, flood_value);
            console.log("floodClassDay3:", floodClassDay3);

            // Next 3 days
            const nwsCellInnerHTML  = "<span class='" + floodClassDay1 + "' title='" + tsid_stage_nws_3_day_forecast + " " + nws.date_time_day1 + "' style='margin-right: 7px;margin-left: 7px;'>" 
                                    // + "<a href='../../../web_apps/plot_macro/public/plot_macro.php?cwms_ts_id=" + tsid_stage_nws_3_day_forecast + "&start_day=0&end_day=4' title='" + tsid_stage_nws_3_day_forecast + " " + nws.date_time_day1 + "' target='_blank'>"
                                    + nws1_value
                                    // + "</a>"
                                    + "</span>"
                                    + " | "
                                    + "<span class='" + floodClassDay2 + "' title='" + tsid_stage_nws_3_day_forecast + " " + nws.date_time_day2 + "' style='margin-right: 7px;margin-left: 7px;'>" 
                                    // + "<a href='../../../web_apps/plot_macro/public/plot_macro.php?cwms_ts_id=" + tsid_stage_nws_3_day_forecast + "&start_day=0&end_day=4' title='" + tsid_stage_nws_3_day_forecast + " " + nws.date_time_day2 + "' target='_blank'>"
                                    + nws2_value
                                    // + "</a>"
                                    + "</span>"
                                    + " | "
                                    + "<span class='" + floodClassDay3 + "' title='" + tsid_stage_nws_3_day_forecast + " " + nws.date_time_day3 + "' style='margin-right: 7px;margin-left: 7px;'>" 
                                    // + "<a href='../../../web_apps/plot_macro/public/plot_macro.php?cwms_ts_id=" + tsid_stage_nws_3_day_forecast + "&start_day=0&end_day=4' title='" + tsid_stage_nws_3_day_forecast + " " + nws.date_time_day3 + "' target='_blank'>"
                                    + nws3_value
                                    // + "</a>"
                                    + "</span>";
            console.log('nwsCellInnerHTML: ', nwsCellInnerHTML);

            // Forecast Time goes here
            const forecastTimeCellInnerHTML   = "<span class='day_nws_ded' title='Data Entry Date'>" + nws.data_entry_date_day1 + "</span>";
            console.log('nwsCellInnerHTML: ', nwsCellInnerHTML);

            // Update the HTML inside the cell with the combined data
            nwsCell.innerHTML = nwsCellInnerHTML;
            forecastTimeCell.innerHTML = forecastTimeCellInnerHTML;
        }
    })
    .catch(error => {
        // Handle errors
        console.error('Error fetching nws:', error);
        throw error; // Re-throw the error for the caller to handle
    });
}

// Function to get crest data
function fetchAndUpdateCrest(crestCell, tsid_crest, flood_level) {
    if (tsid_crest !== null) {
        // Create an object to hold all the properties you want to pass
        const dataToSendcrest = {
            cwms_ts_id: encodeURIComponent(tsid_crest),
            //crest_date: encodeURIComponent(crest_date),
        };
        console.log("dataToSendcrest: " + dataToSendcrest);

        // Convert the object into a query string
        const queryStringcrest = Object.keys(dataToSendcrest).map(key => key + '=' + dataToSendcrest[key]).join('&');
        console.log("queryStringcrest: " + queryStringcrest);
    
        // Make an AJAX request to the PHP script, passing all the variables
        const urlcrest = `https://wm.mvs.ds.usace.army.mil/php_data_api/public/get_crest.php?${queryStringcrest}`;
        console.log("urlcrest: ", urlcrest);
        fetch(urlcrest)
        .then(response => response.json())
        .then(crest => {
            // Log the crest to the console
            console.log("crest: ", crest);

            if (crest !== null) {
                // Your code to be executed if crest is not null
                console.log("crest is not null");

                // GET CREST VALUE
                const crest_cwms_ts_id = crest.cwms_ts_id;
                console.log("crest_cwms_ts_id = ", crest_cwms_ts_id);

                const crest_value = parseFloat(crest.value);
                console.log("crest_value = ", crest_value);

                const crest_date_time = crest.date_time;
                console.log("crest_date_time = ", crest_date_time);

                const crest_delta_24 = parseFloat(crest.delta_24);
                console.log("crest_delta_24 = ", crest_delta_24);

                const crest_unit_id = crest.unit_id;
                console.log("crest_unit_id = ", crest_unit_id);

                // CREST CLASS
                if (crest_value >= flood_level) {
                    // console.log("Crest Above Flood Level");
                    var myCrestClass = "last_max_value_flood";
                } else {
                    // console.log("Crest Below Flood Level");
                    var myCrestClass = "--";
                }
                console.log("myCrestClass = ", myCrestClass);

                crestCellInnerHTML = "<span class='" + myCrestClass + "' title='" + tsid_crest + " " + crest.date_time + "'>" + crest_value.toFixed(2) + "&nbsp;&nbsp;&nbsp;&nbsp;" + crest.date_time.substring(0, 5) + "</span>";
            
                // Set the combined value to the cell, preserving HTML
                console.log("crestCellInnerHTML = ", crestCellInnerHTML);

                // Set the HTML inside the cell once the fetch is complete
                crestCell.innerHTML = crestCellInnerHTML;
            } else {
                // Your code to be executed if crest is null
                console.log("crest is null");

                crestCellInnerHTML = "<span title='" + tsid_crest + "'>"+ "  " + "</span>";
            
                // Set the combined value to the cell, preserving HTML
                console.log("crestCellInnerHTML = ", crestCellInnerHTML);

                // Set the HTML inside the cell once the fetch is complete
                crestCell.innerHTML = crestCellInnerHTML;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Function to get water quality data
function fetchAndUpdateRecordStage(recordStageCell, recordStageDateCell, tsid_stage_rev) {
    // Create an object to hold all the properties you want to pass
    const recordStageToSend = {
        cwms_ts_id: encodeURIComponent(tsid_stage_rev),
    };
    console.log("recordStageToSend: " + recordStageToSend);

    // Convert the object into a query string
    const recordStageQueryString = Object.keys(recordStageToSend).map(key => key + '=' + recordStageToSend[key]).join('&');
    console.log("recordStageQueryString: " + recordStageQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var recordStageURL = `https://wm.mvs.ds.usace.army.mil/php_data_api/public/get_record_stage2.php?${recordStageQueryString}`;
    console.log("recordStageURL: ", recordStageURL);
    fetch(recordStageURL)
    .then(response => response.json())
    .then(recordStage => {
        if (recordStage !== null) {
            // Log the stage to the console
            console.log("recordStage: ", recordStage);

            const recordStageInnerHTML = "<span title='" + recordStage.location_level_id + " " + recordStage.level_date + "'>" + parseFloat(recordStage.constant_level).toFixed(2) + "</span>";
            console.log("recordStageInnerHTML = ", recordStageInnerHTML);
            // Set the HTML inside the cell once the fetch is complete
            recordStageCell.innerHTML = recordStageInnerHTML;

            const recordStageDateInnerHTML = "<span title='" + recordStage.location_level_id + " " + recordStage.level_date + "'>" + recordStage.level_date.slice(0, -6) + "</span>";
            console.log("recordStageDateInnerHTML = ", recordStageDateInnerHTML);
            // Set the HTML inside the cell once the fetch is complete
            recordStageDateCell.innerHTML = recordStageDateInnerHTML;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// ================================================================================== // 
// ========================== RESERVOIR FETCH FUNCTIONS ============================= // 
// ================================================================================== //
// Function to get lake level data
function fetchAndUpdateLevel(levelCell, deltaCell, tsid_stage_29, flood_value, currentDateTimeMinusHours) {
    // Create an object to hold all the properties you want to pass
    const levelToSend = {
        cwms_ts_id: encodeURIComponent(tsid_stage_29),
    };
    console.log("levelToSend: " + levelToSend);
  
    
    // Convert the object into a query string
    const levelQueryString = Object.keys(levelToSend).map(key => key + '=' + levelToSend[key]).join('&');
    console.log("levelQueryString: " + levelQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    const urlStage = `get_stage.php?${levelQueryString}`;

    
    // Perform two fetch requests
    fetch(urlStage)
    .then(response => response.json())
    .then(data => {
        // Process the data as needed
        console.log('Data from fetch1:', data);
        if (data !== null) {
            const stage_cwms_ts_id = data.cwms_ts_id;
            console.log("stage_cwms_ts_id = ", stage_cwms_ts_id);

            // Format returned data time string to date time object
            const stage_date_time_cst = data.date_time_cst;
            const formattedDateTimeCST = formatStageDateTimeCST(stage_date_time_cst);

            const stage_value = (parseFloat(data.value)).toFixed(2);
            console.log("stage_value = ", stage_value);

            const stage_delta_24 = (parseFloat(data.delta_24)).toFixed(2);
            console.log("stage_delta_24 = ", stage_delta_24);

            // FLOOD CLASS
            const floodClass = determineStageClass(stage_value, flood_value);
            console.log("floodClass:", floodClass);

            // DATATIME CLASS
            const dateTimeClass = determineStageDateTimeClass(formattedDateTimeCST, currentDateTimeMinusHours);
            console.log("dateTimeClass:", dateTimeClass);

            const stageCellInnerHTML = 	"<span class='" + floodClass + "' title='" + stage_cwms_ts_id + ", Value = " + stage_value + ", DateTime = " + stage_date_time_cst + ", Flood = " + parseFloat(flood_value).toFixed(2) + "'>"
                                    // + "<a href='../../../web_apps/plot_macro/public/plot_macro.php?cwms_ts_id=" + stage_cwms_ts_id + "&start_day=4&end_day=0' target='_blank'>"
                                    + stage_value
                                    // + "</a>"
                                    +"</span>";
                        
            const deltaCellInnerHTML =  "<span title='" + stage_cwms_ts_id + ", Delta = " + stage_delta_24 + " = (" + stage_value + " - " + (parseFloat(data.value_24)).toFixed(2) +"), Value24 = " + (parseFloat(data.value_24)).toFixed(2) + ", DateTime = " + data.date_time_24_cst + ", Flood = " + parseFloat(flood_value).toFixed(2) + "'>" + stage_delta_24 + "</span>";

            // Set the combined value to the cell, preserving HTML
            console.log("stageCellInnerHTML = ", stageCellInnerHTML);

            // Set the HTML inside the cell once the fetch is complete
            levelCell.innerHTML = stageCellInnerHTML;
            deltaCell.innerHTML = deltaCellInnerHTML;
        }
    })
    .catch(error => {
        // Handle errors
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error for the caller to handle
    });
}

// Function to get lake storage data
function fetchAndUpdateStorage(consrCell, floodCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const storageToSend = {
        cwms_ts_id: encodeURIComponent(location_id),
    };
    console.log("storageToSend: " + storageToSend);
  
    // Convert the object into a query string
    const storageQueryString = Object.keys(storageToSend).map(key => key + '=' + storageToSend[key]).join('&');
    console.log("storageQueryString: " + storageQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    const urlStorage = `get_lake_storage.php?${storageQueryString}`;
    console.log("urlStorage: " + urlStorage);

    // Perform two fetch requests
    fetch(urlStorage)
    .then(response => response.json())
    .then(storage => {
        // Process the data as needed
        console.log('storage:', storage);

        if (storage !== null) {
            // CONSERVATION
            if (parseFloat(storage.value) > 0.0 && parseFloat(storage.toc) > 0.0 && parseFloat(storage.boc) >= 0.0) {
                if (parseFloat(storage.value)  < parseFloat(storage.boc)) {
                    console.log("Storage Less than Bottom of Conservation");
                    storageCellInnerHTML = "<span title='Lake Storage > 0, Top of Conservation > 0, and Bottom of Conservation > 0'>" + "0.00%" + "</span>";	
                } else if (parseFloat(storage.value) > parseFloat(storage.toc)) {
                    console.log("Storage Greater than Top of Conservation");
                    storageCellInnerHTML = "<span title='" + "Lake Storage > Top of Conservation: " + parseFloat(storage.value).toFixed(0) + " " + storage.unit_id + " > " + parseFloat(storage.toc).toFixed(0) + " " + storage.unit_id + "'>" + "100.00" + "</span>";	
                } else {
                    const total = (parseFloat(storage.value) - parseFloat(storage.boc))/(parseFloat(storage.toc) - parseFloat(storage.boc))*100;
                    console.log("total: ", total);
                    storageCellInnerHTML = "<span title='" + "(" + parseFloat(storage.value).toFixed(0) + " (" + storage.date_time + ") " + "(Lake Storage)" + " - " + parseFloat(storage.boc).toFixed(0) + "(Bottom of Conservation)" + ")/(" + parseFloat(storage.toc).toFixed(0) + "(Top of Conservation)" + "-" + parseFloat(storage.boc).toFixed(0) + "(Bottom of Conservation)" + ")*100" + " = " + total.toFixed(2) + "'>" + total.toFixed(2) + "</span>";	
                }
            } else {
                storageCellInnerHTML = " ";	
            }
            // Set the combined value to the cell, preserving HTML
            console.log("storageCellInnerHTML = ", storageCellInnerHTML);
            // Set the HTML inside the cell once the fetch is complete
            consrCell.innerHTML = storageCellInnerHTML;

            // FLOOD
            if (parseFloat(storage.value) > 0.0 && parseFloat(storage.tof) > 0.0 && parseFloat(storage.bof) >= 0.0) {
                if (parseFloat(storage.value)  < parseFloat(storage.bof)) {
                    console.log("Storage Less than Bottom of Flood");
                    storageUtilizedFloodCellInnerHTML = "<span title='Lake Storage > 0, Top of Flood > 0, and Bottom of Flood > 0'>" + "0.00" + "</span>";	
                } else if (parseFloat(storage.value) > parseFloat(storage.tof)) {
                    console.log("Storage Greater than Top of Flood");
                    storageUtilizedFloodCellInnerHTML = "<span title='" + "Lake Storage > Top of Flood: " + parseFloat(storage.value).toFixed(0) + " " + storage.unit_id + " > " + parseFloat(storage.tof).toFixed(0) + " " + storage.unit_id + "'>" + "100.00" + "</span>";	
                } else {
                    const total = (parseFloat(storage.value) - parseFloat(storage.bof))/(parseFloat(storage.tof) - parseFloat(storage.bof))*100;
                    console.log("total: ", total);
                    storageUtilizedFloodCellInnerHTML = "<span title='" + "(" + parseFloat(storage.value).toFixed(0) + " (" + storage.date_time + ") " + "(Lake Storage)" + " - " + parseFloat(storage.bof).toFixed(0) + "(Bottom of Flood)" + ")/(" + parseFloat(storage.tof).toFixed(0) + "(Top of Flood)" + "-" + parseFloat(storage.bof).toFixed(0) + "(Bottom of Flood)" + ")*100" + " = " + total.toFixed(2) + "'>" + total.toFixed(2) + "</span>";	
                }
            } else {
                storageUtilizedFloodCellInnerHTML += " ";	
            }
            // Set the combined value to the cell, preserving HTML
            console.log("storageUtilizedFloodCellInnerHTML = ", storageUtilizedFloodCellInnerHTML);
            // Set the HTML inside the cell once the fetch is complete
            floodCell.innerHTML = storageUtilizedFloodCellInnerHTML;
        }
    })
    .catch(error => {
        // Handle errors
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error for the caller to handle
    });
}

// Function to get lake precip data
function fetchAndUpdatePrecip(precipCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const precipToSend = {
        location_id: encodeURIComponent(location_id),
    };
    console.log("precipToSend: " + precipToSend);

    // Convert the object into a query string
    const precipQueryString = Object.keys(precipToSend).map(key => key + '=' + precipToSend[key]).join('&');
    console.log("precipQueryString: " + precipQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var urlPrecip = `get_precip.php?${precipQueryString}`;
    console.log("urlPrecip: ", + urlPrecip);
    fetch(urlPrecip)
    .then(response => response.json())
    .then(precip => {
        // Log the stage to the console
        console.log("precip: ", precip);
        precipCellInnerHTML = "<span class='--' title='" + precip.cwms_ts_id + " " + precip.date_time + "'>" + parseFloat(precip.value).toFixed(2) + "</span>";
        // Set the combined value to the cell, preserving HTML
        console.log("precipCellInnerHTML = ", precipCellInnerHTML);
        // Set the HTML inside the cell once the fetch is complete
        precipCell.innerHTML = precipCellInnerHTML;
    })
    .catch(error => {
        console.error('Error:', error);
    });	
}

// Function to get lake precip data
function fetchAndUpdateInflow(yesterdayInflowCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const inflowToSend = {
        location_id: encodeURIComponent(location_id),
    };
    console.log("inflowToSend: " + inflowToSend);

    // Convert the object into a query string
    const inflowQueryString = Object.keys(inflowToSend).map(key => key + '=' + inflowToSend[key]).join('&');
    console.log("inflowQueryString: " + inflowQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var urlYesterdaysInflow = `get_inflow.php?${inflowQueryString}`;
    console.log("urlYesterdaysInflow: ", + urlYesterdaysInflow);
    fetch(urlYesterdaysInflow)
    .then(response => response.json())
    .then(yesterdays_inflow => {
        // Log the stage to the console
        console.log("yesterdays_inflow: ", yesterdays_inflow);
        yesterdaysInflowCellInnerHTML = "<span class='--' title='" + yesterdays_inflow.cwms_ts_id + " " + yesterdays_inflow.date_time + "'>" + parseFloat(yesterdays_inflow.value).toFixed(0) + "</span>";
        // Set the combined value to the cell, preserving HTML
        console.log("yesterdaysInflowCellInnerHTML = ", yesterdaysInflowCellInnerHTML);
        // Set the HTML inside the cell once the fetch is complete
        yesterdayInflowCell.innerHTML = yesterdaysInflowCellInnerHTML;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to get lake storage data
function fetchAndUpdateOutflow(midnightCell, eveningCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const outflowToSend = {
        location_id: encodeURIComponent(location_id),
    };
    console.log("outflowToSend: " + outflowToSend);

    // Convert the object into a query string
    const outflowQueryString = Object.keys(outflowToSend).map(key => key + '=' + outflowToSend[key]).join('&');
    console.log("outflowQueryString: " + outflowQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var urlOutflow = `get_outflow.php?${outflowQueryString}`;
    console.log("urlOutflow: ", + urlOutflow);
    fetch(urlOutflow)
    .then(response => response.json())
    .then(outflow => {
        // Log the stage to the console
        console.log("outflow: ", outflow);

        // Bankfull Limit Class
        if (parseFloat(outflow.midnight) > parseFloat(outflow.bankfull)) { 						
            console.log("Flow Above Bankfull Limit");																		
            var myBankfullFlowLimitClass = "Bankfull_Limit";
        } else {
            console.log("Flow Below Bankfull Limit");
            var myBankfullFlowLimitClass = "--";
        }
        
        // MIDNIGHT
        outflowCellInnerHTML = "<span class='" + myBankfullFlowLimitClass + "' title='" + outflow.project_id + " " + outflow.midnight_date_time + " (lake_gate table) " + "'>" + parseFloat(outflow.midnight).toFixed(0) + "</span>";	
        // Set the combined value to the cell, preserving HTML
        console.log("outflowCellInnerHTML = ", outflowCellInnerHTML);
        // Set the HTML inside the cell once the fetch is complete
        midnightCell.innerHTML = outflowCellInnerHTML;


        // Bankfull Limit Class
        if (parseFloat(outflow.evening) > parseFloat(outflow.bankfull)) { 						
            console.log("Flow Above Bankfull Limit");																		
            var myBankfullFlowLimitClass = "Bankfull_Limit";
        } else {
            console.log("Flow Below Bankfull Limit");
            var myBankfullFlowLimitClass = "--";
        }

        // EVENING
        controlledOutflowEveningCellInnerHTML = "<span class='" + myBankfullFlowLimitClass + "' title='" + outflow.project_id + " " + outflow.evening_date_time + " (lake_gate table except for MarkTwain use lake qlev_fcst table) " + "'>" + parseFloat(outflow.evening).toFixed(0) + "</span>";		
        // Set the combined value to the cell, preserving HTML
        console.log("controlledOutflowEveningCellInnerHTML = ", controlledOutflowEveningCellInnerHTML);
        // Set the HTML inside the cell once the fetch is complete
        eveningCell.innerHTML = controlledOutflowEveningCellInnerHTML;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to get lake rule curve data
function fetchAndUpdateSeasonalRuleCurve(seasonalRuleCurveCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const ruleCurveToSend = {
        location_id: encodeURIComponent(location_id),
    };
    console.log("ruleCurveToSend: " + ruleCurveToSend);

    // Convert the object into a query string
    const rule_curveQueryString = Object.keys(ruleCurveToSend).map(key => key + '=' + ruleCurveToSend[key]).join('&');
    console.log("rule_curveQueryString: " + rule_curveQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var urlRuleCurve = `get_rule_curve.php?${rule_curveQueryString}`;
    console.log("urlRuleCurve: ", + urlRuleCurve);
    fetch(urlRuleCurve)
    .then(response => response.json())
    .then(rule_curve => {
        // Log the stage to the console
        console.log("rule_curve: ", rule_curve);
        // Extract lower and upper flow limits
        const rule_curve_spec = parseFloat(rule_curve[0].lev);
        const rule_curve_table = parseFloat(rule_curve[1].lev);
        console.log("rule_curve_spec: " + rule_curve_spec);
        console.log("rule_curve_table: " + rule_curve_table);
        if (rule_curve_spec === rule_curve_table) {
            ruleCurveCellInnerHTML = "<span title='" + rule_curve[0].project_id + " (lake rule_curve_spec table) " + "Rule Curve Inst: " + parseFloat(rule_curve[1].lev).toFixed(2) + "'>" + parseFloat(rule_curve_spec).toFixed(2) + "</span>";
        } else {
            ruleCurveCellInnerHTML = "<span title='" + rule_curve[0].project_id + " (lake rule_curve_spec table) " + "Rule Curve Inst: " + parseFloat(rule_curve[1].lev).toFixed(2) + "'>" + parseFloat(rule_curve_spec).toFixed(2) + "</span>";
        }
        // Set the combined value to the cell, preserving HTML
        console.log("ruleCurveCellInnerHTML = ", ruleCurveCellInnerHTML);
        // Set the HTML inside the cell once the fetch is complete
        seasonalRuleCurveCell.innerHTML = ruleCurveCellInnerHTML;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to get lake crest data
function fetchAndUpdateCrestForecast(crestCell, crestDateCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const poolForecastCrestToSend = {
        location_id: encodeURIComponent(location_id),
    };
    console.log("poolForecastCrestToSend: " + poolForecastCrestToSend);

    // Convert the object into a query string
    const poolForecastCrestQueryString = Object.keys(poolForecastCrestToSend).map(key => key + '=' + poolForecastCrestToSend[key]).join('&');
    console.log("poolForecastCrestQueryString: " + poolForecastCrestQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var urlPoolForecastCrest = `get_crest_forecast.php?${poolForecastCrestQueryString}`;
    console.log("urlPoolForecastCrest: " + urlPoolForecastCrest);
    fetch(urlPoolForecastCrest)
    .then(response => response.json())
    .then(pool_forecast_crest => {
        // Log the stage to the console
        console.log("pool_forecast_crest: ", pool_forecast_crest);
        let crestData = '';
        if (pool_forecast_crest !== null) {
            if (pool_forecast_crest.opt === "CG") {
                crestData = "Cresting";
            } else if (pool_forecast_crest.opt === "CD") {
                crestData = "Crested";
            } else if (pool_forecast_crest.opt === "<") {
                crestData = "< " + pool_forecast_crest.crest;
            } else if (pool_forecast_crest.crest !== null) {
                crestData = pool_forecast_crest.crest;
            }
            poolForecastCrestCelllInnerHTML = crestData;
            crestCell.innerHTML = poolForecastCrestCelllInnerHTML;
        } else {
            poolForecastCrestCelllInnerHTML = "";
            crestCell.innerHTML = poolForecastCrestCelllInnerHTML;
        }

        let crestDataDate = '';
        if (pool_forecast_crest !== null) {
            if (pool_forecast_crest.opt === "CG") {
                crestDataDate = "Cresting";
            } else if (pool_forecast_crest.opt === "CD") {
                crestDataDate = "Crested";
            } else if (pool_forecast_crest.opt === "<") {
                let crst_date = pool_forecast_crest.crst_dt;
                console.log("crst_date: ", crst_date);
                console.log("crst_date: ", typeof crst_date);
                crestDataDate = crst_date.slice(0, 5);
            } else if (pool_forecast_crest.crest !== null) {
                let crst_date = pool_forecast_crest.crst_dt;
                console.log("crst_date: ", crst_date);
                console.log("crst_date: ", typeof crst_date);
                crestDataDate = crst_date.slice(0, 5);
            }
            poolForecastCrestCelllDateInnerHTML = crestDataDate;
            crestDateCell.innerHTML = poolForecastCrestCelllDateInnerHTML;
        } else {
            poolForecastCrestCelllDateInnerHTML = "";
            crestDateCell.innerHTML = poolForecastCrestCelllDateInnerHTML;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// ========================================================================== // 
// ========================== SUPPORT FUNCTIONS ============================= // 
// ========================================================================== //
// Function to get current data time
function subtractHoursFromDate(date, hoursToSubtract) {
    return new Date(date.getTime() - (hoursToSubtract * 60 * 60 * 1000));
}

// Function to get current data time
function plusHoursFromDate(date, hoursToSubtract) {
    return new Date(date.getTime() + (hoursToSubtract * 60 * 60 * 1000));
}

// Function to add days to a given date
function addDaysToDate(date, days) {
    return new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
}

// Function to format number with leading zero if less than 9
function formatNumberWithLeadingZero(number) {
    return number < 10 ? number.toFixed(2).padStart(5, '0') : number.toFixed(2);
}

// Function to get current date time
function formatDateTime(dateTimeString) {
    var dateParts = dateTimeString.split(" ");
    var date = dateParts[0];
    var time = dateParts[1];
    var [month, day, year] = date.split("-");
    var [hours, minutes] = time.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}

// Function to format date time to cst for comparison
function formatStageDateTimeCST(stage_date_time_cst) {
    console.log("stage_date_time_cst = ", stage_date_time_cst);
    var stage_date_time_cst_formatted = formatDateTime(stage_date_time_cst);
    console.log("stage_date_time_cst_formatted", stage_date_time_cst_formatted);
    return stage_date_time_cst_formatted;
}

// Function determine last max class
function determineStageClass(stage_value, flood_value) {
    console.log("determineStageClass = ", stage_value + typeof(stage_value) + " " + flood_value + typeof(flood_value));
    var myStageClass;
    if (parseFloat(stage_value) >= parseFloat(flood_value)) {
        console.log("determineStageClass = ", stage_value + " >= " + flood_value);
        myStageClass = "last_max_value_flood";
    } else {
        console.log("Stage Below Flood Level");
        myStageClass = "last_max_value";
    }
    return myStageClass;
}

// Function determine date time class
function determineStageDateTimeClass(stage29_date_time_cst_formatted, currentDateTimeMinusHours) {
    var myStage29DateTimeClass;
    if (stage29_date_time_cst_formatted >= currentDateTimeMinusHours) {
        myStage29DateTimeClass = "date_time_current";
        console.log("on_time = ", stage29_date_time_cst_formatted);
    } else {
        myStage29DateTimeClass = "date_time_late";
        console.log("late = ", stage29_date_time_cst_formatted);
    }
    console.log("myStage29DateTimeClass = ", myStage29DateTimeClass);
    return myStage29DateTimeClass;
}