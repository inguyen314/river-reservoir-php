if (type === null) { // River Reservoir
    var allData = [];

    document.addEventListener('DOMContentLoaded', async function () {
        // Display the loading_alarm_mvs indicator
        const loadingIndicator = document.getElementById('loading_river_reservoir');
        loadingIndicator.style.display = 'block';

        // Gage control json file
        let jsonFileURL = null;
        if (cda === "public") {
            jsonFileURL = '../../../php_data_api/public/json/gage_control.json';
        } else if (cda === "internal") {
            jsonFileURL = '../../../php_data_api/public/json/gage_control.json';
        }
        // console.log('jsonFileURL: ', jsonFileURL);

        const response = await fetch(jsonFileURL);
        // console.log('response: ', response);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const basins = await response.json();

        // Check if data_items array is present in the data
        // console.log('basins: ', basins);

        // Remove basins that you dont need
        const basinsToRemove = ["Castor"];
        //const basinsToRemove = ["Castor", "Salt", "St Francis"]; 

        const filteredBasins = basins.filter(basin => !basinsToRemove.includes(basin.basin));
        // console.log("filteredBasins: ", filteredBasins);

        // Define a custom order array
        const customOrder = ["Salt", "Mississippi", "Illinois", "Cuivre", "Missouri", "Meramec", "Ohio", "Kaskaskia", "Big Muddy", "St Francis"];

        // Sort the array by the custom order
        filteredBasins.sort((a, b) => customOrder.indexOf(a.basin) - customOrder.indexOf(b.basin));
        // console.log('filteredBasins: ', filteredBasins);

        // to basinData
        const basinData = filteredBasins;

        // Combine all secondDataArray into one object based on name
        const combinedFirstData = [];
        const combinedSecondData = [];
        // // const combinedThirdData = [];
        const combinedForthData = [];
        const combinedFifthData = [];
        const combinedSixthData = [];
        const combinedSeventhData = [];
        const combinedEighthData = [];
        const combinedNinethData = [];
        const combinedTenthData = [];

        // Array to store all promises from API requests
        const apiPromises = [];

        // Check if basinData is an array and has elements
        if (Array.isArray(basinData) && basinData.length > 0) {
            // Iterate through each basin in basinData
            basinData.forEach(basin => {
                // console.log('Processing basin:', basin);

                // Check if basin has gages and gages is an array
                if (Array.isArray(basin.gages) && basin.gages.length > 0) {
                    // Iterate through each gage in the current basin's gages
                    basin.gages.forEach(locData => {
                        // Prepare variable to pass in when call api
                        const locationId = locData.location_id;
                        // console.log('locationId: ', locationId);

                        const visible = locData.visible;
                        // console.log('visible: ', visible);

                        // Location level "Flood"
                        const levelIdFlood = locData.level_id_flood;
                        const levelIdEffectiveDateFlood = locData.level_id_effective_date_flood;
                        const levelIdUnitIdFlood = locData.level_id_unit_id_flood;

                        // Location level "NGVD29"
                        const levelIdNgvd29 = locData.level_id_ngvd29;
                        const levelIdEffectiveDateNgvd29 = locData.level_id_effective_date_ngvd29;
                        const levelIdUnitIdNgvd29 = locData.level_id_unit_id_ngvd29;

                        // Location level "Record Stage"
                        const levelIdRecordStage = locData.level_id_record_stage;
                        const levelIdEffectiveDateRecordStage = locData.level_id_effective_date_record_stage;
                        const levelIdUnitIdRecordStage = locData.level_id_unit_id_record_stage;

                        // Location level "Top of Flood"
                        const levelIdTopOfFlood = locData.level_id_top_of_flood;
                        const levelIdEffectiveDateTopOfFlood = locData.level_id_effective_date_top_of_flood;
                        const levelIdUnitIdTopOfFlood = locData.level_id_unit_id_top_of_flood;

                        // Location level "Top of Conservation"
                        const levelIdTopOfConservation = locData.level_id_top_of_conservation;
                        const levelIdEffectiveDateTopOfConservation = locData.level_id_effective_date_top_of_conservation;
                        const levelIdUnitIdTopOfConservation = locData.level_id_unit_id_top_of_conservation;

                        // Location level "Bottom of Flood"
                        const levelIdBottomOfFlood = locData.level_id_bottom_of_flood;
                        const levelIdEffectiveDateBottomOfFlood = locData.level_id_effective_date_bottom_of_flood;
                        const levelIdUnitIdBottomOfFlood = locData.level_id_unit_id_bottom_of_flood;

                        // Location level "Bottom of Conservation"
                        const levelIdBottomOfConservation = locData.level_id_bottom_of_conservation;
                        const levelIdEffectiveDateBottomOfConservation = locData.level_id_effective_date_bottom_of_conservation;
                        const levelIdUnitIdBottomOfConservation = locData.level_id_unit_id_bottom_of_conservation;

                        // ======================================================================= // 
                        // ========================== START CDA CALL ============================= // 
                        // ======================================================================= //
                        // Construct the URL for the API first request - metadata
                        let firstApiUrl = null;
                        if (cda === "public") {
                            firstApiUrl = `https://water.usace.army.mil/cwms-data/locations/${locationId}?office=MVS`;
                        } else if (cda === "internal") {
                            firstApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/locations/${locationId}?office=MVS`;
                        } else {
                            firstApiUrl = null;
                        }
                        // console.log('firstApiUrl: ', firstApiUrl);

                        // Push the fetch promise to the apiPromises array
                        apiPromises.push(fetch(firstApiUrl)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(firstData => {
                                // Process the response firstData as needed
                                // console.log('firstData :', firstData);
                                combinedFirstData.push(firstData);
                            })
                        );

                        // Construct the URL for the API second request - flood
                        if (levelIdFlood !== null && levelIdFlood !== undefined &&
                            levelIdEffectiveDateFlood !== null && levelIdEffectiveDateFlood !== undefined &&
                            levelIdUnitIdFlood !== null && levelIdUnitIdFlood !== undefined &&
                            visible !== false) {
                            let secondApiUrl = null;
                            if (cda === "public") {
                                secondApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdFlood}?office=MVS&effective-date=${levelIdEffectiveDateFlood}&unit=${levelIdUnitIdFlood}`;
                            } else if (cda === "internal") {
                                secondApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdFlood}?office=MVS&effective-date=${levelIdEffectiveDateFlood}&unit=${levelIdUnitIdFlood}`;
                            } else {
                                secondApiUrl = null;
                            }
                            // console.log('secondApiUrl: ', secondApiUrl);

                            apiPromises.push(
                                fetch(secondApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(secondData => {
                                        // Check if secondData is null
                                        if (secondData === null) {
                                            // Handle the case when secondData is null
                                            // console.log('secondData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('secondData:', secondData);
                                            combinedSecondData.push(secondData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            )
                        }

                        // // Construct the URL for the API third request - basin
                        // let thirdApiUrl = null;
                        // if (cda === "public") {
                        //     thirdApiUrl = `https://water.usace.army.mil/cwms-data/location/group/${selectedBasin}?office=MVS&category-id=RDL_Basins`;
                        // } else {
                        //     thirdApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/location/group/${selectedBasin}?office=MVS&category-id=RDL_Basins`;
                        // }
                        // console.log('thirdApiUrl: ', thirdApiUrl);

                        // // Push the fetch promise to the apiPromises array
                        // apiPromises.push(
                        //     fetch(thirdApiUrl)
                        //     .then(response => {
                        //         // Check if the network response is successful
                        //         if (!response.ok) {
                        //             throw new Error('Network response was not ok');
                        //         }
                        //         return response.json();
                        //     })
                        //     .then(thirdData => {
                        //         // Check if thirdData is null
                        //         if (thirdData === null) {
                        //             console.log('thirdData is null');
                        //             // Handle the case when thirdData is null (optional)
                        //         } else {
                        //             // Process the response from another API as needed
                        //             console.log('thirdData:', thirdData);

                        //             // Filter the assigned locations array to find the desired location
                        //             const foundThirdLocation = thirdData["assigned-locations"].find(location => location["location-id"] === locationId);

                        //             // Extract thirdData if the location is found
                        //             let extractedThirdData = null;
                        //             if (foundThirdLocation) {
                        //                 extractedThirdData = {
                        //                     "office-id": thirdData["office-id"],
                        //                     "id": thirdData["id"],
                        //                     "location-id": foundThirdLocation["location-id"]
                        //                 };
                        //             }
                        //             console.log("extractedThirdData", extractedThirdData);

                        //             // Push the extracted thirdData to the combinedThirdData array
                        //             combinedThirdData.push(extractedThirdData);
                        //         }
                        //     })
                        // );


                        // Construct the URL for the API forth request - owner
                        let forthApiUrl = null;
                        if (cda === "public") {
                            forthApiUrl = `https://water.usace.army.mil/cwms-data/location/group/MVS?office=MVS&category-id=RDL_MVS`;
                        } else if (cda === "internal") {
                            forthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/location/group/MVS?office=MVS&category-id=RDL_MVS`;
                        } else {
                            forthApiUrl = null;
                        }
                        // console.log('forthApiUrl: ', forthApiUrl);

                        // Push the fetch promise to the apiPromises array
                        apiPromises.push(
                            fetch(forthApiUrl)
                                .then(response => {
                                    // Check if the network response is successful
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(forthData => {
                                    // Check if forthData is null
                                    if (forthData === null) {
                                        // console.log('forthData is null');
                                        // Handle the case when forthData is null (optional)
                                    } else {
                                        // Process the response from another API as needed
                                        // console.log('forthData:', forthData);

                                        // Filter the assigned locations array to find the desired location
                                        const foundForthLocation = forthData["assigned-locations"].find(location => location["location-id"] === locationId);

                                        // Extract forthData if the location is found
                                        let extractedForthData = null;
                                        if (foundForthLocation) {
                                            extractedForthData = {
                                                "office-id": forthData["office-id"],
                                                "id": forthData["id"],
                                                "location-id": foundForthLocation["location-id"]
                                            };
                                        }
                                        // console.log("extractedForthData", extractedForthData);

                                        // Push the extracted forthData to the combinedForthData array
                                        combinedForthData.push(extractedForthData);
                                        // console.log('combinedForthData:', combinedForthData);
                                    }
                                })
                        );

                        // Construct the URL for the API fifth request - Record Stage
                        if (levelIdRecordStage !== null && levelIdRecordStage !== undefined &&
                            levelIdEffectiveDateRecordStage !== null && levelIdEffectiveDateRecordStage !== undefined &&
                            levelIdUnitIdRecordStage !== null && levelIdUnitIdRecordStage !== undefined &&
                            visible !== false) {
                            let fifthApiUrl = null;
                            if (cda === "public") {
                                fifthApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdRecordStage}?office=MVS&effective-date=${levelIdEffectiveDateRecordStage}&unit=${levelIdUnitIdRecordStage}`;
                            } else if (cda === "internal") {
                                fifthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdRecordStage}?office=MVS&effective-date=${levelIdEffectiveDateRecordStage}&unit=${levelIdUnitIdRecordStage}`;
                            } else {
                                fifthApiUrl = null;
                            }
                            // console.log('fifthApiUrl: ', fifthApiUrl);

                            apiPromises.push(
                                fetch(fifthApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(fifthData => {
                                        // Check if fifthData is null
                                        if (fifthData === null) {
                                            // Handle the case when fifthData is null
                                            // console.log('fifthData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('fifthData:', fifthData);
                                            combinedFifthData.push(fifthData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        if (error.name === 'AbortError') {
                                            console.error('The fetch operation was aborted.');
                                        } else {
                                            console.error('Error fetching or processing data:', error);
                                        }
                                    })
                            )
                        }

                        // Construct the URL for the API sixth request - Record Stage
                        if (levelIdNgvd29 !== null && levelIdNgvd29 !== undefined &&
                            levelIdEffectiveDateNgvd29 !== null && levelIdEffectiveDateNgvd29 !== undefined &&
                            levelIdUnitIdNgvd29 !== null && levelIdUnitIdNgvd29 !== undefined &&
                            visible !== false) {
                            let sixthApiUrl = null;
                            if (cda === "public") {
                                sixthApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdNgvd29}?office=MVS&effective-date=${levelIdEffectiveDateNgvd29}&unit=${levelIdUnitIdNgvd29}`;
                            } else if (cda === "internal") {
                                sixthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdNgvd29}?office=MVS&effective-date=${levelIdEffectiveDateNgvd29}&unit=${levelIdUnitIdNgvd29}`;
                            } else {
                                sixthApiUrl = null;
                            }
                            // console.log('sixthApiUrl: ', sixthApiUrl);

                            apiPromises.push(
                                fetch(sixthApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(sixthData => {
                                        // Check if sixthData is null
                                        if (sixthData === null) {
                                            // Handle the case when sixthData is null
                                            // console.log('sixthData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('sixthData:', sixthData);
                                            combinedSixthData.push(sixthData);
                                            // console.log('combinedSixthData:', combinedSixthData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }

                        // Construct the URL for the API seventh request - Top of Flood
                        if (levelIdTopOfFlood !== null && levelIdTopOfFlood !== undefined &&
                            levelIdEffectiveDateTopOfFlood !== null && levelIdEffectiveDateTopOfFlood !== undefined &&
                            levelIdUnitIdTopOfFlood !== null && levelIdUnitIdTopOfFlood !== undefined &&
                            visible !== false) {
                            let seventhApiUrl = null;
                            if (cda === "public") {
                                seventhApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdTopOfFlood}?office=MVS&effective-date=${levelIdEffectiveDateTopOfFlood}&unit=${levelIdUnitIdTopOfFlood}`;
                            } else if (cda === "internal") {
                                seventhApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdTopOfFlood}?office=MVS&effective-date=${levelIdEffectiveDateTopOfFlood}&unit=${levelIdUnitIdTopOfFlood}`;
                            } else {
                                seventhApiUrl = null;
                            }
                            // console.log('seventhApiUrl: ', seventhApiUrl);

                            apiPromises.push(
                                fetch(seventhApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(seventhData => {
                                        // Check if seventhData is null
                                        if (seventhData === null) {
                                            // Handle the case when seventhData is null
                                            // console.log('seventhData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('seventhData:', seventhData);
                                            combinedSeventhData.push(seventhData);
                                            // console.log('combinedSeventhData:', combinedSeventhData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }

                        // Construct the URL for the API eighth request - Top of Conservation
                        if (levelIdTopOfConservation !== null && levelIdTopOfConservation !== undefined &&
                            levelIdEffectiveDateTopOfConservation !== null && levelIdEffectiveDateTopOfConservation !== undefined &&
                            levelIdUnitIdTopOfConservation !== null && levelIdUnitIdTopOfConservation !== undefined &&
                            visible !== false) {
                            let eighthApiUrl = null;
                            if (cda === "public") {
                                eighthApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdTopOfConservation}?office=MVS&effective-date=${levelIdEffectiveDateTopOfConservation}&unit=${levelIdUnitIdTopOfConservation}`;
                            } else if (cda === "internal") {
                                eighthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdTopOfConservation}?office=MVS&effective-date=${levelIdEffectiveDateTopOfConservation}&unit=${levelIdUnitIdTopOfConservation}`;
                            } else {
                                eighthApiUrl = null;
                            }
                            // console.log('eighthApiUrl: ', eighthApiUrl);

                            apiPromises.push(
                                fetch(eighthApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(eighthData => {
                                        // Check if eighthData is null
                                        if (eighthData === null) {
                                            // Handle the case when eighthData is null
                                            // console.log('eighthData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('eighthData:', eighthData);
                                            combinedEighthData.push(eighthData);
                                            // console.log('combinedEighthData:', combinedEighthData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }

                        // Construct the URL for the API nineth request - Bottom of Flood
                        if (levelIdBottomOfFlood !== null && levelIdBottomOfFlood !== undefined &&
                            levelIdEffectiveDateBottomOfFlood !== null && levelIdEffectiveDateBottomOfFlood !== undefined &&
                            levelIdUnitIdBottomOfFlood !== null && levelIdUnitIdBottomOfFlood !== undefined &&
                            visible !== false) {
                            let ninethApiUrl = null;
                            if (cda === "public") {
                                ninethApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdBottomOfFlood}?office=MVS&effective-date=${levelIdEffectiveDateBottomOfFlood}&unit=${levelIdUnitIdBottomOfFlood}`;
                            } else if (cda === "internal") {
                                ninethApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdBottomOfFlood}?office=MVS&effective-date=${levelIdEffectiveDateBottomOfFlood}&unit=${levelIdUnitIdBottomOfFlood}`;
                            } else {
                                ninethApiUrl = null;
                            }
                            // console.log('ninethApiUrl: ', ninethApiUrl);

                            apiPromises.push(
                                fetch(ninethApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(ninethData => {
                                        // Check if ninethData is null
                                        if (ninethData === null) {
                                            // Handle the case when ninethData is null
                                            // console.log('ninethData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('ninethData:', ninethData);
                                            combinedNinethData.push(ninethData);
                                            // console.log('combinedNinethData:', combinedNinethData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }

                        // Construct the URL for the API tenth request - Bottom of Conservation
                        if (levelIdBottomOfConservation !== null && levelIdBottomOfConservation !== undefined &&
                            levelIdEffectiveDateBottomOfConservation !== null && levelIdEffectiveDateBottomOfConservation !== undefined &&
                            levelIdUnitIdBottomOfConservation !== null && levelIdUnitIdBottomOfConservation !== undefined &&
                            visible !== false) {
                            let tenthApiUrl = null;
                            if (cda === "public") {
                                tenthApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdBottomOfConservation}?office=MVS&effective-date=${levelIdEffectiveDateBottomOfConservation}&unit=${levelIdUnitIdBottomOfConservation}`;
                            } else if (cda === "internal") {
                                tenthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdBottomOfConservation}?office=MVS&effective-date=${levelIdEffectiveDateBottomOfConservation}&unit=${levelIdUnitIdBottomOfConservation}`;
                            } else {
                                tenthApiUrl = null;
                            }
                            // console.log('tenthApiUrl: ', tenthApiUrl);

                            apiPromises.push(
                                fetch(tenthApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(tenthData => {
                                        // Check if tenthData is null
                                        if (tenthData === null) {
                                            // Handle the case when tenthData is null
                                            // console.log('tenthData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('tenthData:', tenthData);
                                            combinedTenthData.push(tenthData);
                                            // console.log('combinedTenthData:', combinedTenthData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }
                        // END CDA CALL
                    })
                }
            })
        }


        // Wait for all API requests to finish
        await Promise.all(apiPromises);

        // Call mergeData only if combinedFirstData has data
        mergeData(filteredBasins, combinedFirstData, combinedSecondData, combinedForthData, combinedFifthData, combinedSixthData, combinedSeventhData, combinedEighthData, combinedNinethData, combinedTenthData);
        console.log('allData:', allData);

        // =================================================================== // 
        // ========================== GET DATE TIME ========================== // 
        // =================================================================== //  
        // Get the current time in JavaScript)
        const now = new Date();
        const timestamp = now.getTime(); // Get the current timestamp in milliseconds
        // console.log('timestamp: ', timestamp);

        // Create a new JavaScript Date object
        const date = new Date(timestamp);
        // console.log('date: ', date);

        // =================================================================== // 
        // ========================== GET NWS DATE =========================== // 
        // =================================================================== //
        // Day 1
        var day1 = new Date(timestamp);
        day1.setDate(date.getDate() + 1);
        var nws_day1_date = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2) + '-' + day1.getFullYear();
        var nws_day1_date_title = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2);
        // console.log('nws_day1_date: ', nws_day1_date);
        // console.log('nws_day1_date_title: ', nws_day1_date_title);

        // Day 2
        var day2 = new Date(date);
        day2.setDate(date.getDate() + 2);
        var nws_day2_date = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2) + '-' + day2.getFullYear();
        var nws_day2_date_title = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2);
        // console.log('nws_day2_date: ', nws_day2_date);
        // console.log('nws_day2_date_title: ', nws_day2_date_title);

        // Day 3
        var day3 = new Date(date);
        day3.setDate(date.getDate() + 3);
        var nws_day3_date = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2) + '-' + day3.getFullYear();
        var nws_day3_date_title = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2);
        // console.log('nws_day3_date: ', nws_day3_date);
        // console.log('nws_day3_date_title: ', nws_day3_date_title);

        // ============================================================== // 
        // ========================== RIVER ============================= // 
        // ============================================================== //
        // Call the function to create and populate the river table header
        createRiverTableHeader(nws_day1_date_title, nws_day2_date_title, nws_day3_date_title);

        // Call the function to create and populate the river table body
        createRiverTableBody(allData, nws_day1_date, nws_day2_date, nws_day3_date);


        // ================================================================== // 
        // ========================== RESERVOIR ============================= // 
        // ================================================================== //
        // Call the function to create and populate the reservoir table header
        createReservoirTableHeader();

        // Call the function to create and populate the reservoir table body
        createReservoirTableBody(allData);

        loadingIndicator.style.display = 'none';
    });
} else if (type === "morning") { // Morning Report / River Board Data
    var allData = [];

    document.addEventListener('DOMContentLoaded', async function () {
        // Display the loading_alarm_mvs indicator
        const loadingIndicator = document.getElementById('loading_river_reservoir');
        loadingIndicator.style.display = 'block';

        // Gage control json file
        let jsonFileURL = null;
        if (cda === "public") {
            jsonFileURL = '../../../php_data_api/public/json/gage_control.json';
        } else if (cda === "internal") {
            jsonFileURL = '../../../php_data_api/public/json/gage_control.json';
        }
        // console.log('jsonFileURL: ', jsonFileURL);

        const response = await fetch(jsonFileURL);
        // console.log('response: ', response);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const basins = await response.json();

        // Check if data_items array is present in the data
        // console.log('basins: ', basins);

        // Remove basins that you dont need
        const basinsToRemove = ["Castor", "Big Muddy", "Salt", "St Francis"];
        //const basinsToRemove = ["Castor", "Salt", "St Francis"]; 

        const filteredBasins = basins.filter(basin => !basinsToRemove.includes(basin.basin));
        // console.log("filteredBasins: ", filteredBasins);

        // Define a custom order array
        const customOrder = ["Mississippi", "Cuivre", "Illinois", "Missouri", "Meramec", "Kaskaskia", "Ohio"];

        // Sort the array by the custom order
        filteredBasins.sort((a, b) => customOrder.indexOf(a.basin) - customOrder.indexOf(b.basin));
        // console.log('filteredBasins: ', filteredBasins);

        // to basinData
        const basinData = filteredBasins;

        // Combine all secondDataArray into one object based on name
        const combinedFirstData = [];
        const combinedSecondData = [];
        // // const combinedThirdData = [];
        const combinedForthData = [];
        const combinedFifthData = [];
        const combinedSixthData = [];
        const combinedSeventhData = [];
        const combinedEighthData = [];
        const combinedNinethData = [];
        const combinedTenthData = [];

        // Array to store all promises from API requests
        const apiPromises = [];

        // Check if basinData is an array and has elements
        if (Array.isArray(basinData) && basinData.length > 0) {
            // Iterate through each basin in basinData
            basinData.forEach(basin => {
                // console.log('Processing basin:', basin);

                // Check if basin has gages and gages is an array
                if (Array.isArray(basin.gages) && basin.gages.length > 0) {
                    // Iterate through each gage in the current basin's gages
                    basin.gages.forEach(locData => {
                        // Prepare variable to pass in when call api
                        const locationId = locData.location_id;
                        // console.log('locationId: ', locationId);

                        const visible = locData.visible;
                        // console.log('visible: ', visible);

                        // Location level "Flood"
                        const levelIdFlood = locData.level_id_flood;
                        const levelIdEffectiveDateFlood = locData.level_id_effective_date_flood;
                        const levelIdUnitIdFlood = locData.level_id_unit_id_flood;

                        // Location level "NGVD29"
                        const levelIdNgvd29 = locData.level_id_ngvd29;
                        const levelIdEffectiveDateNgvd29 = locData.level_id_effective_date_ngvd29;
                        const levelIdUnitIdNgvd29 = locData.level_id_unit_id_ngvd29;

                        // Location level "Record Stage"
                        const levelIdRecordStage = locData.level_id_record_stage;
                        const levelIdEffectiveDateRecordStage = locData.level_id_effective_date_record_stage;
                        const levelIdUnitIdRecordStage = locData.level_id_unit_id_record_stage;

                        // Location level "Top of Flood"
                        const levelIdTopOfFlood = locData.level_id_top_of_flood;
                        const levelIdEffectiveDateTopOfFlood = locData.level_id_effective_date_top_of_flood;
                        const levelIdUnitIdTopOfFlood = locData.level_id_unit_id_top_of_flood;

                        // Location level "Top of Conservation"
                        const levelIdTopOfConservation = locData.level_id_top_of_conservation;
                        const levelIdEffectiveDateTopOfConservation = locData.level_id_effective_date_top_of_conservation;
                        const levelIdUnitIdTopOfConservation = locData.level_id_unit_id_top_of_conservation;

                        // Location level "Bottom of Flood"
                        const levelIdBottomOfFlood = locData.level_id_bottom_of_flood;
                        const levelIdEffectiveDateBottomOfFlood = locData.level_id_effective_date_bottom_of_flood;
                        const levelIdUnitIdBottomOfFlood = locData.level_id_unit_id_bottom_of_flood;

                        // Location level "Bottom of Conservation"
                        const levelIdBottomOfConservation = locData.level_id_bottom_of_conservation;
                        const levelIdEffectiveDateBottomOfConservation = locData.level_id_effective_date_bottom_of_conservation;
                        const levelIdUnitIdBottomOfConservation = locData.level_id_unit_id_bottom_of_conservation;

                        // ======================================================================= // 
                        // ========================== START CDA CALL ============================= // 
                        // ======================================================================= //
                        // Construct the URL for the API first request - metadata
                        let firstApiUrl = null;
                        if (cda === "public") {
                            firstApiUrl = `https://water.usace.army.mil/cwms-data/locations/${locationId}?office=MVS`;
                        } else if (cda === "internal") {
                            firstApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/locations/${locationId}?office=MVS`;
                        } else {
                            firstApiUrl = null;
                        }
                        // console.log('firstApiUrl: ', firstApiUrl);

                        // Push the fetch promise to the apiPromises array
                        apiPromises.push(fetch(firstApiUrl)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(firstData => {
                                // Process the response firstData as needed
                                // console.log('firstData :', firstData);
                                combinedFirstData.push(firstData);
                            })
                        );

                        // Construct the URL for the API second request - flood
                        if (levelIdFlood !== null && levelIdFlood !== undefined &&
                            levelIdEffectiveDateFlood !== null && levelIdEffectiveDateFlood !== undefined &&
                            levelIdUnitIdFlood !== null && levelIdUnitIdFlood !== undefined &&
                            visible !== false) {
                            let secondApiUrl = null;
                            if (cda === "public") {
                                secondApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdFlood}?office=MVS&effective-date=${levelIdEffectiveDateFlood}&unit=${levelIdUnitIdFlood}`;
                            } else if (cda === "internal") {
                                secondApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdFlood}?office=MVS&effective-date=${levelIdEffectiveDateFlood}&unit=${levelIdUnitIdFlood}`;
                            } else {
                                secondApiUrl = null;
                            }
                            // console.log('secondApiUrl: ', secondApiUrl);

                            apiPromises.push(
                                fetch(secondApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(secondData => {
                                        // Check if secondData is null
                                        if (secondData === null) {
                                            // Handle the case when secondData is null
                                            // console.log('secondData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('secondData:', secondData);
                                            combinedSecondData.push(secondData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            )
                        }

                        // // Construct the URL for the API third request - basin
                        // let thirdApiUrl = null;
                        // if (cda === "public") {
                        //     thirdApiUrl = `https://water.usace.army.mil/cwms-data/location/group/${selectedBasin}?office=MVS&category-id=RDL_Basins`;
                        // } else {
                        //     thirdApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/location/group/${selectedBasin}?office=MVS&category-id=RDL_Basins`;
                        // }
                        // console.log('thirdApiUrl: ', thirdApiUrl);

                        // // Push the fetch promise to the apiPromises array
                        // apiPromises.push(
                        //     fetch(thirdApiUrl)
                        //     .then(response => {
                        //         // Check if the network response is successful
                        //         if (!response.ok) {
                        //             throw new Error('Network response was not ok');
                        //         }
                        //         return response.json();
                        //     })
                        //     .then(thirdData => {
                        //         // Check if thirdData is null
                        //         if (thirdData === null) {
                        //             console.log('thirdData is null');
                        //             // Handle the case when thirdData is null (optional)
                        //         } else {
                        //             // Process the response from another API as needed
                        //             console.log('thirdData:', thirdData);

                        //             // Filter the assigned locations array to find the desired location
                        //             const foundThirdLocation = thirdData["assigned-locations"].find(location => location["location-id"] === locationId);

                        //             // Extract thirdData if the location is found
                        //             let extractedThirdData = null;
                        //             if (foundThirdLocation) {
                        //                 extractedThirdData = {
                        //                     "office-id": thirdData["office-id"],
                        //                     "id": thirdData["id"],
                        //                     "location-id": foundThirdLocation["location-id"]
                        //                 };
                        //             }
                        //             console.log("extractedThirdData", extractedThirdData);

                        //             // Push the extracted thirdData to the combinedThirdData array
                        //             combinedThirdData.push(extractedThirdData);
                        //         }
                        //     })
                        // );


                        // Construct the URL for the API forth request - owner
                        let forthApiUrl = null;
                        if (cda === "public") {
                            forthApiUrl = `https://water.usace.army.mil/cwms-data/location/group/MVS?office=MVS&category-id=RDL_MVS`;
                        } else if (cda === "internal") {
                            forthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/location/group/MVS?office=MVS&category-id=RDL_MVS`;
                        } else {
                            forthApiUrl = null;
                        }
                        // console.log('forthApiUrl: ', forthApiUrl);

                        // Push the fetch promise to the apiPromises array
                        apiPromises.push(
                            fetch(forthApiUrl)
                                .then(response => {
                                    // Check if the network response is successful
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(forthData => {
                                    // Check if forthData is null
                                    if (forthData === null) {
                                        // console.log('forthData is null');
                                        // Handle the case when forthData is null (optional)
                                    } else {
                                        // Process the response from another API as needed
                                        // console.log('forthData:', forthData);

                                        // Filter the assigned locations array to find the desired location
                                        const foundForthLocation = forthData["assigned-locations"].find(location => location["location-id"] === locationId);

                                        // Extract forthData if the location is found
                                        let extractedForthData = null;
                                        if (foundForthLocation) {
                                            extractedForthData = {
                                                "office-id": forthData["office-id"],
                                                "id": forthData["id"],
                                                "location-id": foundForthLocation["location-id"]
                                            };
                                        }
                                        // console.log("extractedForthData", extractedForthData);

                                        // Push the extracted forthData to the combinedForthData array
                                        combinedForthData.push(extractedForthData);
                                        // console.log('combinedForthData:', combinedForthData);
                                    }
                                })
                        );

                        // Construct the URL for the API fifth request - Record Stage
                        if (levelIdRecordStage !== null && levelIdRecordStage !== undefined &&
                            levelIdEffectiveDateRecordStage !== null && levelIdEffectiveDateRecordStage !== undefined &&
                            levelIdUnitIdRecordStage !== null && levelIdUnitIdRecordStage !== undefined &&
                            visible !== false) {
                            let fifthApiUrl = null;
                            if (cda === "public") {
                                fifthApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdRecordStage}?office=MVS&effective-date=${levelIdEffectiveDateRecordStage}&unit=${levelIdUnitIdRecordStage}`;
                            } else if (cda === "internal") {
                                fifthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdRecordStage}?office=MVS&effective-date=${levelIdEffectiveDateRecordStage}&unit=${levelIdUnitIdRecordStage}`;
                            } else {
                                fifthApiUrl = null;
                            }
                            // console.log('fifthApiUrl: ', fifthApiUrl);

                            apiPromises.push(
                                fetch(fifthApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(fifthData => {
                                        // Check if fifthData is null
                                        if (fifthData === null) {
                                            // Handle the case when fifthData is null
                                            // console.log('fifthData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('fifthData:', fifthData);
                                            combinedFifthData.push(fifthData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        if (error.name === 'AbortError') {
                                            console.error('The fetch operation was aborted.');
                                        } else {
                                            console.error('Error fetching or processing data:', error);
                                        }
                                    })
                            )
                        }

                        // Construct the URL for the API sixth request - Record Stage
                        if (levelIdNgvd29 !== null && levelIdNgvd29 !== undefined &&
                            levelIdEffectiveDateNgvd29 !== null && levelIdEffectiveDateNgvd29 !== undefined &&
                            levelIdUnitIdNgvd29 !== null && levelIdUnitIdNgvd29 !== undefined &&
                            visible !== false) {
                            let sixthApiUrl = null;
                            if (cda === "public") {
                                sixthApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdNgvd29}?office=MVS&effective-date=${levelIdEffectiveDateNgvd29}&unit=${levelIdUnitIdNgvd29}`;
                            } else if (cda === "internal") {
                                sixthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdNgvd29}?office=MVS&effective-date=${levelIdEffectiveDateNgvd29}&unit=${levelIdUnitIdNgvd29}`;
                            } else {
                                sixthApiUrl = null;
                            }
                            // console.log('sixthApiUrl: ', sixthApiUrl);

                            apiPromises.push(
                                fetch(sixthApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(sixthData => {
                                        // Check if sixthData is null
                                        if (sixthData === null) {
                                            // Handle the case when sixthData is null
                                            // console.log('sixthData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('sixthData:', sixthData);
                                            combinedSixthData.push(sixthData);
                                            // console.log('combinedSixthData:', combinedSixthData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }

                        // Construct the URL for the API seventh request - Top of Flood
                        if (levelIdTopOfFlood !== null && levelIdTopOfFlood !== undefined &&
                            levelIdEffectiveDateTopOfFlood !== null && levelIdEffectiveDateTopOfFlood !== undefined &&
                            levelIdUnitIdTopOfFlood !== null && levelIdUnitIdTopOfFlood !== undefined &&
                            visible !== false) {
                            let seventhApiUrl = null;
                            if (cda === "public") {
                                seventhApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdTopOfFlood}?office=MVS&effective-date=${levelIdEffectiveDateTopOfFlood}&unit=${levelIdUnitIdTopOfFlood}`;
                            } else if (cda === "internal") {
                                seventhApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdTopOfFlood}?office=MVS&effective-date=${levelIdEffectiveDateTopOfFlood}&unit=${levelIdUnitIdTopOfFlood}`;
                            } else {
                                seventhApiUrl = null;
                            }
                            // console.log('seventhApiUrl: ', seventhApiUrl);

                            apiPromises.push(
                                fetch(seventhApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(seventhData => {
                                        // Check if seventhData is null
                                        if (seventhData === null) {
                                            // Handle the case when seventhData is null
                                            // console.log('seventhData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('seventhData:', seventhData);
                                            combinedSeventhData.push(seventhData);
                                            // console.log('combinedSeventhData:', combinedSeventhData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }

                        // Construct the URL for the API eighth request - Top of Conservation
                        if (levelIdTopOfConservation !== null && levelIdTopOfConservation !== undefined &&
                            levelIdEffectiveDateTopOfConservation !== null && levelIdEffectiveDateTopOfConservation !== undefined &&
                            levelIdUnitIdTopOfConservation !== null && levelIdUnitIdTopOfConservation !== undefined &&
                            visible !== false) {
                            let eighthApiUrl = null;
                            if (cda === "public") {
                                eighthApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdTopOfConservation}?office=MVS&effective-date=${levelIdEffectiveDateTopOfConservation}&unit=${levelIdUnitIdTopOfConservation}`;
                            } else if (cda === "internal") {
                                eighthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdTopOfConservation}?office=MVS&effective-date=${levelIdEffectiveDateTopOfConservation}&unit=${levelIdUnitIdTopOfConservation}`;
                            } else {
                                eighthApiUrl = null;
                            }
                            // console.log('eighthApiUrl: ', eighthApiUrl);

                            apiPromises.push(
                                fetch(eighthApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(eighthData => {
                                        // Check if eighthData is null
                                        if (eighthData === null) {
                                            // Handle the case when eighthData is null
                                            // console.log('eighthData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('eighthData:', eighthData);
                                            combinedEighthData.push(eighthData);
                                            // console.log('combinedEighthData:', combinedEighthData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }

                        // Construct the URL for the API nineth request - Bottom of Flood
                        if (levelIdBottomOfFlood !== null && levelIdBottomOfFlood !== undefined &&
                            levelIdEffectiveDateBottomOfFlood !== null && levelIdEffectiveDateBottomOfFlood !== undefined &&
                            levelIdUnitIdBottomOfFlood !== null && levelIdUnitIdBottomOfFlood !== undefined &&
                            visible !== false) {
                            let ninethApiUrl = null;
                            if (cda === "public") {
                                ninethApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdBottomOfFlood}?office=MVS&effective-date=${levelIdEffectiveDateBottomOfFlood}&unit=${levelIdUnitIdBottomOfFlood}`;
                            } else if (cda === "internal") {
                                ninethApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdBottomOfFlood}?office=MVS&effective-date=${levelIdEffectiveDateBottomOfFlood}&unit=${levelIdUnitIdBottomOfFlood}`;
                            } else {
                                ninethApiUrl = null;
                            }
                            // console.log('ninethApiUrl: ', ninethApiUrl);

                            apiPromises.push(
                                fetch(ninethApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(ninethData => {
                                        // Check if ninethData is null
                                        if (ninethData === null) {
                                            // Handle the case when ninethData is null
                                            // console.log('ninethData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('ninethData:', ninethData);
                                            combinedNinethData.push(ninethData);
                                            // console.log('combinedNinethData:', combinedNinethData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }

                        // Construct the URL for the API tenth request - Bottom of Conservation
                        if (levelIdBottomOfConservation !== null && levelIdBottomOfConservation !== undefined &&
                            levelIdEffectiveDateBottomOfConservation !== null && levelIdEffectiveDateBottomOfConservation !== undefined &&
                            levelIdUnitIdBottomOfConservation !== null && levelIdUnitIdBottomOfConservation !== undefined &&
                            visible !== false) {
                            let tenthApiUrl = null;
                            if (cda === "public") {
                                tenthApiUrl = `https://water.usace.army.mil/cwms-data/levels/${levelIdBottomOfConservation}?office=MVS&effective-date=${levelIdEffectiveDateBottomOfConservation}&unit=${levelIdUnitIdBottomOfConservation}`;
                            } else if (cda === "internal") {
                                tenthApiUrl = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${levelIdBottomOfConservation}?office=MVS&effective-date=${levelIdEffectiveDateBottomOfConservation}&unit=${levelIdUnitIdBottomOfConservation}`;
                            } else {
                                tenthApiUrl = null;
                            }
                            // console.log('tenthApiUrl: ', tenthApiUrl);

                            apiPromises.push(
                                fetch(tenthApiUrl)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(tenthData => {
                                        // Check if tenthData is null
                                        if (tenthData === null) {
                                            // Handle the case when tenthData is null
                                            // console.log('tenthData is null');
                                            // You can choose to return or do something else here
                                        } else {
                                            // Process the response from another API as needed
                                            // console.log('tenthData:', tenthData);
                                            combinedTenthData.push(tenthData);
                                            // console.log('combinedTenthData:', combinedTenthData);
                                        }
                                    })
                                    .catch(error => {
                                        // Handle any errors that occur during the fetch or processing
                                        console.error('Error fetching or processing data:', error);
                                    })
                            );
                        }
                        // END CDA CALL
                    })
                }
            })
        }


        // Wait for all API requests to finish
        await Promise.all(apiPromises);

        // Call mergeData only if combinedFirstData has data
        mergeData(filteredBasins, combinedFirstData, combinedSecondData, combinedForthData, combinedFifthData, combinedSixthData, combinedSeventhData, combinedEighthData, combinedNinethData, combinedTenthData);
        console.log('allData:', allData);

        // =================================================================== // 
        // ========================== GET DATE TIME ========================== // 
        // =================================================================== //  
        // Get the current time in JavaScript)
        const now = new Date();
        const timestamp = now.getTime(); // Get the current timestamp in milliseconds
        // console.log('timestamp: ', timestamp);

        // Create a new JavaScript Date object
        const date = new Date(timestamp);
        // console.log('date: ', date);

        // =================================================================== // 
        // ========================== GET NWS DATE =========================== // 
        // =================================================================== //
        // Day 1
        var day1 = new Date(timestamp);
        day1.setDate(date.getDate() + 1);
        var nws_day1_date = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2) + '-' + day1.getFullYear();
        var nws_day1_date_title = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2);
        // console.log('nws_day1_date: ', nws_day1_date);
        // console.log('nws_day1_date_title: ', nws_day1_date_title);

        // Day 2
        var day2 = new Date(date);
        day2.setDate(date.getDate() + 2);
        var nws_day2_date = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2) + '-' + day2.getFullYear();
        var nws_day2_date_title = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2);
        // console.log('nws_day2_date: ', nws_day2_date);
        // console.log('nws_day2_date_title: ', nws_day2_date_title);

        // Day 3
        var day3 = new Date(date);
        day3.setDate(date.getDate() + 3);
        var nws_day3_date = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2) + '-' + day3.getFullYear();
        var nws_day3_date_title = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2);
        // console.log('nws_day3_date: ', nws_day3_date);
        // console.log('nws_day3_date_title: ', nws_day3_date_title);

        // ============================================================== // 
        // ========================== RIVER ============================= // 
        // ============================================================== //
        // Call the function to create and populate the river table header
        createMorningRiverBoardDataTableHeader(nws_day1_date_title, nws_day2_date_title, nws_day3_date_title);

        // Call the function to create and populate the river table body
        createMorningRiverBoardDataTableBody(allData, nws_day1_date, nws_day2_date, nws_day3_date);

        loadingIndicator.style.display = 'none';
    });
} else {

}