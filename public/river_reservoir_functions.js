/******************************************************************************
 *                               JSON FUNCTIONS                               *
 ******************************************************************************/
// Function to merge basinData with additional data
function mergeData(basinData, combinedFirstData, combinedSecondData, combinedForthData, combinedFifthData, combinedSixthData, combinedSeventhData, combinedEighthData, combinedNinethData, combinedTenthData) {
    // Check if basinData is an array and has elements
    if (Array.isArray(basinData) && basinData.length > 0) {
        // Iterate through each basin in basinData
        basinData.forEach(basin => {
            // console.log('Processing basin:', basin);

            // Check if basin has gages and gages is an array
            if (Array.isArray(basin.gages) && basin.gages.length > 0) {
                // Iterate through each gage in the current basin's gages
                basin.gages.forEach(gage => {
                    const locationId = gage.location_id;
                    const projectIdAlias = gage.project_id_alias;
                    // console.log('Processing gage with location_id:', locationId);

                    // Find the corresponding firstData object
                    const firstData = combinedFirstData.find(data => data["name"] === locationId);
                    if (firstData) {
                        // Append the firstData properties to the gage object
                        gage.metadata = firstData;
                        // console.log('Found firstData:', firstData);
                    } else {
                        gage.metadata = null;
                    }

                    // Find the corresponding secondData object
                    if (Array.isArray(combinedSecondData)) {
                        const secondData = combinedSecondData.find(data => data && data['location-level-id'] && data['location-level-id'].split('.')[0] === locationId);
                        if (secondData) {
                            // Append the secondData properties to the gage object
                            gage.flood = secondData;
                            // console.log('Found secondData:', secondData);
                        } else {
                            gage.flood = null;
                            // console.log('No matching secondData found for location_id:', locationId);
                        }
                    } else {
                        gage.flood = null;
                        // console.log('combinedSecondData is not an array');
                    }

                    // Find the corresponding forthData object
                    if (Array.isArray(combinedForthData)) {
                        const forthData = combinedForthData.find(data => data && data['location-id'] === locationId);
                        if (forthData) {
                            // Append the forthData properties to the gage object
                            gage.owner = forthData;
                            // console.log('Found forthData:', forthData);
                        } else {
                            gage.owner = null;
                            // console.log('No matching forthData found for location_id:', locationId);
                        }
                    } else {
                        gage.owner = null;
                        // console.log('combinedForthData is not an array');
                    }

                    // Find the corresponding fifthData object
                    if (Array.isArray(combinedFifthData)) {
                        const fifthData = combinedFifthData.find(data => data && data['location-level-id'] && data['location-level-id'].split('.')[0] === locationId);
                        if (fifthData) {
                            // Append the fifthData properties to the gage object
                            gage.recordstage = fifthData;
                            // console.log('Found fifthData:', fifthData);
                        } else {
                            gage.recordstage = null;
                            // console.log('No matching fifthData found for location_id:', locationId);
                        }
                    } else {
                        gage.recordstage = null;
                        // console.log('combinedFifthData is not an array');
                    }

                    // Find the corresponding sixthData object
                    if (Array.isArray(combinedSixthData)) {
                        const sixthData = combinedSixthData.find(data => data && data['location-level-id'] && data['location-level-id'].split('.')[0] === locationId);
                        if (sixthData) {
                            // Append the sixthData properties to the gage object
                            gage.ngvd29 = sixthData;
                            // console.log('Found sixthData:', sixthData);
                        } else {
                            gage.ngvd29 = null;
                            // console.log('No matching sixthData found for location_id:', locationId);
                        }
                    } else {
                        gage.ngvd29 = null;
                        // console.log('combinedSixthData is not an array');
                    }

                    // Find the corresponding seventhData object
                    if (Array.isArray(combinedSeventhData)) {
                        const seventhData = combinedSeventhData.find(data => data && data['location-level-id'].split('.')[0] === projectIdAlias);
                        if (seventhData) {
                            // Append the seventhData properties to the gage object
                            gage.top_of_flood = seventhData;
                            // console.log('Found seventhData:', seventhData);
                        } else {
                            gage.top_of_flood = null;
                            // console.log('No matching seventhData found for location_id:', locationId);
                        }
                    } else {
                        gage.top_of_flood = null;
                        // console.log('combinedSeventhData is not an array');
                    }

                    // Find the corresponding eighthData object
                    if (Array.isArray(combinedEighthData)) {
                        const eighthData = combinedEighthData.find(data => data && data['location-level-id'].split('.')[0] === projectIdAlias);
                        if (eighthData) {
                            // Append the eighthData properties to the gage object
                            gage.top_of_conservation = eighthData;
                            // console.log('Found eighthData:', eighthData);
                        } else {
                            gage.top_of_conservation = null;
                            // console.log('No matching eighthData found for location_id:', locationId);
                        }
                    } else {
                        gage.top_of_conservation = null;
                        // console.log('combinedEighthData is not an array');
                    }

                    // Find the corresponding ninethData object
                    if (Array.isArray(combinedNinethData)) {
                        const ninethData = combinedNinethData.find(data => data && data['location-level-id'].split('.')[0] === projectIdAlias);
                        if (ninethData) {
                            // Append the ninethData properties to the gage object
                            gage.bottom_of_flood = ninethData;
                            // console.log('Found ninethData:', ninethData);
                        } else {
                            gage.bottom_of_flood = null;
                            // console.log('No matching ninethData found for location_id:', locationId);
                        }
                    } else {
                        gage.bottom_of_flood = null;
                        // console.log('combinedNinethData is not an array');
                    }

                    // Find the corresponding tenthData object
                    if (Array.isArray(combinedTenthData)) {
                        const tenthData = combinedTenthData.find(data => data && data['location-level-id'].split('.')[0] === projectIdAlias);
                        if (tenthData) {
                            // Append the tenthData properties to the gage object
                            gage.bottom_of_conservation = tenthData;
                            // console.log('Found tenthData:', tenthData);
                        } else {
                            gage.bottom_of_conservation = null;
                            // console.log('No matching tenthData found for location_id:', locationId);
                        }
                    } else {
                        gage.bottom_of_conservation = null;
                        // console.log('combinedTenthData is not an array');
                    }
                });
            } else {
                // console.log('No gages found for this basin or gages is not an array');
            }

            // Push the updated basin to allData
            allData.push(basin);
            // console.log('Updated basin:', basin);
        });
    } else {
        // console.log('basinData is not an array or is empty');
    }

    // Return the merged data
    console.log('Final merged data:', allData);
    return allData;
}

function mergeDataCda(basinData, combinedFirstData, combinedSecondData, combinedThirdData, combinedForthData, combinedFifthData, combinedSixthData, combinedSeventhData, combinedEighthData, combinedNinethData, combinedTenthData, combinedEleventhData, combinedTwelfthData, combinedThirteenthData) {
    // Clear allData before merging data
    allData = [];

    // Iterate through each basin in basinData
    basinData.forEach(basin => {
        // Iterate through each gage in the current basin's gages
        basin.gages.forEach(gage => {
            const locationId = gage.location_id;

            // Find the corresponding firstData object
            const firstData = combinedFirstData.find(data => data["name"] === locationId);
            if (firstData) {
                // Append the firstData properties to the gage object
                gage.metadata = firstData;
            }

            // Find the corresponding secondData object
            if (Array.isArray(combinedSecondData)) {
                const secondData = combinedSecondData.find(data => data && data['location-level-id'].split('.')[0] === locationId);
                if (secondData) {
                    // Append the fifthData properties to the gage object
                    gage.flood = secondData;
                } else {
                    gage.flood = null;
                }
            } else {
                gage.flood = null;
            }

            // Find the corresponding thirdData object
            if (Array.isArray(combinedThirdData)) {
                const thirdData = combinedThirdData.find(data => data && data['location-id'] === locationId);
                if (thirdData) {
                    // Append the thirdData properties to the gage object
                    gage.basin = thirdData;
                } else {
                    gage.basin = null;
                }
            } else {
                gage.basin = null;
            }

            // Find the corresponding forthData object
            if (Array.isArray(combinedForthData)) {
                const forthData = combinedForthData.find(data => data && data['location-id'] === locationId);
                if (forthData) {
                    // Append the forthData properties to the gage object
                    gage.owner = forthData;
                } else {
                    gage.owner = null;
                }
            } else {
                gage.owner = null;
            }

            // Find the corresponding secondData object
            if (Array.isArray(combinedFifthData)) {
                const fifthData = combinedFifthData.find(data => data && data['location-level-id'].split('.')[0] === locationId);
                if (fifthData) {
                    // Append the fifthData properties to the gage object
                    gage.recordstage = fifthData;
                } else {
                    gage.recordstage = null;
                }
            } else {
                gage.recordstage = null;
            }

            // Find the corresponding sixthData object
            if (Array.isArray(combinedSixthData)) {
                const sixthData = combinedSixthData.find(data => data && data['location-level-id'].split('.')[0] === locationId);
                if (sixthData) {
                    // Append the sixthData properties to the gage object
                    gage.ngvd29 = sixthData;
                } else {
                    gage.ngvd29 = null;
                }
            } else {
                gage.ngvd29 = null;
            }

            // Find the corresponding seventhData object
            if (Array.isArray(combinedSeventhData)) {
                const seventhData = combinedSeventhData.find(data => data && data['location-level-id'].split('.')[0] === locationId);
                if (seventhData) {
                    // Append the fifthData properties to the gage object
                    gage.phase1 = seventhData;
                } else {
                    gage.phase1 = null;
                }
            } else {
                gage.phase1 = null;
            }

            // Find the corresponding eighthData object
            if (Array.isArray(combinedEighthData)) {
                const eighthData = combinedEighthData.find(data => data && data['location-level-id'].split('.')[0] === locationId);
                if (eighthData) {
                    // Append the fifthData properties to the gage object
                    gage.phase2 = eighthData;
                } else {
                    gage.phase2 = null;
                }
            } else {
                gage.phase2 = null;
            }

            // Find the corresponding ninethData object
            if (Array.isArray(combinedNinethData)) {
                const ninethData = combinedNinethData.find(data => data && data['location-level-id'].split('.')[0] === locationId);
                if (ninethData) {
                    // Append the fifthData properties to the gage object
                    gage.lwrp = ninethData;
                } else {
                    gage.lwrp = null;
                }
            } else {
                gage.lwrp = null;
            }

            // Find the corresponding tenthData object
            if (Array.isArray(combinedTenthData)) {
                const tenthData = combinedTenthData.find(data => data && data['location-level-id'].split('.')[0] === locationId.split('-')[0]);
                if (tenthData) {
                    // Append the fifthData properties to the gage object
                    gage.tof = tenthData;
                } else {
                    gage.tof = null;
                }
            } else {
                gage.tof = null;
            }

            // Find the corresponding eleventhData object
            if (Array.isArray(combinedEleventhData)) {
                const eleventhData = combinedEleventhData.find(data => data && data['location-level-id'].split('.')[0] === locationId.split('-')[0]);
                if (eleventhData) {
                    // Append the fifthData properties to the gage object
                    gage.bof = eleventhData;
                } else {
                    gage.bof = null;
                }
            } else {
                gage.bof = null;
            }

            // Find the corresponding twelfthData object
            if (Array.isArray(combinedTwelfthData)) {
                const twelfthData = combinedTwelfthData.find(data => data && data['location-level-id'].split('.')[0] === locationId.split('-')[0]);
                if (twelfthData) {
                    // Append the fifthData properties to the gage object
                    gage.boc = twelfthData;
                } else {
                    gage.boc = null;
                }
            } else {
                gage.boc = null;
            }

            // Find the corresponding thirteenthData object
            if (Array.isArray(combinedThirteenthData)) {
                const thirteenthData = combinedThirteenthData.find(data => data && data['location-level-id'].split('.')[0] === locationId.split('-')[0]);
                if (thirteenthData) {
                    // Append the fifthData properties to the gage object
                    gage.toc = thirteenthData;
                } else {
                    gage.toc = null;
                }
            } else {
                gage.toc = null;
            }
        })
    });

    // Push the updated basinData to allData
    allData = basinData;
}


/******************************************************************************
 *                         RIVER TABLE FUNCTIONS                              *
 ******************************************************************************/
// Function to create and populate the river table header
function createRiverTableHeader(nws_day1_date_title, nws_day2_date_title, nws_day3_date_title) {
    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('id', 'webrep');

    // TITLE ROW 1
    // Create a table header row
    const headerRow = table.insertRow(0);

    // Create table headers for the desired columns
    const columns = ["River Mile", "Gage Station", "Current Level", "24hr Delta", "National Weather Service River Forecast", "Flood Level", "Gage Zero", "Record Stage", "Record Date"];

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
        th.style.backgroundColor = 'darkblue'; // Set background color to dark blue
        headerRow.appendChild(th);
    });

    // TITLE ROW 2
    // Create a table header row
    const headerRow2 = table.insertRow(1);

    // Create table headers for the desired columns
    const columns2 = ["National Weather Service River Forecast"];

    columns2.forEach((columnName) => {
        if (columnName === "National Weather Service River Forecast") {
            const thNext3Days = document.createElement('th');
            thNext3Days.textContent = "Next 3 days";
            thNext3Days.style.backgroundColor = 'darkblue'; // Set background color to dark blue
            headerRow2.appendChild(thNext3Days);

            const thForecastTime = document.createElement('th');
            thForecastTime.textContent = "Forecast Time";
            thForecastTime.rowSpan = 2;
            thForecastTime.style.backgroundColor = 'darkblue'; // Set background color to dark blue
            headerRow2.appendChild(thForecastTime);

            const thCrest = document.createElement('th');
            thCrest.textContent = "Crest & Date";
            thCrest.rowSpan = 2;
            thCrest.style.backgroundColor = 'darkblue'; // Set background color to dark blue
            headerRow2.appendChild(thCrest);
        }
    });


    // TITLE ROW 3
    // Create a table header row
    const headerRow3 = table.insertRow(2);

    // Create table headers for the desired columns
    const columns3 = ["National Weather Service River Forecast"];

    columns3.forEach((columnName) => {
        if (columnName === "National Weather Service River Forecast") {
            const thNext3DaysDate = document.createElement('th');
            thNext3DaysDate.innerHTML = "<span style='margin-right: 7px;margin-left: 7px;'>" + nws_day1_date_title + "</span>" + "|";
            thNext3DaysDate.innerHTML += "<span style='margin-right: 7px;margin-left: 7px;'>" + nws_day2_date_title + "</span>" + "|";
            thNext3DaysDate.innerHTML += "<span style='margin-right: 7px;margin-left: 7px;'>" + nws_day3_date_title + "</span>";
            thNext3DaysDate.style.backgroundColor = 'darkblue'; // Set background color to dark blue
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
        // console.log('currentDateTime:', currentDateTime);

        // Subtract two hours from current date and time
        const currentDateTimeMinus2Hours = subtractHoursFromDate(currentDateTime, 2);
        // console.log('currentDateTimeMinus2Hours :', currentDateTimeMinus2Hours);

        // Subtract thirty hours from current date and time
        const currentDateTimeMinus30Hours = subtractHoursFromDate(currentDateTime, 64);
        // console.log('currentDateTimeMinus30Hours :', currentDateTimeMinus30Hours);

        // Add thirty hours to current date and time
        const currentDateTimePlus30Hours = plusHoursFromDate(currentDateTime, 30);
        // console.log('currentDateTimePlus30Hours :', currentDateTimePlus30Hours);

        // Add four days to current date and time
        const currentDateTimePlus4Days = addDaysToDate(currentDateTime, 4);
        // console.log('currentDateTimePlus4Days :', currentDateTimePlus4Days);

        // Add fourteen days to current date and time
        const currentDateTimePlus14Days = addDaysToDate(currentDateTime, 14);
        // console.log('currentDateTimePlus14Days :', currentDateTimePlus14Days);

        // Subtract thirty hours from current date and time
        const currentDateTimeMinus48Hours = subtractHoursFromDate(currentDateTime, 48);
        // console.log('currentDateTimeMinus48Hours :', currentDateTimeMinus48Hours);


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
                    // console.log("c_count hardcoded:", c_count);

                    let flood_level = null;
                    // Check if locData has the 'flood' property and if its 'constant-value' is not null
                    if (locData.flood_level !== null) {
                        // Check conditions for flood level value and format it to two decimal places if it falls within range
                        if (
                            locData.flood["constant-value"] === null ||
                            parseFloat(locData.flood["constant-value"]).toFixed(2) == 0.00 ||
                            parseFloat(locData.flood["constant-value"]).toFixed(2) > 900
                        ) {
                            flood_level = null; // If flood level is null or outside range, set flood_level to an empty string
                        } else {
                            flood_level = parseFloat(locData.flood["constant-value"]).toFixed(2); // Otherwise, format flood level to two decimal places
                        }
                    } else {
                        flood_level = null;
                    }

                    if (locData.visible === true && locData.river_reservoir === true) {
                        // console.log("visible and river_reservoir are true");

                        // RIVER MILE
                        const rivermileCell = document.createElement('td');
                        if (locData.river_mile_hard_coded !== null) {
                            if (locData.river_mile_hard_coded > 900) {
                                rivermileCell.innerHTML = '<div class="hard_coded" title="Hard Coded in JSON, No Cloud Option Yet">' + "" + '</div>';
                            } else if (locData.river_mile_hard_coded < 9 || (Number.isInteger((locData.river_mile_hard_coded)))) {
                                rivermileCell.innerHTML = '<div class="hard_coded" title="Hard Coded in JSON, No Cloud Option Yet">' + (locData.river_mile_hard_coded).toFixed(1).padStart(4, '0') + '</div>';
                            } else {
                                rivermileCell.innerHTML = '<div class="hard_coded" title="Hard Coded in JSON, No Cloud Option Yet">' + (locData.river_mile_hard_coded).toFixed(1) + '</div>';
                            }
                        } else {
                            rivermileCell.innerHTML = '<div class="hard_coded" title="Hard Coded in JSON, No Cloud Option Yet">' + "--" + '</div>';
                        }
                        locationRow.appendChild(rivermileCell);


                        // LOCATION
                        const locationCell = document.createElement('td');
                        locationCell.innerHTML = "<span title='" + locData.location_id + "'>" + locData.metadata["public-name"] + "<span>";
                        locationRow.appendChild(locationCell);


                        // STAGE CURRENT
                        const stageCell = document.createElement('td');
                        stageCell.textContent = "";


                        // DELTA
                        const deltaCell = document.createElement('td');
                        deltaCell.textContent = "";

                        const tsidStage = locData.display_stage_29 ? locData.tsid_stage_29 : locData.tsid_stage_rev;
                        fetchStage(stageCell, deltaCell, tsidStage, flood_level, currentDateTimeMinus2Hours, currentDateTime, currentDateTimeMinus30Hours);
                        locationRow.appendChild(stageCell);
                        locationRow.appendChild(deltaCell);


                        // NWS THREE DAYS FORECAST
                        const nwsCell = document.createElement('td');
                        nwsCell.textContent = "";


                        // NWS THREE DAYS FORECAST TIME
                        const forecastTimeCell = document.createElement('td');
                        forecastTimeCell.textContent = "";

                        fetchNwsForecast(nwsCell, forecastTimeCell, locData.tsid_stage_rev, locData.tsid_stage_nws_3_day_forecast, flood_level, currentDateTime, currentDateTimePlus4Days);
                        locationRow.appendChild(nwsCell);
                        locationRow.appendChild(forecastTimeCell);


                        // CREST AND DATE
                        const crestCell = document.createElement('td');
                        crestCell.textContent = "";
                        fetchCrest(crestCell, locData.tsid_crest, flood_level, currentDateTime, currentDateTimePlus14Days);
                        locationRow.appendChild(crestCell);


                        // FLOOD LEVEL
                        const floodCell = document.createElement('td');
                        floodCell.innerHTML = "<span title='" + locData.level_id + "'>" + (flood_level === null ? "" : flood_level) + "<span>";
                        locationRow.appendChild(floodCell);


                        // GAGE ZERO
                        const elevationCell = document.createElement('td');
                        elevationCell.innerHTML = "<span class='" + (locData.metadata["vertical-datum"] === "NGVD29" ? "ngvd29" : "--") + "' title='" + locData.metadata["vertical-datum"] + "'>" + (parseFloat(locData.metadata["elevation"])).toFixed(2) + "<span>";
                        locationRow.appendChild(elevationCell);


                        // RECORD STAGE
                        const recordStageCell = document.createElement('td');
                        if (locData.recordstage !== null && locData.recordstage !== undefined) {
                            recordStageCell.innerHTML = (locData.recordstage["constant-value"]).toFixed(2);
                        } else {
                            recordStageCell.innerHTML = "";
                        }
                        locationRow.appendChild(recordStageCell);


                        // RECORD DATE
                        const recordStageDateCell = document.createElement('td');
                        if (locData.recordstage !== null && locData.recordstage !== undefined) {
                            recordStageDateCell.innerHTML = '<div class="hard_coded" title="Hard Coded in JSON, No Cloud Option Yet">' + locData.record_stage_date_hard_coded + '</div>';
                        }
                        locationRow.appendChild(recordStageDateCell);
                    }

                    // Append locationRow to tableBody
                    tableBody.appendChild(locationRow);
                }
            })
        }

    });

}


/******************************************************************************
 *                          LAKE TABLE FUNCTIONS                              *
 ******************************************************************************/
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
        th.style.backgroundColor = 'darkblue'; // Set background color to dark blue
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
            thStorageConsr.style.backgroundColor = 'darkblue'; // Set background color to dark blue
            headerRowLake2.appendChild(thStorageConsr);

            const thStorageFlood = document.createElement('th');
            thStorageFlood.textContent = "Flood";
            thStorageFlood.style.backgroundColor = 'darkblue'; // Set background color to dark blue
            headerRowLake2.appendChild(thStorageFlood);
        }
        if (columnName === "Controlled Outflow") {
            const thMidnightOutflow = document.createElement('th');
            thMidnightOutflow.textContent = "Midnight";
            thMidnightOutflow.style.backgroundColor = 'darkblue'; // Set background color to dark blue
            headerRowLake2.appendChild(thMidnightOutflow);

            const thEveningOutflow = document.createElement('th');
            thEveningOutflow.textContent = "Evening";
            thEveningOutflow.style.backgroundColor = 'darkblue'; // Set background color to dark blue
            headerRowLake2.appendChild(thEveningOutflow);
        }
        if (columnName === "Pool Forecast") {
            const thForecastCrest = document.createElement('th');
            thForecastCrest.textContent = "Crest";
            thForecastCrest.style.backgroundColor = 'darkblue'; // Set background color to dark blue
            headerRowLake2.appendChild(thForecastCrest);

            const thForecastDate = document.createElement('th');
            thForecastDate.textContent = "Date";
            thForecastDate.style.backgroundColor = 'darkblue'; // Set background color to dark blue
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
function createReservoirTableBody(allData) {
    const tableBodyLake = document.querySelector('#webreplake tbody');

    allData.forEach(basinLakeData => {
        // Get current date and time
        const currentDateTime = new Date();
        // console.log('currentDateTime:', currentDateTime);

        // Subtract two hours from current date and time
        const currentDateTimeMinus2Hours = subtractHoursFromDate(currentDateTime, 2);
        // console.log('currentDateTimeMinus2Hours :', currentDateTimeMinus2Hours);

        // Subtract thirty hours from current date and time
        const currentDateTimeMinus30Hours = subtractHoursFromDate(currentDateTime, 64);
        // console.log('currentDateTimeMinus30Hours :', currentDateTimeMinus30Hours);

        // Loop through each location in the basin and create rows for them
        // Check if basin has gages and gages is an array
        if (Array.isArray(basinLakeData.gages) && basinLakeData.gages.length > 0) {
            // Iterate through each gage in the current basin's gages
            basinLakeData.gages.forEach(locData => {
                if (locData.river_reservoir_lake === true) { // Check if river_reservoir_lake is true
                    const locationLakeRow = document.createElement('tr');

                    // SETTING UP VARIABLES
                    // Prepare c_count to get 24 hour values to calculate delta 
                    let c_count = null;
                    c_count = locData.c_count;
                    // console.log("c_count hardcoded:", c_count);

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

                    // Get lake storage info
                    const top_of_conservation = locData.top_of_conservation["constant-value"];
                    const bottom_of_conservation = locData.bottom_of_conservation["constant-value"];
                    const top_of_flood = locData.top_of_flood["constant-value"];
                    const bottom_of_flood = locData.bottom_of_flood["constant-value"];

                    // console.log('Reservoir Lake = :', locData.location_id);

                    // LAKE LOCATION
                    const locationLakeCell = document.createElement('td');
                    locationLakeCell.innerHTML = "<span title='" + locData.location_id + "'>" + locData.metadata["public-name"] + "<span>";
                    locationLakeRow.appendChild(locationLakeCell);


                    // CURRENT LAKE LEVEL
                    const levelCell = document.createElement('td');
                    levelCell.textContent = "--";


                    // DELTA
                    const deltaCell = document.createElement('td');
                    deltaCell.textContent = "--";

                    fetchLakeLevel(levelCell, deltaCell, locData.tsid_stage_29, flood_level, top_of_conservation, bottom_of_conservation, top_of_flood, bottom_of_flood, currentDateTimeMinus2Hours, currentDateTime, currentDateTimeMinus30Hours);
                    locationLakeRow.appendChild(levelCell);
                    locationLakeRow.appendChild(deltaCell);


                    // POOL CONSERVATION
                    const conservationCell = document.createElement('td');
                    conservationCell.textContent = "--";


                    // POOL FLOOD
                    const floodCell = document.createElement('td');
                    floodCell.innerHTML = "--";

                    fetchStorageUtilized(conservationCell, floodCell, locData.tsid_storage, flood_level, top_of_conservation, bottom_of_conservation, top_of_flood, bottom_of_flood, currentDateTimeMinus2Hours, currentDateTime, currentDateTimeMinus30Hours);
                    locationLakeRow.appendChild(conservationCell);
                    locationLakeRow.appendChild(floodCell);


                    // PRECIP LAKE
                    const precipCell = document.createElement('td');
                    precipCell.innerHTML = "--";
                    fetchLakePrecip(precipCell, locData.tsid_precip_lake, currentDateTime, currentDateTimeMinus30Hours);
                    locationLakeRow.appendChild(precipCell);


                    // YESTERDAY LAKE INFLOW
                    const inflowCell = document.createElement('td');
                    inflowCell.innerHTML = "--";
                    fetchLakeInflow(inflowCell, locData.tsid_yesterday_inflow, currentDateTime, currentDateTimeMinus30Hours);
                    locationLakeRow.appendChild(inflowCell);


                    // MIDNIGHT LAKE FLOW (PHP)
                    const midnightCell = document.createElement('td');
                    const eveningCell = document.createElement('td');
                    const seasonalRuleCurveCell = document.createElement('td');
                    const crestCell = document.createElement('td');
                    const crestDateCell = document.createElement('td');
                    fetchAndLogFlowData(locData.location_id, midnightCell, eveningCell, seasonalRuleCurveCell, crestCell, crestDateCell);

                    locationLakeRow.appendChild(midnightCell);


                    // EVENING LAKE FLOW (PHP)
                    locationLakeRow.appendChild(eveningCell);


                    // SEASONAL RULE CURVE LAKE
                    locationLakeRow.appendChild(seasonalRuleCurveCell);


                    // CREST LAKE(PHP)
                    locationLakeRow.appendChild(crestCell);


                    // CREST LAKE DATE (PHP)
                    locationLakeRow.appendChild(crestDateCell);


                    // RECORD STAGE LAKE
                    const recordStageCell = document.createElement('td');
                    if (locData.recordstage !== null && locData.recordstage !== undefined) {
                        recordStageCell.innerHTML = (locData.recordstage["constant-value"]).toFixed(2);
                    } else {
                        recordStageCell.innerHTML = "";
                    }
                    locationLakeRow.appendChild(recordStageCell);


                    // RECORD STAGE DATE LAKE
                    const recordStageDateCell = document.createElement('td');
                    if (locData.recordstage !== null && locData.recordstage !== undefined) {
                        recordStageDateCell.innerHTML = '<div class="hard_coded" title="Hard Coded in JSON, No Cloud Option Yet">' + locData.record_stage_date_hard_coded + '</div>';
                    }
                    locationLakeRow.appendChild(recordStageDateCell);

                    tableBodyLake.appendChild(locationLakeRow);
                }
            })
        }
    });
}


/******************************************************************************
 *                          RIVER FETCH FUNCTIONS                             *
 ******************************************************************************/
// Function to get stage data
function fetchStage(stageCell, deltaCell, tsidStage, flood_level, currentDateTimeMinus2Hours, currentDateTime, currentDateTimeMinus30Hours) {
    if (tsidStage !== null) {
        // Fetch the time series data from the API using the determined query string
        let urlStage = null;
        if (cda === "public") {
            urlStage = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsidStage}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else if (cda === "internal") {
            urlStage = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsidStage}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else {

        }
        // console.log("urlStage = ", urlStage);
        fetch(urlStage, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;version=2'
            }
        })
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    // If not, throw an error
                    throw new Error('Network response was not ok');
                }
                // If response is ok, parse it as JSON
                return response.json();
            })
            .then(stage => {
                // console.log("stage:", stage);

                // Convert timestamps in the JSON object
                stage.values.forEach(entry => {
                    entry[0] = formatNWSDate(entry[0]); // Update timestamp
                });

                // console.log("stageFormatted = ", stage);

                // Get the last non-null value from the stage data
                const lastNonNullValue = getLastNonNullValue(stage);
                // console.log("lastNonNullValue:", lastNonNullValue);

                // Check if a non-null value was found
                if (lastNonNullValue !== null) {
                    // Extract timestamp, value, and quality code from the last non-null value
                    var timestampLast = lastNonNullValue.timestamp;
                    var valueLast = parseFloat(lastNonNullValue.value).toFixed(2);
                    var qualityCodeLast = lastNonNullValue.qualityCode;

                    // Log the extracted valueLasts
                    // console.log("timestampLast:", timestampLast);
                    // console.log("valueLast:", valueLast);
                    // console.log("qualityCodeLast:", qualityCodeLast);
                } else {
                    // If no non-null valueLast is found, log a message
                    // console.log("No non-null valueLast found.");
                }

                const c_count = calculateCCount(tsidStage);
                // console.log("c_count:", c_count);

                const lastNonNull24HoursValue = getLastNonNull24HoursValue(stage, c_count);
                // console.log("lastNonNull24HoursValue:", lastNonNull24HoursValue);

                // Check if a non-null value was found
                if (lastNonNull24HoursValue !== null) {
                    // Extract timestamp, value, and quality code from the last non-null value
                    var timestamp24HoursLast = lastNonNull24HoursValue.timestamp;
                    var value24HoursLast = parseFloat(lastNonNull24HoursValue.value).toFixed(2);
                    var qualityCode24HoursLast = lastNonNull24HoursValue.qualityCode;

                    // Log the extracted valueLasts
                    // console.log("timestamp24HoursLast:", timestamp24HoursLast);
                    // console.log("value24HoursLast:", value24HoursLast);
                    // console.log("qualityCode24HoursLast:", qualityCode24HoursLast);
                } else {
                    // If no non-null valueLast is found, log a message
                    // console.log("No non-null valueLast found.");
                }

                // Calculate the 24 hours change between first and last value
                const delta_24 = (valueLast - value24HoursLast).toFixed(2);
                // console.log("delta_24:", delta_24);

                // Format the last valueLast's timestampLast to a string
                const formattedLastValueTimeStamp = formatTimestampToString(timestampLast);
                // console.log("formattedLastValueTimeStamp = ", formattedLastValueTimeStamp);

                // Create a Date object from the timestampLast
                const timeStampDateObject = new Date(timestampLast);
                // console.log("timeStampDateObject = ", timeStampDateObject);

                // Subtract 24 hours (24 * 60 * 60 * 1000 milliseconds) from the timestampLast date
                const timeStampDateObjectMinus24Hours = new Date(timestampLast - (24 * 60 * 60 * 1000));
                // console.log("timeStampDateObjectMinus24Hours = ", timeStampDateObjectMinus24Hours);


                // FLOOD CLASS
                var floodClass = determineStageClass(valueLast, flood_level);
                // console.log("floodClass:", floodClass);

                // DATATIME CLASS
                // var dateTimeClass = determineDateTimeClass(timeStampDateObject, currentDateTimeMinus2Hours);
                // console.log("dateTimeClass:", dateTimeClass);

                if (valueLast === null) {
                    innerHTMLStage = "<span class='missing'>"
                        + "-M-"
                        + "</span>"
                        + "<span class='--'>"
                        + "label"
                        + "</span>";
                } else {
                    innerHTMLStage = "<span class='" + floodClass + "' title='" + stage.name + ", Value = " + valueLast + ", Date Time = " + timestampLast + "'>"
                        + "<a href='../../../district_templates/chart/public/chart.html?cwms_ts_id=" + stage.name + "&start_day=4&end_day=0' target='_blank'>"
                        + valueLast
                        + "</a>"
                        + "</span>";
                    innerHTMLDelta = "<span title='" + stage.name + ", Value = " + value24HoursLast + ", Date Time = " + timestamp24HoursLast + ", Delta = (" + valueLast + " - " + value24HoursLast + ") = " + delta_24 + "'>"
                        + delta_24
                        + "</span>";

                }
                stageCell.innerHTML = innerHTMLStage;
                deltaCell.innerHTML = innerHTMLDelta;
            })
            .catch(error => {
                // Catch and log any errors that occur during fetching or processing
                console.error("Error fetching or processing data:", error);
            });
    }
}

// Function to fetch and update NWS data
function fetchNwsForecast(nwsCell, forecastTimeCell, tsidStage, tsid_stage_nws_3_day_forecast, flood_level, currentDateTime, currentDateTimePlus4Days) {
    // Log current date and time
    // console.log("currentDateTime = ", currentDateTime);
    // console.log("currentDateTimePlus4Days = ", currentDateTimePlus4Days);

    const { currentDateTimeMidNightISO, currentDateTimePlus4DaysMidNightISO } = generateDateTimeStrings(currentDateTime, currentDateTimePlus4Days);

    let innerHTMLStage = null; // Declare innerHTMLStage variable with a default value
    let innerHTMLForecastTime = null;

    if (tsidStage !== null) {
        // console.log("tsidStage:", tsidStage);
        // console.log("tsidStage:", typeof (tsidStage));
        // console.log("tsidStage:", tsidStage.slice(-2));

        if (tsidStage.slice(-2) !== "29" && tsid_stage_nws_3_day_forecast !== null) {
            // console.log("The last two characters are not '29'");

            // Fetch the time series data from the API using the determined query string
            let urlNWS = null;
            if (cda === "public") {
                urlNWS = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_stage_nws_3_day_forecast}&begin=${currentDateTimeMidNightISO}&end=${currentDateTimePlus4DaysMidNightISO}&office=MVS`;
            } else if (cda === "internal") {
                urlNWS = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_stage_nws_3_day_forecast}&begin=${currentDateTimeMidNightISO}&end=${currentDateTimePlus4DaysMidNightISO}&office=MVS`;
            } else {

            }
            // console.log("urlNWS = ", urlNWS);
            fetch(urlNWS, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;version=2'
                }
            })
                .then(response => {
                    // Check if the response is ok
                    if (!response.ok) {
                        // If not, throw an error
                        throw new Error('Network response was not ok');
                    }
                    // If response is ok, parse it as JSON
                    return response.json();
                })
                .then(nws3Days => {
                    // console.log("nws3Days: ", nws3Days);

                    // Convert timestamps in the JSON object
                    nws3Days.values.forEach(entry => {
                        entry[0] = formatNWSDate(entry[0]); // Update timestamp
                    });

                    // console.log("nws3DaysFormatted = ", nws3Days);

                    // Extract values with time ending in "13:00"
                    const valuesWithTimeNoon = extractValuesWithTimeNoon(nws3Days.values);

                    // Output the extracted values
                    // console.log("valuesWithTimeNoon = ", valuesWithTimeNoon);

                    // Extract the second middle value
                    const firstFirstValue = valuesWithTimeNoon[1][0];
                    const firstMiddleValue = (valuesWithTimeNoon[1][1] !== null) ? ((parseFloat(valuesWithTimeNoon[1][1])).toFixed(2) < 10 ? "0" + (parseFloat(valuesWithTimeNoon[1][1])).toFixed(2) : (parseFloat(valuesWithTimeNoon[1][1])).toFixed(2)) + "  |  " : "";

                    // Extract the second middle value
                    const secondFirstValue = valuesWithTimeNoon[2][0];
                    const secondMiddleValue = (valuesWithTimeNoon[2][1] !== null) ? ((parseFloat(valuesWithTimeNoon[2][1])).toFixed(2) < 10 ? "0" + (parseFloat(valuesWithTimeNoon[2][1])).toFixed(2) : (parseFloat(valuesWithTimeNoon[2][1])).toFixed(2)) + "  |  " : "";

                    // Extract the second middle value
                    const thirdFirstValue = valuesWithTimeNoon[3][0];
                    const thirdMiddleValue = (valuesWithTimeNoon[3][1] !== null) ? ((parseFloat(valuesWithTimeNoon[3][1])).toFixed(2) < 10 ? "0" + (parseFloat(valuesWithTimeNoon[3][1])).toFixed(2) : (parseFloat(valuesWithTimeNoon[3][1])).toFixed(2)) : "";

                    // Dertermine Flood Classes
                    var floodClassDay1 = determineStageClass(firstMiddleValue, flood_level);
                    // console.log("floodClassDay1:", floodClassDay1);

                    var floodClassDay2 = determineStageClass(secondMiddleValue, flood_level);
                    // console.log("floodClassDay2:", floodClassDay2);

                    var floodClassDay3 = determineStageClass(thirdMiddleValue, flood_level);
                    // console.log("floodClassDay3:", floodClassDay3);

                    if (nws3Days !== null) {
                        innerHTMLStage = "<span class='" + floodClassDay1 + "'>"
                            + firstMiddleValue
                            + "</span>"
                            + "<span class='" + floodClassDay2 + "'>"
                            + secondMiddleValue
                            + "</span>"
                            + "<span class='" + floodClassDay3 + "'>"
                            + thirdMiddleValue
                            + "</span>";

                        // Get "Forecast Time" from exported Json file, https://wm.mvs.ds.usace.army.mil/php_data_api/public/json/exportNwsForecasts2Json.json
                        fetchAndLogNwsData(tsid_stage_nws_3_day_forecast, forecastTimeCell);


                        // innerHTMLForecastTime = "<span class='hard_coded_php' title='Uses PHP Json Output, No Cloud Option to Access Custom Schema Yet'>" + "--" + "</span>";
                    } else {
                        innerHTMLStage = "<span class='missing'>" + "-M-" + "</span>";
                        innerHTMLForecastTime = "<span class='missing' style='background-color: orange;'>" + "-cdana-" + "</span>";
                    }
                    nwsCell.innerHTML = innerHTMLStage;
                    // forecastTimeCell.innerHTML = innerHTMLForecastTime;
                })
                .catch(error => {
                    // Catch and log any errors that occur during fetching or processing
                    console.error("Error fetching or processing data:", error);
                });
        } else {
            // console.log("The last two characters are '29'");
        }
    }
}

// Function to get crest data
function fetchCrest(crestCell, tsidCrest, flood_level, currentDateTime, currentDateTimePlus14Days) {
    if (tsidCrest !== null && tsidCrest !== undefined) {
        // Fetch the time series data from the API using the determined query string
        let urlCrest = null;
        if (cda === "public") {
            urlCrest = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsidCrest}&begin=${currentDateTime.toISOString()}&end=${currentDateTimePlus14Days.toISOString()}&office=MVS`;
        } else if (cda === "internal") {
            urlCrest = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsidCrest}&begin=${currentDateTime.toISOString()}&end=${currentDateTimePlus14Days.toISOString()}&office=MVS`;
        } else {

        }
        // console.log("urlCrest = ", urlCrest);
        fetch(urlCrest, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;version=2'
            }
        })
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // If response is ok, parse it as JSON
                return response.json();
            })
            .then(crest => {
                // console.log("crest:", crest);

                // Check if the crest object and values array exist
                if (!crest || !crest.values) {
                    throw new Error('Crest data or values array is undefined');
                }

                // Convert timestamps in the JSON object
                crest.values.forEach(entry => {
                    entry[0] = formatNWSDate(entry[0]); // Update timestamp
                });

                // console.log("crestFormatted = ", crest);

                // Get the last non-null value from the stage data
                const lastNonNullCrestValue = getLastNonNullValue(crest);
                // console.log("lastNonNullCrestValue:", lastNonNullCrestValue);

                // Check if a non-null value was found
                if (lastNonNullCrestValue !== null) {
                    // Extract timestamp, value, and quality code from the last non-null value
                    var timestampLastCrest = lastNonNullCrestValue.timestamp;
                    var valueLastCrest = parseFloat(lastNonNullCrestValue.value).toFixed(2);
                    var qualityCodeLastCrest = lastNonNullCrestValue.qualityCode;

                    // Log the extracted values
                    // console.log("timestampLastCrest:", timestampLastCrest);
                    // console.log("valueLastCrest:", valueLastCrest);
                    // console.log("qualityCodeLastCrest:", qualityCodeLastCrest);
                } else {
                    // If no non-null value is found, log a message
                    // console.log("No non-null value found.");
                }

                const c_count = calculateCCount(tsidCrest);
                // console.log("c_count:", c_count);

                // Format the last value's timestamp to a string
                const formattedLastCrestValueTimeStamp = formatTimestampToString(timestampLastCrest);
                // console.log("formattedLastCrestValueTimeStamp = ", formattedLastCrestValueTimeStamp);

                // Create a Date object from the timestamp
                const timeStampDateCrestObject = new Date(timestampLastCrest);
                // console.log("timeStampDateCrestObject = ", timeStampDateCrestObject);

                // Determine flood class
                var floodClass = determineStageClass(valueLastCrest, flood_level);
                // console.log("floodClass:", floodClass);

                // Update the innerHTML based on the last crest value
                let innerHTMLCrest;
                if (valueLastCrest === null) {
                    innerHTMLCrest = "<span class='missing'>" + "-M-" + "</span>";
                } else if (valueLastCrest === undefined) {
                    innerHTMLCrest = "<span>" + "" + "</span>";
                } else {
                    innerHTMLCrest = "<span class='" + floodClass + "' title='" + crest.name + ", Value = " + valueLastCrest + ", Date Time = " + timestampLastCrest + "'>" + valueLastCrest + " " + timestampLastCrest.substring(0, 5) + "</span>";
                }
                crestCell.innerHTML = innerHTMLCrest;
            })
            .catch(error => {
                // Catch and log any errors that occur during fetching or processing
                console.error("Error fetching or processing data:", error);
            });
    }
}


/******************************************************************************
 *                          RESERVOIR FETCH FUNCTIONS                         *
 ******************************************************************************/
// Function to get lake level data
function fetchLakeLevel(levelCell, deltaCell, tsidStage, flood_level, top_of_conservation, bottom_of_conservation, top_of_flood, bottom_of_flood, currentDateTimeMinus2Hours, currentDateTime, currentDateTimeMinus30Hours) {
    if (tsidStage !== null) {
        // Fetch the time series data from the API using the determined query string
        let urlStage = null;
        if (cda === "public") {
            urlStage = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsidStage}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else if (cda === "internal") {
            urlStage = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsidStage}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else {

        }
        // console.log("urlStage = ", urlStage);
        fetch(urlStage, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;version=2'
            }
        })
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    // If not, throw an error
                    throw new Error('Network response was not ok');
                }
                // If response is ok, parse it as JSON
                return response.json();
            })
            .then(stage => {
                // console.log("stage:", stage);

                // Convert timestamps in the JSON object
                stage.values.forEach(entry => {
                    entry[0] = formatNWSDate(entry[0]); // Update timestamp
                });

                // console.log("stageFormatted = ", stage);

                // Get the last non-null value from the stage data
                const lastNonNullValue = getLastNonNullValue(stage);
                // console.log("lastNonNullValue:", lastNonNullValue);

                // Check if a non-null value was found
                if (lastNonNullValue !== null) {
                    // Extract timestamp, value, and quality code from the last non-null value
                    var timestampLast = lastNonNullValue.timestamp;
                    var valueLast = parseFloat(lastNonNullValue.value).toFixed(2);
                    var qualityCodeLast = lastNonNullValue.qualityCode;

                    // Log the extracted valueLasts
                    // console.log("timestampLast:", timestampLast);
                    // console.log("valueLast:", valueLast);
                    // console.log("valueLast:", typeof (valueLast));
                    // console.log("qualityCodeLast:", qualityCodeLast);
                } else {
                    // If no non-null valueLast is found, log a message
                    // console.log("No non-null valueLast found.");
                }

                const c_count = calculateCCount(tsidStage);
                // console.log("c_count:", c_count);

                const lastNonNull24HoursValue = getLastNonNull24HoursValue(stage, c_count);
                // console.log("lastNonNull24HoursValue:", lastNonNull24HoursValue);

                // Check if a non-null value was found
                if (lastNonNull24HoursValue !== null) {
                    // Extract timestamp, value, and quality code from the last non-null value
                    var timestamp24HoursLast = lastNonNull24HoursValue.timestamp;
                    var value24HoursLast = parseFloat(lastNonNull24HoursValue.value).toFixed(2);
                    var qualityCode24HoursLast = lastNonNull24HoursValue.qualityCode;

                    // Log the extracted valueLasts
                    // console.log("timestamp24HoursLast:", timestamp24HoursLast);
                    // console.log("value24HoursLast:", value24HoursLast);
                    // console.log("qualityCode24HoursLast:", qualityCode24HoursLast);
                } else {
                    // If no non-null valueLast is found, log a message
                    // console.log("No non-null valueLast found.");
                }

                // Calculate the 24 hours change between first and last value
                const delta_24 = (valueLast - value24HoursLast).toFixed(2);
                // console.log("delta_24:", delta_24);

                // Format the last valueLast's timestampLast to a string
                const formattedLastValueTimeStamp = formatTimestampToString(timestampLast);
                // console.log("formattedLastValueTimeStamp = ", formattedLastValueTimeStamp);

                // Create a Date object from the timestampLast
                const timeStampDateObject = new Date(timestampLast);
                // console.log("timeStampDateObject = ", timeStampDateObject);

                // Subtract 24 hours (24 * 60 * 60 * 1000 milliseconds) from the timestampLast date
                const timeStampDateObjectMinus24Hours = new Date(timestampLast - (24 * 60 * 60 * 1000));
                // console.log("timeStampDateObjectMinus24Hours = ", timeStampDateObjectMinus24Hours);


                // FLOOD CLASS
                var floodClass = determineStageClass(valueLast, flood_level);
                // console.log("floodClass:", floodClass);

                if (valueLast === null) {
                    innerHTMLStage = "<span class='missing'>"
                        + "-M-"
                        + "</span>"
                        + "<span class='--'>"
                        + "label"
                        + "</span>";
                } else {
                    innerHTMLStage = "<span class='" + floodClass + "' title='" + stage.name + ", Value = " + valueLast + ", Date Time = " + timestampLast + "'>"
                        + valueLast
                        + "</span>";

                    innerHTMLDelta = "<span title='" + stage.name + ", Value = " + value24HoursLast + ", Date Time = " + timestamp24HoursLast + ", Delta = (" + valueLast + " - " + value24HoursLast + ") = " + delta_24 + "'>" + delta_24 + "</span>";
                }
                levelCell.innerHTML = innerHTMLStage;
                deltaCell.innerHTML = innerHTMLDelta;
            })
            .catch(error => {
                // Catch and log any errors that occur during fetching or processing
                console.error("Error fetching or processing data:", error);
            });
    }
}

// Function to get lake storage level
function fetchStorageUtilized(conservationCell, floodCell, tsidStorage, flood_level, top_of_conservation, bottom_of_conservation, top_of_flood, bottom_of_flood, currentDateTimeMinus2Hours, currentDateTime, currentDateTimeMinus30Hours) {
    // console.log(top_of_conservation, bottom_of_conservation, top_of_flood, bottom_of_flood);
    if (tsidStorage !== null) {
        // Fetch the time series data from the API using the determined query string
        let urlStorage = null;
        if (cda === "public") {
            urlStorage = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsidStorage}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else if (cda === "internal") {
            urlStorage = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsidStorage}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else {

        }
        // console.log("urlStorage = ", urlStorage);
        fetch(urlStorage, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;version=2'
            }
        })
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    // If not, throw an error
                    throw new Error('Network response was not ok');
                }
                // If response is ok, parse it as JSON
                return response.json();
            })
            .then(stage => {
                // console.log("stage:", stage);

                // Convert timestamps in the JSON object
                stage.values.forEach(entry => {
                    entry[0] = formatNWSDate(entry[0]); // Update timestamp
                });

                // console.log("stageFormatted = ", stage);

                // Get the last non-null value from the stage data
                const lastNonNullValue = getLastNonNullValue(stage);
                // console.log("lastNonNullValue:", lastNonNullValue);

                // Check if a non-null value was found
                if (lastNonNullValue !== null) {
                    // Extract timestamp, value, and quality code from the last non-null value
                    var timestampLast = lastNonNullValue.timestamp;
                    var valueLast = lastNonNullValue.value;
                    var qualityCodeLast = lastNonNullValue.qualityCode;

                    // Log the extracted valueLasts
                    // console.log("timestampLast:", timestampLast);
                    // console.log("valueLast:", valueLast);
                    // console.log("valueLast:", typeof (valueLast));
                    // console.log("qualityCodeLast:", qualityCodeLast);
                } else {
                    // If no non-null valueLast is found, log a message
                    // console.log("No non-null valueLast found.");
                }

                if (valueLast === null) {
                    innerHTMLConservation = "<span class='missing'>" + "-M-" + "</span>"
                } else {
                    // CONSERVATION CALCULATION
                    if (valueLast > 0.0 && top_of_conservation > 0.0 && bottom_of_conservation >= 0.0) {
                        if (valueLast < bottom_of_conservation) {
                            innerHTMLConservation = "<span title='Lake Storage < Bottom of Conservation'>" + "0.0%" + "</span>";
                        } else if (valueLast > top_of_conservation) {
                            innerHTMLConservation = "<span title='" + "Lake Storage > Top of Conservation: " + valueLast.toFixed(0) + " > " + top_of_conservation.toFixed(0) + "'>" + "100.0%" + "</span>";
                        } else {
                            const total = (valueLast - bottom_of_conservation) / (top_of_conservation - bottom_of_conservation) * 100;
                            innerHTMLConservation = "<span title='" + "(" + valueLast.toFixed(0) + " (" + timestampLast + ") " + "(Lake Storage)" + " - " + bottom_of_conservation.toFixed(0) + "(Bottom of Conservation)" + ")/(" + top_of_conservation.toFixed(0) + "(Top of Conservation)" + "-" + bottom_of_conservation.toFixed(0) + "(Bottom of Conservation)" + ")*100" + " = " + total + "'>" + total.toFixed(1) + "%" + "</span>";
                        }
                    } else {
                        innerHTMLConservation = " ";
                    }
                    // Set the combined value to the cell, preserving HTML
                    // console.log("innerHTMLConservation = ", innerHTMLConservation);

                    // FLOOD CALCULATION
                    if (valueLast > 0.0 && top_of_flood > 0.0 && bottom_of_flood >= 0.0) {
                        if (valueLast < bottom_of_flood) {
                            innerHTMLFlood = "<span title='Lake Storage < Bottom of Flood'>" + "0.0%" + "</span>";
                        } else if (valueLast > top_of_flood) {
                            innerHTMLFlood = "<span title='" + "Lake Storage > Top of Flood: " + valueLast.toFixed(0) + " > " + top_of_flood.toFixed(0) + "'>" + "100.0%" + "</span>";
                        } else {
                            const total = ((valueLast) - (bottom_of_flood)) / ((top_of_flood) - (bottom_of_flood)) * 100;
                            innerHTMLFlood = "<span title='" + "(" + valueLast.toFixed(0) + " (" + timestampLast + ") " + "(Lake Storage)" + " - " + bottom_of_flood.toFixed(0) + "(Bottom of Flood)" + ")/(" + top_of_flood.toFixed(0) + "(Top of Flood)" + "-" + bottom_of_flood.toFixed(0) + "(Bottom of Flood)" + ")*100" + " = " + total + "'>" + total.toFixed(1) + "%" + "</span>";
                        }
                    } else {
                        innerHTMLFlood = " ";
                    }
                }
                conservationCell.innerHTML = innerHTMLConservation;
                floodCell.innerHTML = innerHTMLFlood;
            })
            .catch(error => {
                // Catch and log any errors that occur during fetching or processing
                console.error("Error fetching or processing data:", error);
            });
    }
}

// Function to get lake precip data
function fetchLakePrecip(precipCell, tsidPrecip, currentDateTime, currentDateTimeMinus30Hours) {
    if (tsidPrecip !== null) {
        // Fetch the time series data from the API using the determined query string
        let urlPrecip = null;
        if (cda === "public") {
            urlPrecip = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsidPrecip}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else if (cda === "internal") {
            urlPrecip = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsidPrecip}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else {

        }
        // console.log("urlPrecip = ", urlPrecip);
        fetch(urlPrecip, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;version=2'
            }
        })
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    // If not, throw an error
                    throw new Error('Network response was not ok');
                }
                // If response is ok, parse it as JSON
                return response.json();
            })
            .then(precip => {
                // console.log("precip:", precip);

                // Convert timestamps in the JSON object
                precip.values.forEach(entry => {
                    entry[0] = formatNWSDate(entry[0]); // Update timestamp
                });

                // console.log("precipFormatted = ", precip);

                // Get the last non-null value from the precip data
                const lastNonNullValue = getLastNonNullValue(precip);
                // console.log("lastNonNullValue:", lastNonNullValue);

                // Check if a non-null value was found
                if (lastNonNullValue !== null) {
                    // Extract timestamp, value, and quality code from the last non-null value
                    var timestampLast = lastNonNullValue.timestamp;
                    var valueLast = parseFloat(lastNonNullValue.value).toFixed(2);
                    var qualityCodeLast = lastNonNullValue.qualityCode;

                    // Log the extracted valueLasts
                    // console.log("timestampLast:", timestampLast);
                    // console.log("valueLast:", valueLast);
                    // console.log("valueLast:", typeof (valueLast));
                    // console.log("qualityCodeLast:", qualityCodeLast);
                } else {
                    // If no non-null valueLast is found, log a message
                    // console.log("No non-null valueLast found.");
                }

                const c_count = calculateCCount(tsidPrecip);
                // console.log("c_count:", c_count);

                // Format the last valueLast's timestampLast to a string
                const formattedLastValueTimeStamp = formatTimestampToString(timestampLast);
                // console.log("formattedLastValueTimeStamp = ", formattedLastValueTimeStamp);

                // Create a Date object from the timestampLast
                const timeStampDateObject = new Date(timestampLast);
                // console.log("timeStampDateObject = ", timeStampDateObject);

                // Subtract 24 hours (24 * 60 * 60 * 1000 milliseconds) from the timestampLast date
                const timeStampDateObjectMinus24Hours = new Date(timestampLast - (24 * 60 * 60 * 1000));
                // console.log("timeStampDateObjectMinus24Hours = ", timeStampDateObjectMinus24Hours);


                if (valueLast === null) {
                    innerHTMLPrecip = "<span class='missing'>"
                        + "-M-"
                        + "</span>"
                        + "<span class='--'>"
                        + "label"
                        + "</span>";
                } else {
                    innerHTMLPrecip = "<span title='" + precip.name + ", Value = " + valueLast + ", Date Time = " + timestampLast + "'>"
                        + valueLast
                        + "</span>";
                }
                precipCell.innerHTML = innerHTMLPrecip;
            })
            .catch(error => {
                // Catch and log any errors that occur during fetching or processing
                console.error("Error fetching or processing data:", error);
            });
    }
}

// Function to get lake inflow data
function fetchLakeInflow(inflowCell, tsidInflow, currentDateTime, currentDateTimeMinus30Hours) {
    if (tsidInflow !== null) {
        // Fetch the time series data from the API using the determined query string
        let urlInflow = null;
        if (cda === "public") {
            urlInflow = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsidInflow}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else if (cda === "internal") {
            urlInflow = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsidInflow}&begin=${currentDateTimeMinus30Hours.toISOString()}&end=${currentDateTime.toISOString()}&office=MVS`;
        } else {

        }
        // console.log("urlInflow = ", urlInflow);
        fetch(urlInflow, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;version=2'
            }
        })
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    // If not, throw an error
                    throw new Error('Network response was not ok');
                }
                // If response is ok, parse it as JSON
                return response.json();
            })
            .then(inflow => {
                // console.log("inflow:", inflow);

                // Convert timestamps in the JSON object
                inflow.values.forEach(entry => {
                    entry[0] = formatNWSDate(entry[0]); // Update timestamp
                });

                // console.log("inflowFormatted = ", inflow);

                // Get the last non-null value from the inflow data
                const lastNonNullValue = getLastNonNullValue(inflow);
                // console.log("lastNonNullValue:", lastNonNullValue);

                // Check if a non-null value was found
                if (lastNonNullValue !== null) {
                    // Extract timestamp, value, and quality code from the last non-null value
                    var timestampLast = lastNonNullValue.timestamp;
                    var valueLast = parseFloat(lastNonNullValue.value).toFixed(0);
                    var qualityCodeLast = lastNonNullValue.qualityCode;

                    // Log the extracted valueLasts
                    // console.log("timestampLast:", timestampLast);
                    // console.log("valueLast:", valueLast);
                    // console.log("valueLast:", typeof (valueLast));
                    // console.log("qualityCodeLast:", qualityCodeLast);
                } else {
                    // If no non-null valueLast is found, log a message
                    // console.log("No non-null valueLast found.");
                }

                const c_count = calculateCCount(tsidInflow);
                // console.log("c_count:", c_count);

                // Format the last valueLast's timestampLast to a string
                const formattedLastValueTimeStamp = formatTimestampToString(timestampLast);
                // console.log("formattedLastValueTimeStamp = ", formattedLastValueTimeStamp);

                // Create a Date object from the timestampLast
                const timeStampDateObject = new Date(timestampLast);
                // console.log("timeStampDateObject = ", timeStampDateObject);

                // Subtract 24 hours (24 * 60 * 60 * 1000 milliseconds) from the timestampLast date
                const timeStampDateObjectMinus24Hours = new Date(timestampLast - (24 * 60 * 60 * 1000));
                // console.log("timeStampDateObjectMinus24Hours = ", timeStampDateObjectMinus24Hours);


                if (valueLast === null) {
                    innerHTMLInflow = "<span class='missing'>"
                        + "-M-"
                        + "</span>"
                        + "<span class='--'>"
                        + "label"
                        + "</span>";
                } else {
                    innerHTMLInflow = "<span title='" + inflow.name + ", Value = " + valueLast + ", Date Time = " + timestampLast + "'>"
                        + valueLast
                        + "</span>";
                }
                inflowCell.innerHTML = innerHTMLInflow;
            })
            .catch(error => {
                // Catch and log any errors that occur during fetching or processing
                console.error("Error fetching or processing data:", error);
            });
    }
}

// Function to get lake storage data
function fetchLakeOutflow(midnightCell, eveningCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const outflowToSend = {
        location_id: encodeURIComponent(location_id),
    };
    // console.log("outflowToSend: " + outflowToSend);

    // Convert the object into a query string
    const outflowQueryString = Object.keys(outflowToSend).map(key => key + '=' + outflowToSend[key]).join('&');
    // console.log("outflowQueryString: " + outflowQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var urlOutflow = `get_outflow.php?${outflowQueryString}`;
    // console.log("urlOutflow: ", + urlOutflow);
    fetch(urlOutflow)
        .then(response => response.json())
        .then(outflow => {
            // Log the stage to the console
            // console.log("outflow: ", outflow);

            // Bankfull Limit Class
            if (parseFloat(outflow.midnight) > parseFloat(outflow.bankfull)) {
                // console.log("Flow Above Bankfull Limit");
                var myBankfullFlowLimitClass = "Bankfull_Limit";
            } else {
                // console.log("Flow Below Bankfull Limit");
                var myBankfullFlowLimitClass = "--";
            }

            // MIDNIGHT
            outflowCellInnerHTML = "<span class='" + myBankfullFlowLimitClass + "' title='" + outflow.project_id + " " + outflow.midnight_date_time + " (lake_gate table) " + "'>" + parseFloat(outflow.midnight).toFixed(0) + "</span>";
            // Set the combined value to the cell, preserving HTML
            // console.log("outflowCellInnerHTML = ", outflowCellInnerHTML);
            // Set the HTML inside the cell once the fetch is complete
            midnightCell.innerHTML = outflowCellInnerHTML;


            // Bankfull Limit Class
            if (parseFloat(outflow.evening) > parseFloat(outflow.bankfull)) {
                // console.log("Flow Above Bankfull Limit");
                var myBankfullFlowLimitClass = "Bankfull_Limit";
            } else {
                // console.log("Flow Below Bankfull Limit");
                var myBankfullFlowLimitClass = "--";
            }

            // EVENING
            controlledOutflowEveningCellInnerHTML = "<span class='" + myBankfullFlowLimitClass + "' title='" + outflow.project_id + " " + outflow.evening_date_time + " (lake_gate table except for MarkTwain use lake qlev_fcst table) " + "'>" + parseFloat(outflow.evening).toFixed(0) + "</span>";
            // Set the combined value to the cell, preserving HTML
            // console.log("controlledOutflowEveningCellInnerHTML = ", controlledOutflowEveningCellInnerHTML);
            // Set the HTML inside the cell once the fetch is complete
            eveningCell.innerHTML = controlledOutflowEveningCellInnerHTML;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to get lake rule curve data
function fetchLakeSeasonalRuleCurve(seasonalRuleCurveCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const ruleCurveToSend = {
        location_id: encodeURIComponent(location_id),
    };
    // console.log("ruleCurveToSend: " + ruleCurveToSend);

    // Convert the object into a query string
    const rule_curveQueryString = Object.keys(ruleCurveToSend).map(key => key + '=' + ruleCurveToSend[key]).join('&');
    // console.log("rule_curveQueryString: " + rule_curveQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var urlRuleCurve = `get_rule_curve.php?${rule_curveQueryString}`;
    // console.log("urlRuleCurve: ", + urlRuleCurve);
    fetch(urlRuleCurve)
        .then(response => response.json())
        .then(rule_curve => {
            // Log the stage to the console
            // console.log("rule_curve: ", rule_curve);
            // Extract lower and upper flow limits
            const rule_curve_spec = parseFloat(rule_curve[0].lev);
            const rule_curve_table = parseFloat(rule_curve[1].lev);
            // console.log("rule_curve_spec: " + rule_curve_spec);
            // console.log("rule_curve_table: " + rule_curve_table);
            if (rule_curve_spec === rule_curve_table) {
                ruleCurveCellInnerHTML = "<span title='" + rule_curve[0].project_id + " (lake rule_curve_spec table) " + "Rule Curve Inst: " + parseFloat(rule_curve[1].lev).toFixed(2) + "'>" + parseFloat(rule_curve_spec).toFixed(2) + "</span>";
            } else {
                ruleCurveCellInnerHTML = "<span title='" + rule_curve[0].project_id + " (lake rule_curve_spec table) " + "Rule Curve Inst: " + parseFloat(rule_curve[1].lev).toFixed(2) + "'>" + parseFloat(rule_curve_spec).toFixed(2) + "</span>";
            }
            // Set the combined value to the cell, preserving HTML
            // console.log("ruleCurveCellInnerHTML = ", ruleCurveCellInnerHTML);
            // Set the HTML inside the cell once the fetch is complete
            seasonalRuleCurveCell.innerHTML = ruleCurveCellInnerHTML;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to get lake crest data
function fetchCrestForecast(crestCell, crestDateCell, location_id) {
    // Create an object to hold all the properties you want to pass
    const poolForecastCrestToSend = {
        location_id: encodeURIComponent(location_id),
    };
    // console.log("poolForecastCrestToSend: " + poolForecastCrestToSend);

    // Convert the object into a query string
    const poolForecastCrestQueryString = Object.keys(poolForecastCrestToSend).map(key => key + '=' + poolForecastCrestToSend[key]).join('&');
    // console.log("poolForecastCrestQueryString: " + poolForecastCrestQueryString);

    // Make an AJAX request to the PHP script, passing all the variables
    var urlPoolForecastCrest = `get_crest_forecast.php?${poolForecastCrestQueryString}`;
    // console.log("urlPoolForecastCrest: " + urlPoolForecastCrest);
    fetch(urlPoolForecastCrest)
        .then(response => response.json())
        .then(pool_forecast_crest => {
            // Log the stage to the console
            // console.log("pool_forecast_crest: ", pool_forecast_crest);
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
                    crestDataDate = "--";
                } else if (pool_forecast_crest.opt === "CD") {
                    crestDataDate = "--";
                } else if (pool_forecast_crest.opt === "<") {
                    let crst_date = pool_forecast_crest.crst_dt;
                    // console.log("crst_date: ", crst_date);
                    // console.log("crst_date: ", typeof crst_date);
                    crestDataDate = crst_date.slice(0, 5);
                } else if (pool_forecast_crest.crest !== null) {
                    let crst_date = pool_forecast_crest.crst_dt;
                    // console.log("crst_date: ", crst_date);
                    // console.log("crst_date: ", typeof crst_date);
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


/******************************************************************************
 *                               SUPPORT FUNCTIONS                            *
 ******************************************************************************/
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
    // console.log("stage_date_time_cst = ", stage_date_time_cst);
    var stage_date_time_cst_formatted = formatDateTime(stage_date_time_cst);
    // console.log("stage_date_time_cst_formatted", stage_date_time_cst_formatted);
    return stage_date_time_cst_formatted;
}

// Function determine last max class
function determineStageClass(stage_value, flood_value) {
    // console.log("determineStageClass = ", stage_value + typeof (stage_value) + " " + flood_value + typeof (flood_value));
    var myStageClass;
    if (parseFloat(stage_value) >= parseFloat(flood_value)) {
        // console.log("determineStageClass = ", stage_value + " >= " + flood_value);
        myStageClass = "last_max_value_flood";
    } else {
        // console.log("Stage Below Flood Level");
        myStageClass = "last_max_value";
    }
    return myStageClass;
}

// Function determine date time class
function determineStageDateTimeClass(stage29_date_time_cst_formatted, currentDateTimeMinusHours) {
    var myStage29DateTimeClass;
    if (stage29_date_time_cst_formatted >= currentDateTimeMinusHours) {
        myStage29DateTimeClass = "date_time_current";
        // console.log("on_time = ", stage29_date_time_cst_formatted);
    } else {
        myStage29DateTimeClass = "date_time_late";
        // console.log("late = ", stage29_date_time_cst_formatted);
    }
    // console.log("myStage29DateTimeClass = ", myStage29DateTimeClass);
    return myStage29DateTimeClass;
}


/******************************************************************************
 *                               SUPPORT CDA FUNCTIONS                        *
 ******************************************************************************/
// Function to get the first non-null value from values array
function getFirstNonNullValue(data) {
    // Iterate over the values array
    for (let i = 0; i < data.values.length; i++) {
        // Check if the value at index i is not null
        if (data.values[i][1] !== null) {
            // Return the non-null value as separate variables
            return {
                timestamp: data.values[i][0],
                value: data.values[i][1],
                qualityCode: data.values[i][2]
            };
        }
    }
    // If no non-null value is found, return null
    return null;
}

// Function to get the last non null value from values array
function getLastNonNullValue(data) {
    // Iterate over the values array in reverse
    for (let i = data.values.length - 1; i >= 0; i--) {
        // Check if the value at index i is not null
        if (data.values[i][1] !== null) {
            // Return the non-null value as separate variables
            return {
                timestamp: data.values[i][0],
                value: data.values[i][1],
                qualityCode: data.values[i][2]
            };
        }
    }
    // If no non-null value is found, return null
    return null;
}

// Find time series value at 24 hours ago
function getLastNonNull24HoursValue(data, c_count) {
    let nonNullCount = 0;
    for (let i = data.values.length - 1; i >= 0; i--) {
        if (data.values[i][1] !== null) {
            nonNullCount++;
            if (nonNullCount > c_count) {
                return {
                    timestamp: data.values[i][0],
                    value: data.values[i][1],
                    qualityCode: data.values[i][2]
                };
            }
        }
    }
    return null;
}

// Function to convert timestamp to specified format
function formatNWSDate(timestamp) {
    const date = new Date(timestamp);
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month
    const dd = String(date.getDate()).padStart(2, '0'); // Day
    const yyyy = date.getFullYear(); // Year
    const hh = String(date.getHours()).padStart(2, '0'); // Hours
    const min = String(date.getMinutes()).padStart(2, '0'); // Minutes
    return `${mm}-${dd}-${yyyy} ${hh}:${min}`;
}

// Function to find the c_count for each interval id
function calculateCCount(tsid) {
    // Split the string at the period
    const splitString = tsid.split('.');

    // Access the fifth element
    const forthElement = splitString[3];
    // console.log("forthElement = ", forthElement);

    // Initialize c_count variable
    let c_count;

    // Set c_count based on the value of firstTwoCharacters
    switch (forthElement) {
        case "15Minutes":
            c_count = 96;
            break;
        case "10Minutes":
            c_count = 144;
            break;
        case "30Minutes":
            c_count = 48;
            break;
        case "1Hour":
            c_count = 24;
            break;
        case "6Hours":
            c_count = 4;
            break;
        case "~2Hours":
            c_count = 12;
            break;
        case "5Minutes":
            c_count = 288;
            break;
        case "~1Day":
            c_count = 1;
            break;
        default:
            // Default value if forthElement doesn't match any case
            c_count = 0;
    }

    return c_count;
}

// Function to convert cda date time to mm-dd-yyyy 24hh:mi
function formatTimestampToString(timestampLast) {
    const date = new Date(timestampLast);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return formattedDate;
}

// Convert date time object to ISO format for CDA
function generateDateTimeStrings(currentDateTime, currentDateTimePlus4Days) {
    // Convert current date and time to ISO string
    const currentDateTimeISO = currentDateTime.toISOString();
    // Extract the first 10 characters from the ISO string
    const first10CharactersDateTimeISO = currentDateTimeISO.substring(0, 10);

    // Get midnight in the Central Time zone
    const midnightCentral = new Date(currentDateTime.toLocaleDateString('en-US', { timeZone: 'America/Chicago' }));
    midnightCentral.setHours(0, 0, 0, 0); // Set time to midnight

    // Convert midnight to ISO string
    const midnightCentralISO = midnightCentral.toISOString();

    // Append midnight central time to the first 10 characters of currentDateTimeISO
    const currentDateTimeMidNightISO = first10CharactersDateTimeISO + midnightCentralISO.substring(10);

    // Convert currentDateTimePlus4Days to ISO string
    const currentDateTimePlus4DaysISO = currentDateTimePlus4Days.toISOString();
    // Extract the first 10 characters from the ISO string of currentDateTimePlus4Days
    const first10CharactersDateTimePlus4DaysISO = currentDateTimePlus4DaysISO.substring(0, 10);

    // Append midnight central time to the first 10 characters of currentDateTimePlus4DaysISO
    const currentDateTimePlus4DaysMidNightISO = first10CharactersDateTimePlus4DaysISO + midnightCentralISO.substring(10);

    return {
        currentDateTimeMidNightISO,
        currentDateTimePlus4DaysMidNightISO
    };
}

// Function to extract values where time ends in "13:00"
function extractValuesWithTimeNoon(values) {
    return values.filter(entry => {
        const timestamp = new Date(entry[0]);
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        return (hours === 7 || hours === 6) && minutes === 0; // Check if time is 13:00
    });
}


/******************************************************************************
 *                               FUNCTIONS PHP JSON                           *
 ******************************************************************************/
// Function to fetch R output for lake table
async function fetchDataFromROutput() {
    let urlR = null;
    if (cda === "public") {
        urlR = '../../../php_data_api/public/json/outputR.json';
    } else if (cda === "internal") {
        urlR = 'https://wm.mvs.ds.usace.army.mil/web_apps/board/public/outputR.json';
    } else {

    }
    // console.log("urlR: ", urlR);

    try {
        const response = await fetch(urlR);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagate the error further if needed
    }
}

// Function to filter ROutput data by location_id
function filterDataByLocationId(ROutput, location_id) {
    const filteredData = {};

    for (const key in ROutput) {
        if (ROutput.hasOwnProperty(key) && key === location_id) {
            filteredData[key] = ROutput[key];
            break; // Since location_id should be unique, we can break early
        }
    }

    return filteredData;
}

// Function to fetch and log ROutput data
async function fetchAndLogFlowData(location_id, midnightCell, eveningCell, seasonalRuleCurveCell, crestCell, crestDateCell) {
    try {
        const ROutput = await fetchDataFromROutput();
        // console.log('ROutput:', ROutput);

        const filteredData = filterDataByLocationId(ROutput, location_id);
        // console.log("Filtered Data for", location_id + ":", filteredData);

        // Update the HTML element with filtered data
        updateFlowMidnightHTML(filteredData, midnightCell);

        // Update the HTML element with filtered data
        updateFlowEveningHTML(filteredData, eveningCell);

        // Update the HTML element with filtered data
        updateRuleCurveHTML(filteredData, seasonalRuleCurveCell);

        // Update the HTML element with filtered data
        updateLakeCrestHTML(filteredData, crestCell);

        // Update the HTML element with filtered data
        updateLakeCrestDateHTML(filteredData, crestDateCell);

        // Further processing of ROutput data as needed
    } catch (error) {
        // Handle errors from fetchDataFromROutput
        console.error('Failed to fetch data:', error);
    }
}

// Function to update the HTML element with filtered data
function updateFlowMidnightHTML(filteredData, midnightCell) {
    const locationData = filteredData[Object.keys(filteredData)[0]]; // Get the first (and only) key's data
    midnightCell.innerHTML = `<div class="hard_coded_php" title="Uses PHP Json Output, No Cloud Option to Access Custom Schema Yet">${locationData.outflow_midnight}</div>`;
}

// Function to update the HTML element with filtered data
function updateFlowEveningHTML(filteredData, eveningCell) {
    const locationData = filteredData[Object.keys(filteredData)[0]]; // Get the first (and only) key's data
    eveningCell.innerHTML = `<div class="hard_coded_php" title="Uses PHP Json Output, No Cloud Option to Access Custom Schema Yet">${locationData.outflow_evening}</div>`;
}

// Function to update the HTML element with filtered data
function updateRuleCurveHTML(filteredData, seasonalRuleCurveCell) {
    const locationData = filteredData[Object.keys(filteredData)[0]]; // Get the first (and only) key's data
    seasonalRuleCurveCell.innerHTML = `<div class="hard_coded_php" title="Uses PHP Json Output, No Cloud Option to Access Custom Schema Yet">${(parseFloat(locationData.rule_curve)).toFixed(2)}</div>`;
}

// Function to update the HTML element with filtered data
function updateLakeCrestHTML(filteredData, crestCell) {
    const locationData = filteredData[Object.keys(filteredData)[0]]; // Get the first (and only) key's data
    if (locationData.crest) {
        crestCell.innerHTML = `<div class="hard_coded_php" title="Uses PHP Json Output, No Cloud Option to Access Custom Schema Yet">${locationData.crest}</div>`;
    } else {
        crestCell.innerHTML = `<div class="hard_coded_php" title="Uses PHP Json Output, No Cloud Option to Access Custom Schema Yet"></div>`;
    }
}

// Function to update the HTML element with filtered data
function updateLakeCrestDateHTML(filteredData, crestDateCell) {
    const locationData = filteredData[Object.keys(filteredData)[0]]; // Get the first (and only) key's data
    if (locationData.crest) {
        crestDateCell.innerHTML = `<div class="hard_coded_php" title="Uses PHP Json Output, No Cloud Option to Access Custom Schema Yet">${locationData.crest_date_time}</div>`;
    } else {
        crestDateCell.innerHTML = `<div class="hard_coded_php" title="Uses PHP Json Output, No Cloud Option to Access Custom Schema Yet"></div>`;
    }
}

// Function to fetch exportNwsForecasts2Json.json
async function fetchDataFromNwsForecastsOutput() {
    let urlNwsForecast = null;
    if (cda === "public") {
        urlNwsForecast = '../../../php_data_api/public/json/exportNwsForecasts2Json.json';
    } else if (cda === "internal") {
        urlNwsForecast = '../../../php_data_api/public/json/exportNwsForecasts2Json.json';
    } else {

    }
    // console.log("urlNwsForecast: ", urlNwsForecast);

    try {
        const response = await fetch(urlNwsForecast);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagate the error further if needed
    }
}

// Function to filter ROutput data by tsid_stage_nws_3_day_forecast
function filterDataByTsid(NwsOutput, cwms_ts_id) {
    const filteredData = NwsOutput.filter(item => {
        return item !== null && item.cwms_ts_id_day1 === cwms_ts_id;
    });

    return filteredData;
}

// Function to fetch and log NwsOutput data
async function fetchAndLogNwsData(tsid_stage_nws_3_day_forecast, forecastTimeCell) {
    try {
        const NwsOutput = await fetchDataFromNwsForecastsOutput();
        // console.log('NwsOutput:', NwsOutput);

        const filteredData = filterDataByTsid(NwsOutput, tsid_stage_nws_3_day_forecast);
        // console.log("Filtered NwsOutput Data for", tsid_stage_nws_3_day_forecast + ":", filteredData);

        // Update the HTML element with filtered data
        updateNwsForecastTimeHTML(filteredData, forecastTimeCell);

        // Further processing of ROutput data as needed
    } catch (error) {
        // Handle errors from fetchDataFromROutput
        console.error('Failed to fetch data:', error);
    }
}

// Function to update the HTML element with filtered data
function updateNwsForecastTimeHTML(filteredData, forecastTimeCell) {
    const locationData = filteredData.find(item => item !== null); // Find the first non-null item
    if (!locationData) {
        forecastTimeCell.innerHTML = ''; // Handle case where no valid data is found
        return;
    }

    const entryDate = locationData.data_entry_date_cst1;

    // Parse the entry date string
    const dateParts = entryDate.split('-'); // Split by hyphen
    const day = dateParts[0]; // Day part
    const monthAbbreviation = dateParts[1]; // Month abbreviation (e.g., JUL)
    const year = dateParts[2].substring(0, 2); // Last two digits of the year (e.g., 24)

    // Map month abbreviation to month number
    const months = {
        'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
        'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
        'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    };

    const month = months[monthAbbreviation]; // Get numeric month

    // Parse time parts
    const timeParts = entryDate.split(' ')[1].split('.'); // Split time part by period
    const hours = timeParts[0]; // Hours part
    const minutes = timeParts[1]; // Minutes part

    // Determine period (AM/PM)
    const period = timeParts[3] === 'PM' ? 'PM' : 'AM';

    // Construct formatted date and time
    const formattedDateTime = `${month}-${day}-${year} ${hours}:${minutes} ${period}`;

    // Update the HTML content
    forecastTimeCell.innerHTML = `<div class="hard_coded_php" title="Uses PHP exportNwsForecasts2Json.json Output, No Cloud Option Yet">${formattedDateTime}</div>`;
}