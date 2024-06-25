<?php
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function set_options($db) {
	$stmnt_query = null;
	
    try {
		$sql = "alter session set  NLS_DATE_FORMAT='mm-dd-yyyy hh24:mi'";
        $stmnt_query = oci_parse($db, $sql);
        $status = oci_execute($stmnt_query);
        if ( !$status ) {
            $e = oci_error($db);
            trigger_error(htmlentities($e['message']), E_USER_ERROR);
        }
    }
    catch (Exception $e) {
        $status = "ERROR: Could set database session options";
    }
	finally {
		oci_free_statement($stmnt_query); 
	}
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function set_options2($db) {
	//change format to = yyyy-mm-dd hh24:mi
	$stmnt_query = null;
	
    try {
        // mm-dd-yyyy hh24:mi
		$sql = "alter session set  NLS_DATE_FORMAT='yyyy-mm-dd hh24:mi'";
        $stmnt_query = oci_parse($db, $sql);
        $status = oci_execute($stmnt_query);
        if ( !$status ) {
            $e = oci_error($db);
            trigger_error(htmlentities($e['message']), E_USER_ERROR);
            // throw new \RuntimeException(self::$status);
        }
    }
    catch (Exception $e) {
        $status = "ERROR: Could set database session options";
        // throw new \RuntimeException(self::$status);
    }
	finally {
		oci_free_statement($stmnt_query); 
	}
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function find_gage_control_basin($db, $basin) {
	$stmnt_query = null;
	$data = [];

	try {		
		$sql = "select 	
					loc.location_id, loc.elevation, loc.latitude, loc.longitude, loc.vertical_datum, loc.public_name
					,station.station, station.drainage_area, station.area_unit
					,location_level.constant_level as flood_level, location_level.location_level_id as flood_level_location_level_id, location_level.level_unit as flood_level_level_unit
					,location_level2.constant_level as ngvd29, location_level2.location_level_id as ngvd29_location_level_id, location_level2.level_unit as ngvd29_level_unit
					,cga.group_id as owner
					,cga2.group_id as basin
				from cwms_20.av_loc loc
					left join cwms_20.av_stream_location station
					on loc.location_id = station.location_id
						left join cwms_20.av_location_level location_level
						on loc.location_id = location_level.location_id
							left join cwms_20.av_location_level location_level2
							on loc.location_id = location_level2.location_id
								left join cwms_20.av_loc_grp_assgn cga
								on loc.location_id = cga.location_id
									left join cwms_20.av_loc_grp_assgn cga2
									on loc.location_id = cga2.location_id
				where 
					loc.unit_system = 'EN'
					and station.unit_system = 'EN' 
					and location_level.unit_system = 'EN'
					and location_level.level_unit = 'ft'  
					and location_level.specified_level_id = 'Flood'
					and location_level2.unit_system = 'EN'
					and location_level2.level_unit = 'ft'  
					and location_level2.specified_level_id = 'NGVD29'
					and cga.category_id = 'RDL_MVS'
					and cga2.category_id = 'RDL_Basins'
					and cga2.group_id = '".$basin."'";

		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			$obj = (object) [
				"location_id" => $row['LOCATION_ID'],
				"elevation" => $row['ELEVATION'],
				"latitude" => $row['LATITUDE'],
				"longitude" => $row['LONGITUDE'],
				"vertical_datum" => $row['VERTICAL_DATUM'],
				"public_name" => $row['PUBLIC_NAME'],

				"station" => $row['STATION'],
				"drainage_area" => $row['DRAINAGE_AREA'],
				"area_unit" => $row['AREA_UNIT'],

				"flood_level" => $row['FLOOD_LEVEL'],
				"flood_level_location_level_id" => $row['FLOOD_LEVEL_LOCATION_LEVEL_ID'],
				"flood_level_level_unit" => $row['FLOOD_LEVEL_LEVEL_UNIT'],
				
				"ngvd29" => $row['NGVD29'],
				"ngvd29_location_level_id" => $row['NGVD29_LOCATION_LEVEL_ID'],
				"ngvd29_level_unit" => $row['NGVD29_LEVEL_UNIT'],
				
				"owner" => $row['OWNER'],
				"basin" => $row['BASIN']
			];
			array_push($data,$obj);
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);

		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_stage_data($db, $cwms_ts_id) {
	$stmnt_query = null;
	$data = null;
	
	try {		
		$sql = "with cte_last_max as (                
					select ts_code, 
						date_time, 
						cwms_ts_id, 
						cwms_util.split_text(cwms_ts_id, 1, '.') as location_id, 
						cwms_util.split_text(cwms_ts_id, 2, '.') as parameter_id, 
						value, 
						unit_id, 
						quality_code
					from CWMS_20.AV_TSV_DQU_30D
					where cwms_ts_id = '".$cwms_ts_id."'
					and (unit_id = 'ppm' or unit_id = 'F' or unit_id = CASE WHEN cwms_util.split_text(cwms_ts_id,2,'.') IN ('Stage','Elev') THEN 'ft' WHEN cwms_util.split_text(cwms_ts_id,2,'.') IN ('Precip','Depth') THEN 'in' END or unit_id = 'cfs' or unit_id = 'umho/cm' or unit_id = 'volt' or unit_id = 'su' or unit_id = 'FNU' or unit_id = 'mph' or unit_id = 'in-hg' or unit_id = 'deg')
					order by date_time desc
					fetch first 1 rows only
				),
				cte_6_hr as (
					select ts_code, 
						date_time, 
						cwms_ts_id, 
						cwms_util.split_text(cwms_ts_id, 1, '.') as location_id, 
						cwms_util.split_text(cwms_ts_id, 2, '.') as parameter_id, 
						value as value_6_hr, 
						unit_id, 
						quality_code
					from CWMS_20.AV_TSV_DQU_30D
					where cwms_ts_id = '".$cwms_ts_id."'
					and (unit_id = 'ppm' or unit_id = 'F' or unit_id = CASE WHEN cwms_util.split_text(cwms_ts_id,2,'.') IN ('Stage','Elev') THEN 'ft' WHEN cwms_util.split_text(cwms_ts_id,2,'.') IN ('Precip','Depth') THEN 'in' END or unit_id = 'cfs' or unit_id = 'umho/cm' or unit_id = 'volt' or unit_id = 'su' or unit_id = 'FNU' or unit_id = 'mph' or unit_id = 'in-hg' or unit_id = 'deg')
					and date_time = to_date((select (date_time - interval '6' hour) from cte_last_max) ,'mm-dd-yyyy hh24:mi:ss')
					order by date_time desc
					fetch first 1 rows only
				),
				cte_24_hr as (
					select ts_code, 
						date_time, 
						cwms_ts_id, 
						cwms_util.split_text(cwms_ts_id, 1, '.') as location_id, 
						cwms_util.split_text(cwms_ts_id, 2, '.') as parameter_id, 
						value as value_24_hr, 
						unit_id, 
						quality_code
					from CWMS_20.AV_TSV_DQU_30D
					where cwms_ts_id = '".$cwms_ts_id."'
					and (unit_id = 'ppm' or unit_id = 'F' or unit_id = CASE WHEN cwms_util.split_text(cwms_ts_id,2,'.') IN ('Stage','Elev') THEN 'ft' WHEN cwms_util.split_text(cwms_ts_id,2,'.') IN ('Precip','Depth') THEN 'in' END or unit_id = 'cfs' or unit_id = 'umho/cm' or unit_id = 'volt' or unit_id = 'su' or unit_id = 'FNU' or unit_id = 'mph' or unit_id = 'in-hg' or unit_id = 'deg')
					and date_time = to_date((select (date_time - interval '24' hour) from cte_last_max) ,'mm-dd-yyyy hh24:mi:ss')
					order by date_time desc
					fetch first 1 rows only
				)
				select last_max.ts_code, 
					last_max.date_time, 
					cwms_util.change_timezone(last_max.date_time, 'UTC', 'CST6CDT' ) as date_time_cst, 
					last_max.cwms_ts_id, 
					last_max.location_id, 
					last_max.parameter_id,
					last_max.value, 
					last_max.unit_id, 
					last_max.quality_code,
					
					cte_6_hr.date_time as date_time_6, 
					cwms_util.change_timezone(cte_6_hr.date_time, 'UTC', 'CST6CDT' ) as date_time_6_cst, 
					cte_6_hr.value_6_hr as value_6,
					
					cte_24_hr.date_time as date_time_24, 
					cwms_util.change_timezone(cte_24_hr.date_time, 'UTC', 'CST6CDT' ) as date_time_24_cst, 
					cte_24_hr.value_24_hr as value_24,

					(last_max.value - cte_6_hr.value_6_hr) as delta_6,
					(last_max.value - cte_24_hr.value_24_hr) as delta_24,

					sysdate - interval '8' hour as late_date
				from cte_last_max last_max
					left join cte_6_hr cte_6_hr
					on last_max.cwms_ts_id = cte_6_hr.cwms_ts_id
						left join cte_24_hr cte_24_hr
						on last_max.cwms_ts_id = cte_24_hr.cwms_ts_id";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			
			$data = (object) [
				"ts_code" => $row['TS_CODE'],
				"date_time" => $row['DATE_TIME'],
				"date_time_cst" => $row['DATE_TIME_CST'],
				"cwms_ts_id" => $row['CWMS_TS_ID'],
				"location_id" => $row['LOCATION_ID'],
				"parameter_id" => $row['PARAMETER_ID'],
				"value" => $row['VALUE'],
				"unit_id" => $row['UNIT_ID'],
				"quality_code" => $row['QUALITY_CODE'],
				"date_time_6" => $row['DATE_TIME_6'],
				"date_time_6_cst" => $row['DATE_TIME_6_CST'],
				"value_6" => $row['VALUE_6'],
				"date_time_24" => $row['DATE_TIME_24'],
				"date_time_24_cst" => $row['DATE_TIME_24_CST'],
				"value_24" => $row['VALUE_24'],
				"delta_6" => $row['DELTA_6'],
				"delta_24" => $row['DELTA_24'],
				"late_date" => $row['LATE_DATE']
			];
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);

		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function find_nws_forecast($db, $cwms_ts_id, $nws_day1_date, $nws_day2_date, $nws_day3_date) {
	$stmnt_query = null;
	$data = null;
	try {		
		$sql = "with cte_day1 as (select cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') as date_time
					,value
					,cwms_ts_id
					,cwms_util.split_text(cwms_ts_id, 1, '.') as location_id
					,unit_id
					,to_char(cwms_util.change_timezone(data_entry_date, 'UTC', 'CST6CDT'), 'mm/dd HH24:MI') as data_entry_date
					,to_char(cwms_util.change_timezone(data_entry_date, 'UTC', 'CST6CDT'), 'mm-dd-yyyy HH24:MI') as data_entry_date_org
				from CWMS_20.AV_TSV_DQU
				where cwms_ts_id = '".$cwms_ts_id."'
					and unit_id = 'ft'
					and date_time = to_date('".$nws_day1_date."' || '12:00' ,'mm-dd-yyyy hh24:mi')
				),
				
				day_2 as (
				select cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') as date_time
					,value
					,cwms_ts_id
					,cwms_util.split_text(cwms_ts_id, 1, '.') as location_id
					,unit_id
					,to_char(cwms_util.change_timezone(data_entry_date, 'UTC', 'CST6CDT'), 'mm/dd HH24:MI') as data_entry_date
					,to_char(cwms_util.change_timezone(data_entry_date, 'UTC', 'CST6CDT'), 'mm-dd-yyyy HH24:MI') as data_entry_date_org
				from CWMS_20.AV_TSV_DQU
				where cwms_ts_id = '".$cwms_ts_id."'
					and unit_id = 'ft'
					and date_time = to_date('".$nws_day2_date."' || '12:00' ,'mm-dd-yyyy hh24:mi')
				),
				
				day_3 as (
				select cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') as date_time
					,value
					,cwms_ts_id
					,cwms_util.split_text(cwms_ts_id, 1, '.') as location_id
					,unit_id
					,to_char(cwms_util.change_timezone(data_entry_date, 'UTC', 'CST6CDT'), 'mm/dd HH24:MI') as data_entry_date
					,to_char(cwms_util.change_timezone(data_entry_date, 'UTC', 'CST6CDT'), 'mm-dd-yyyy HH24:MI') as data_entry_date_org
				from CWMS_20.AV_TSV_DQU
				where cwms_ts_id = '".$cwms_ts_id."'
					and unit_id = 'ft'
					and date_time = to_date('".$nws_day3_date."' || '12:00' ,'mm-dd-yyyy hh24:mi')
				)
				
				select day1.date_time as date_time_day1, day1.value as value_day1, day1.cwms_ts_id as cwms_ts_id_day1, day1.location_id as location_id_day1, day1.unit_id as unit_id_day1, day1.data_entry_date as data_entry_date_day1, day1.data_entry_date_org as data_entry_date_org_day1
					,day2.date_time as date_time_day2, day2.value as value_day2, day2.cwms_ts_id as cwms_ts_id_day2, day2.location_id as location_id_day2, day2.unit_id as unit_id_day2, day2.data_entry_date as data_entry_date_day2, day2.data_entry_date_org as data_entry_date_org_day2
					,day3.date_time as date_time_day3, day3.value as value_day3, day3.cwms_ts_id as cwms_ts_id_day3, day3.location_id as location_id_day3, day3.unit_id as unit_id_day3, day3.data_entry_date as data_entry_date_day3, day3.data_entry_date_org as data_entry_date_org_day3
				from cte_day1 day1
					left join day_2 day2
					on day1.location_id = day2.location_id
						left join day_3 day3
						on day1.location_id = day3.location_id
				";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			
			$data = (object) [
				"date_time_day1" => $row['DATE_TIME_DAY1'],
				"data_entry_date_day1" => $row['DATA_ENTRY_DATE_DAY1'],
				"data_entry_date_org_day1" => $row['DATA_ENTRY_DATE_ORG_DAY1'],
				"value_day1" => $row['VALUE_DAY1'],
				"unit_id_day1" => $row['UNIT_ID_DAY1'],
				"cwms_ts_id_day1" => $row['CWMS_TS_ID_DAY1'],
				"location_id_day1" => $row['LOCATION_ID_DAY1'],
				"date_time_day2" => $row['DATE_TIME_DAY2'],
				"data_entry_date_day2" => $row['DATA_ENTRY_DATE_DAY2'],
				"data_entry_date_org_day2" => $row['DATA_ENTRY_DATE_ORG_DAY2'],
				"value_day2" => $row['VALUE_DAY2'],
				"unit_id_day2" => $row['UNIT_ID_DAY2'],
				"cwms_ts_id_day2" => $row['CWMS_TS_ID_DAY2'],
				"location_id_day2" => $row['LOCATION_ID_DAY2'],
				"date_time_day3" => $row['DATE_TIME_DAY3'],
				"data_entry_date_day3" => $row['DATA_ENTRY_DATE_DAY3'],
				"data_entry_date_org_day3" => $row['DATA_ENTRY_DATE_ORG_DAY3'],
				"value_day3" => $row['VALUE_DAY3'],
				"unit_id_day3" => $row['UNIT_ID_DAY3'],
				"cwms_ts_id_day3" => $row['CWMS_TS_ID_DAY3'],
				"location_id_day3" => $row['LOCATION_ID_DAY3']
			];
			
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);

		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_crest_data($db, $cwms_ts_id) {
	$stmnt_query = null;
	$data = null;
	try {		
		$sql = "with cte_crest as (
					select cwms_ts_id
						,cwms_util.split_text(cwms_ts_id, 1, '.') as location_id
						,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
						,value
						,unit_id
						,quality_code
						,data_entry_date
					from cwms_v_tsv_dqu_30d 
					where cwms_ts_id  = '".$cwms_ts_id."'
					and unit_id = 'ft'
					order by data_entry_date desc
					fetch first 1 rows only
				)
				select cwms_ts_id
					,location_id
					,date_time
					,value
					,unit_id
					,quality_code
					,data_entry_date
				from cte_crest
				where date_time >= to_date(to_char(sysdate - 6/24, 'mm-dd-yyyy hh24:mi') ,'mm-dd-yyyy hh24:mi')";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			
			$data = (object) [
				"location_id" => $row['LOCATION_ID'],
				"cwms_ts_id" => $row['CWMS_TS_ID'],
				"date_time" => $row['DATE_TIME'],
				"value" => $row['VALUE'],
				"unit_id" => $row['UNIT_ID'],
				"quality_code" => $row['QUALITY_CODE'],
				"data_entry_date" => $row['DATA_ENTRY_DATE']
			];
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);

		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_record_stage($db, $cwms_ts_id) {
	$stmnt_query = null;
	$data = null;
	
	try {		
		$sql = "select location_id
					,location_level_id
					,level_date
					,constant_level
					,level_unit
				from CWMS_20.AV_LOCATION_LEVEL
				where specified_level_id = 'Record Stage' and location_id = cwms_util.split_text('".$cwms_ts_id."', 1, '.') and unit_system = 'EN'";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			$data = (object) [
				"location_id" => $row['LOCATION_ID'],
				"location_level_id" => $row['LOCATION_LEVEL_ID'],
				"level_date" => $row['LEVEL_DATE'],
				"constant_level" => $row['CONSTANT_LEVEL'],
				"level_unit" => $row['LEVEL_UNIT']
			];
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);
		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_lake_storage($db, $cwms_ts_id) {
	$stmnt_query = null;
	$data = null;
	
	try {		
		$sql = "with cte_storage as (
					select date_time, value, unit_id, cwms_ts_id, cwms_util.split_text(cwms_ts_id, 1, '.') as location_id
					from CWMS_20.AV_TSV_DQU_30D
					where cwms_ts_id = '".$cwms_ts_id."' || '.Stor.Inst.30Minutes.0.RatingCOE'
					and date_time = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi')
					and unit_id = 'ac-ft'
				),
				cte_top_bottom_data as (
					select location_id
						,specified_level_id
						,location_level_id
						,constant_level
						,level_unit 
					from CWMS_20.AV_LOCATION_LEVEL 
					where location_id in ('Carlyle Lk', 'Mark Twain Lk', 'Rend Lk', 'Lk Shelbyville', 'Wappapello Lk')
					and level_unit in ('ac-ft')
					and unit_system = 'EN'
					and specified_level_id in ('Top of Conservation','Bottom of Conservation', 'Top of Flood', 'Bottom of Flood')
				),
				cte_new_top_bottom_data as (
					select 
						case
							when location_id = 'Lk Shelbyville' then 'Lk Shelbyville-Kaskaskia'
							when location_id = 'Wappapello Lk' then 'Wappapello Lk-St Francis'
							when location_id = 'Rend Lk' then 'Rend Lk-Big Muddy'
							when location_id = 'Mark Twain Lk' then 'Mark Twain Lk-Salt'
							when location_id = 'Carlyle Lk' then 'Carlyle Lk-Kaskaskia'
							else 'na'
						end as location_id
						,specified_level_id
						,location_level_id
						,constant_level
						,level_unit 
					from cte_top_bottom_data
				),
				top_bottom_data as (
					select toc.constant_level as TOC, toc.location_id, toc.level_unit, toc.specified_level_id, toc.location_level_id 
						,toc.location_level_id as toc_location_level_id
						,boc.constant_level  as BOC
						,boc.location_level_id as boc_location_level_id
						,tof.constant_level as TOF
						,tof.location_level_id as tof_location_level_id
						,bof.constant_level as BOF
						,bof.location_level_id as bof_location_level_id
					from cte_new_top_bottom_data toc
						left outer join (
						select location_id ,specified_level_id ,constant_level ,level_unit, location_level_id 
						from cte_new_top_bottom_data 
						where specified_level_id = 'Bottom of Conservation' ) boc
						on toc.location_id = boc.location_id 
							left outer join (
							select location_id ,specified_level_id ,constant_level ,level_unit , location_level_id 
							from cte_new_top_bottom_data 
							where specified_level_id = 'Top of Flood' ) tof
							on toc.location_id = tof.location_id 
								left outer join (
								select location_id ,specified_level_id ,constant_level ,level_unit , location_level_id 
								from cte_new_top_bottom_data 
								where specified_level_id = 'Bottom of Flood' ) bof
								on toc.location_id = bof.location_id 
					where toc.location_id = '".$cwms_ts_id."' and toc.specified_level_id = 'Top of Conservation'
				)
				select cte_storage.date_time
					,cte_storage.value
					,cte_storage.unit_id
					,cte_storage.cwms_ts_id
					,cte_storage.location_id
					,top_bottom_data.toc 
					,top_bottom_data.toc_location_level_id 
					,top_bottom_data.boc  
					,top_bottom_data.boc_location_level_id 
					,top_bottom_data.tof  
					,top_bottom_data.tof_location_level_id 
					,top_bottom_data.bof 
					,top_bottom_data.bof_location_level_id 
				from cte_storage
					left join top_bottom_data top_bottom_data on
					cte_storage.location_id = top_bottom_data.location_id";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			$data = (object) [
				"date_time" => $row['DATE_TIME'],
				"value" => $row['VALUE'],
				"unit_id" => $row['UNIT_ID'],
				"cwms_ts_id" => $row['CWMS_TS_ID'],
				"location_id" => $row['LOCATION_ID'],
				"toc" => $row['TOC'],
				"toc_location_level_id" => $row['TOC_LOCATION_LEVEL_ID'],
				"boc" => $row['BOC'],
				"boc_location_level_id" => $row['BOC_LOCATION_LEVEL_ID'],
				"tof" => $row['TOF'],
				"tof_location_level_id" => $row['TOF_LOCATION_LEVEL_ID'],
				"bof" => $row['BOF'],
				"bof_location_level_id" => $row['BOF_LOCATION_LEVEL_ID']
			];
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);
		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_precip($db, $location_id) {
	$stmnt_query = null;
	$data = null;
	
	try {		
		$sql = "select cwms_util.split_text(cwms_ts_id, 1, '.') as location_id
					,value
					,cwms_ts_id
					,cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') as date_time
					,unit_id
				from CWMS_20.AV_TSV_DQU_30D
				where cwms_ts_id = '".$location_id."' || '.Precip.Total.~1Day.1Day.lakerep-rev'
				and (cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi')
				and unit_id = 'in'
				order by date_time desc";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			$data = (object) [
				"location_id" => $row['LOCATION_ID'],
				"value" => $row['VALUE'],
				"cwms_ts_id" => $row['CWMS_TS_ID'],
				"date_time" => $row['DATE_TIME'],
				"unit_id" => $row['UNIT_ID']
			];
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);
		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_inflow($db, $location_id) {
	$stmnt_query = null;
	$data = null;
	
	try {		
		$sql = "select cwms_util.split_text(cwms_ts_id, 1, '.') as location_id
					,value
					,cwms_ts_id
					,cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') as date_time
					,unit_id
				from cwms_v_tsv_dqu_30d 
				where cwms_ts_id like '%Flow-In.Ave.~1Day.1Day.lakerep-rev' 
				and cwms_ts_id like '".$location_id."' || '%'
				and unit_id = 'cfs'
				and (cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi')  - interval '1' day
				order by data_entry_date desc
				fetch first 1 rows only";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			$data = (object) [
				"location_id" => $row['LOCATION_ID'],
				"value" => $row['VALUE'],
				"cwms_ts_id" => $row['CWMS_TS_ID'],
				"date_time" => $row['DATE_TIME'],
				"unit_id" => $row['UNIT_ID']
			];
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);
		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_outflow($db, $location_id) {
	$stmnt_query = null;
	$data = null;
	
	try {		
		$sql = "-- EVENING
				with cte_rend_evening as (
					select 'Rend Lk-Big Muddy' as project_id 
						,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
						,round(q_tom, -1) as evening_outflow_rend
					from wm_mvs_lake.rend_flow
					order by date_time desc
					fetch first row only
				),
				cte_wappapello_evening as (
					select 'Wappapello Lk-St Francis' as project_id
						,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
						,q as evening_outflow_wappapello
					from wm_mvs_lake.wappapello_gate
					order by date_time desc
					fetch first row only
				),
				cte_shelbyville_evening as (
					select 'Lk Shelbyville-Kaskaskia' as project_id 
						,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
						,q as evening_outflow_shelbyville
					from wm_mvs_lake.shelbyville_gate
					order by date_time desc
					fetch first row only
				),
				cte_carlyle_evening as (
					select 'Carlyle Lk-Kaskaskia' as project_id 
						,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
						,q as evening_outflow_carlyle
					from wm_mvs_lake.carlyle_gate
					order by date_time desc
					fetch first row only
				),
				cte_mark_twain_evening as (
				select 
					case
						when lake = 'MT' then 'Mark Twain Lk-Salt'
					end as project_id
					,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
					,outflow as evening_outflow_mark_twain
				from wm_mvs_lake.qlev_fcst
				where (cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '0' day 
				and (cwms_util.change_timezone(fcst_date, 'UTC', 'CST6CDT')) = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '0' day
				and lake = 'MT'
				order by project_id asc
				),
				cte_all_evening_outflow as (
					select project_id, date_time, evening_outflow_rend as evening from cte_rend_evening
					union all
					select project_id, date_time, evening_outflow_wappapello as evening from cte_wappapello_evening
					union all
					select project_id, date_time, evening_outflow_shelbyville as evening from cte_shelbyville_evening
					union all    
					select project_id, date_time, evening_outflow_carlyle as evening from cte_carlyle_evening
					union all
					select project_id, date_time, evening_outflow_mark_twain as evening from cte_mark_twain_evening
				),
				-- MIDNIGHT
				cte_rend as (
				select 'Rend Lk-Big Muddy' as project_id 
					,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
					,round(q_tom, -1) as midnight_outflow_rend
				from wm_mvs_lake.rend_flow
				where cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '1' day
				),
				cte_wappapello as (
				select 'Wappapello Lk-St Francis' as project_id
					,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
					,q as midnight_outflow_wappapello
				from wm_mvs_lake.wappapello_gate
				where cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '0' day
				),
				cte_shelbyville as (
				select 'Lk Shelbyville-Kaskaskia' as project_id 
					,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
					,q as midnight_outflow_shelbyville
				from wm_mvs_lake.shelbyville_gate
				where cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '0' day
				),
				cte_carlyle as (
				select 'Carlyle Lk-Kaskaskia' as project_id 
					,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
					,q as midnight_outflow_carlyle
				from wm_mvs_lake.carlyle_gate
				where cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT') = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '0' day
				),
				cte_mark_twain as (
				select 
					case
						when lake = 'MT' then 'Mark Twain Lk-Salt'
					end as project_id
					,(cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) as date_time
					,outflow as midnight_outflow_mark_twain
				from wm_mvs_lake.qlev_fcst
				where (cwms_util.change_timezone(date_time, 'UTC', 'CST6CDT')) = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '1' day 
				and (cwms_util.change_timezone(fcst_date, 'UTC', 'CST6CDT')) = to_date(to_char((cwms_util.change_timezone(sysdate, 'UTC', 'CST6CDT')), 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '0' day
				and lake = 'MT'
				order by project_id asc
				),
				cte_bankfull as (
					select 
					case
						when location_id = 'Lk Shelbyville' then 'Lk Shelbyville-Kaskaskia'
						when location_id = 'Wappapello Lk' then 'Wappapello Lk-St Francis'
						when location_id = 'Rend Lk' then 'Rend Lk-Big Muddy'
						when location_id = 'Mark Twain Lk' then 'Mark Twain Lk-Salt'
						when location_id = 'Carlyle Lk' then 'Carlyle Lk-Kaskaskia'
					end as project_id,
					location_level_id,
					level_date,
					constant_level,
					level_unit
				from 
					cwms_20.av_location_level
				where 
					specified_level_id = 'Bankfull' 
					and location_id = 
						case
							when '".$location_id."' = 'Lk Shelbyville-Kaskaskia' then 'Lk Shelbyville'
							when '".$location_id."' = 'Wappapello Lk-St Francis' then 'Wappapello Lk'
							when '".$location_id."' = 'Rend Lk-Big Muddy' then 'Rend Lk'
							when '".$location_id."' = 'Mark Twain Lk-Salt' then 'Mark Twain Lk'
							when '".$location_id."' = 'Carlyle Lk-Kaskaskia' then 'Carlyle Lk'
						end 
					and unit_system = 'EN'
					and level_unit = 'cfs'
				),
				cte_all_midnight_outflow as (
					select project_id, date_time, midnight_outflow_rend as midnight from cte_rend
					union all
					select project_id, date_time, midnight_outflow_wappapello as midnight from cte_wappapello
					union all
					select project_id, date_time, midnight_outflow_shelbyville as midnight from cte_shelbyville
					union all    
					select project_id, date_time, midnight_outflow_carlyle as midnight from cte_carlyle
					union all
					select project_id, date_time, midnight_outflow_mark_twain as midnight from cte_mark_twain
				)
				select cte_all_midnight_outflow.project_id
					,cte_all_midnight_outflow.date_time as midnight_date_time
					,cte_all_midnight_outflow.midnight
					
					,cte_all_evening_outflow.date_time as evening_date_time
					,cte_all_evening_outflow.evening

					,bankfull.constant_level as bankfull
                    ,bankfull.level_unit as bankfull_unit
				from cte_all_midnight_outflow
					left join cte_all_evening_outflow cte_all_evening_outflow on
					cte_all_evening_outflow.project_id = cte_all_midnight_outflow.project_id 
						left join cte_bankfull bankfull on
						cte_all_evening_outflow.project_id = bankfull.project_id
				where cte_all_midnight_outflow.project_id = '".$location_id."'
				and cte_all_evening_outflow.project_id = '".$location_id."'";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			$data = (object) [
				"project_id" => $row['PROJECT_ID'],
				"midnight_date_time" => $row['MIDNIGHT_DATE_TIME'],
				"midnight" => $row['MIDNIGHT'],
				"evening_date_time" => $row['EVENING_DATE_TIME'],
				"evening" => $row['EVENING'],
				"bankfull" => $row['BANKFULL'],
				"bankfull_unit" => $row['BANKFULL_UNIT']
			];
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);
		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_rule_curve($db, $location_id) {
	$stmnt_query = null;
	$data = [];
	
	try {		
		$sql = "with cte_rule_curve_spec as (
					select 
						case
							when lake = 'SHELBYVILLE' then 'Lk Shelbyville-Kaskaskia'
							when lake = 'WAPPAPELLO' then 'Wappapello Lk-St Francis'
							when lake = 'REND' then 'Rend Lk-Big Muddy'
							when lake = 'MT' then 'Mark Twain Lk-Salt'
							when lake = 'CARLYLE' then 'Carlyle Lk-Kaskaskia'
							else 'na'
						end as project_id,
						lev
					from wm_mvs_lake.rule_curve_spec
				),
				cte_rule_curve as (           
					select 
						case
							when lake = 'SHELBYVILLE' then 'Lk Shelbyville-Kaskaskia'
							when lake = 'WAPPAPELLO' then 'Wappapello Lk-St Francis'
							when lake = 'REND' then 'Rend Lk-Big Muddy'
							when lake = 'MT' then 'Mark Twain Lk-Salt'
							when lake = 'CARLYLE' then 'Carlyle Lk-Kaskaskia'
							else 'na'
						end as project_id,
						to_number(lev) as lev -- Assuming lev is a numeric type
					from wm_mvs_lake.rule_curve
					where to_date(substr(dt_s, 1, 5) || to_char(sysdate, 'YYYY') || substr(dt_s, 6), 'MM-DDYYYY HH24:MI') <= sysdate
					and to_date(substr(dt_e, 1, 5) || to_char(sysdate, 'YYYY') || substr(dt_e, 6), 'MM-DDYYYY HH24:MI') >= sysdate
				)
				
				select project_id, lev
				from cte_rule_curve_spec
				where project_id = '".$location_id."'
				
				union all
				
				select project_id, lev
				from cte_rule_curve
				where project_id = '".$location_id."'";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			$obj = (object) [
				"project_id" => $row['PROJECT_ID'],
				"lev" => $row['LEV']		
			];
			array_push($data, $obj);
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);

		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function get_crest_forecast($db, $location_id) {
	$stmnt_query = null;
	$data = null;
	
	try {		
		$sql = "with cte_crest_data as (
					select 
						case
						when lake = 'SHELBYVILLE' then 'Lk Shelbyville-Kaskaskia'
						when lake = 'WAPPAPELLO' then 'Wappapello Lk-St Francis'
						when lake = 'REND' then 'Rend Lk-Big Muddy'
						when lake = 'MT' then 'Mark Twain Lk-Salt'
						when lake = 'CARLYLE' then 'Carlyle Lk-Kaskaskia'
							else 'na'
						end as project_id,
						crest, 
						crst_dt, 
						data_entry_dt, 
						opt
					from wm_mvs_lake.crst_fcst
					where (cwms_util.change_timezone(data_entry_dt, 'UTC', 'CST6CDT')) = to_date(to_char(current_date, 'mm-dd-yyyy') || '00:00' ,'mm-dd-yyyy hh24:mi') - interval '0' day
					order by project_id
				)
				select project_id
					,crest
					,crst_dt
					,data_entry_dt
					,opt
				from cte_crest_data
				where project_id = '".$location_id."'";
		
		$stmnt_query = oci_parse($db, $sql);
		$status = oci_execute($stmnt_query);

		while (($row = oci_fetch_array($stmnt_query, OCI_ASSOC+OCI_RETURN_NULLS)) !== false) {
			$data = (object) [
				"project_id" => $row['PROJECT_ID'],
				"crest" => $row['CREST'],
				"crst_dt" => $row['CRST_DT'],
				"data_entry_dt" => $row['DATA_ENTRY_DT'],
				"opt" => $row['OPT']
			];
		}
	}
	catch (Exception $e) {
		$e = oci_error($db);  
		trigger_error(htmlentities($e['message']), E_USER_ERROR);
		return null;
	}
	finally {
		oci_free_statement($stmnt_query); 
	}
	return $data;
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
?>
