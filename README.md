# covid19-va-md-dc

BLUF: consolidated spreadsheet of tallies for DC, MD, and VA.

GOAL: 
* situational awareness for my family members, extended family, and family friends at the front lines caring for COVID-19 patients.  these are hospital nurses (RNs - mostly) in the DMV region, who other than working at their home hospitals, work part time at other healthcare systems in neighboring counties.  some are General Practitioners (GPs), anesthesiologists, Pharmacists (RPh), and Certified Pharmacy Technician (CPhT). 
* please take the time to thank your healthcare staff, grocery clerks, and fellow citizens during this difficult time!  for my family, it is difficult to see how healthcare workers are overworked (since we have a few), and we can't reach them by phone because they're so busy!  i'm sure they appreciate the overtime though...

disclaimer - I try to update the data daily with automation as much as possible, so the numbers could be inaccurate.  Each jurisdiction updates their data as frequently as possible, so I pull the data at the end of the day (2100 ET).  As a result, I've included the data sources, just in case.

05 April: 
* started including MD negative test (-) results as part of daily tally.  Daily positive/confirmed tests (+) divided by total daily tests, can be an indicator of spread.  Limiting factor is the number of tests available.
* also started counting daily hospitalization and mortality rates.  These factors are most likely affected by age distribution of afflicted population.

10 April:
* DC started publishing ward data on daily briefings in April.  have begun including them on the master spreadsheet, as well as on the daily CSVs
* restructured the web dashboard to include coreJS to handle and display more data efficiently.  previous version chokes at the large geoJSON county files.  also included plotly.js to ingest daily tallies where appropriate.

11 July (upcoming major changes):
* Major: Began breaking down the spreadsheet into monthly chunks to make it easier to ingest data
* Major: VA began reporting PCR encounters/tests months ago.  I can no longer automatically process the data from VHD (too much has changed in many of the state sites to frequently check), I'll likely revert to more automated ways with resources available.  In this regard, the state of VA reports PCR encounters in a consistent manner (see /temp/VDH-COVID-19-PublicUseDataset-Tests_by-LabReportDate) as opposed to the 'Testing Encounters Total' (see /temp/__screenshot_VDH_testing).  Details of Virginia's 'Testing Encounters Total' is unclear, even as the state's DoH notes repeat tests per individual is not counted as a new testing encounter (see VDH website).  Of note, I personally do not know how The Atlantic has deviated in terms of reporting for the state of VA (https://covidtracking.com/data) but I no longer rely on the site to validate my numbers against the numbers I'm getting from the VA Department of Health (VHD).  Because Virginia's Tableau site has changed many times over the course of reporting, a screenshot capture does not capture the entirety of the details which the VDH publishes daily.
* all upcoming major changes should occur within the next two weeks.
