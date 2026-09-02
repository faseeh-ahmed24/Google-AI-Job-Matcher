

function onOpen() {

  SpreadsheetApp.getUi()
    .createMenu("Excecute Job Match")
    .addItem("Analyze Job", "analyzeJob")
    .addToUi();

}


function analyzeJob() {

  // Get the spreadsheet we're currently working in.
  const spreadsheet =
    SpreadsheetApp.getActiveSpreadsheet();


  // Get the sheet containing our job applications.
  const sheet =
    spreadsheet.getSheetByName("Dashboard");


  // Make sure the Applications sheet exists.
  if (!sheet) {

    SpreadsheetApp.getUi().alert(
      'Could not find a sheet named "Dashboard".'
    );

    return;
  }


  // Get the row of the cell we currently have selected.
  const row =
    sheet.getActiveCell().getRow();


  // Don't allow the header row to be analyzed.
  if (row === 1) {

    SpreadsheetApp.getUi().alert(
      "Select a job description first."
    );

    return;
  }


  // ----------------------------------------------------------
  // GET JOB DESCRIPTION
  // ----------------------------------------------------------

  /*
   * Column C contains the job description.
   *
   * Example:
   *
   * A2 = "Looking for a Software Engineering Intern..."
   */

  //if i change what column somthing is in just change the offset here (column a + 2 = column c)
  const OFFSET = 2;
  const jobDescription =
    sheet.getRange(row, 1 + OFFSET).getValue();


  // Make sure there is actually a job description.
  if (!jobDescription) {

    SpreadsheetApp.getUi().alert(
      "This row does not contain a job description."
    );

    return;
  }


  // GET MY EXPERIENCE / SKILLS

  const profileSheet =
    spreadsheet.getSheetByName("Candidate Profile");


  // Make sure the profile sheet exists.
  if (!profileSheet) {

    SpreadsheetApp.getUi().alert(
      'Could not find a sheet named "Candidate Profile".'
    );

    return;
  }


  // Get our entire candidate profile from A2.
  const candidateProfile =
    profileSheet.getRange("A2").getValue();



  // CREATE PROMPT
  const prompt = `

You are an expert technical recruiter.

Compare the candidate's experience, projects,
education, and technical skills against the job
description below.

========================
CANDIDATE PROFILE
========================

${candidateProfile}


========================
JOB DESCRIPTION
========================

${jobDescription}


========================
INSTRUCTIONS
========================

Give the candidate a realistic match score from
0 to 100.

The score should represent how well the candidate
actually matches the requirements of the job.

Only consider skills and experience explicitly
present in the candidate profile.

Do NOT assume the candidate has skills they did
not list.

Identify the most important technical skills,
qualifications, or experience required by the job
that the candidate is missing.

Then determine whether applying is recommended.

Return EXACTLY this format:

SCORE: [number from 0-100]

MISSING_SKILLS: [comma-separated list]

STATUS: [YES or NO]

Do not include anything else.
`;



  // SEND PROMPT TO GEMINI


  const response =
    callGemini(prompt);



  // EXTRACT THE THREE RESULTS


  const result =
    parseResult(response);


  // WRITE RESULTS TO SHEET


  /*
   * Column D = Score
   * Column E = Missing Skills
   * Column F = Status
   */

  sheet
    .getRange(row, 2 + OFFSET)
    .setValue(result.score);

  sheet
    .getRange(row, 3 + OFFSET)
    .setValue(result.missingSkills);

  sheet
    .getRange(row, 4 + OFFSET)
    .setValue(result.status);


  // Tell the user we're finished.
  SpreadsheetApp.getUi().alert(
    "Job analysis complete!"
  );

}


/**
 * This function handles communication with Google's API.
 *
 * INPUT:
 *   prompt
 *
 * OUTPUT:
 *   Gemini's text response
 */
function callGemini(prompt) {

  /*
   * The API key is stored in:
   *
   * Apps Script
   * - Project Settings
   *  - Script Properties
   *
   * Property name:
   *
   * GEMINI_API_KEY
   *
   */

  const apiKey =
    PropertiesService
      .getScriptProperties()
      .getProperty("GEMINI_API_KEY");


  // Stop if the API key wasn't configured.
  if (!apiKey) {

    throw new Error(
      "GEMINI_API_KEY was not found in Script Properties."
    );

  }



  // GEMINI API URL


  /*
   * This is Google's generateContent endpoint.
   *
   * We send our prompt to this URL.
   */

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";



  // CREATE REQUEST DATA


  /*
   * Gemini expects the prompt inside this structure:
   *
   * contents
   *   - parts
   *      - text
   */

  const payload = {

    contents: [

      {

        parts: [

          {
            text: prompt
          }

        ]

      }

    ]

  };


  // REQUEST OPTIONS

  const options = {

    method: "POST",

    contentType: "application/json",

    headers: {

      "x-goog-api-key": apiKey

    },

    payload: JSON.stringify(payload),

    muteHttpExceptions: true

  };



  // ACTUALLY SEND REQUEST


  const response =
    UrlFetchApp.fetch(url, options);


  // Get the HTTP status code.
  const statusCode =
    response.getResponseCode();


  // Get Google's response as text.
  const responseText =
    response.getContentText();


  // CHECK FOR ERRORS

  if (statusCode < 200 || statusCode >= 300) {

    throw new Error(
      "Gemini API Error (" +
      statusCode +
      "): " +
      responseText
    );

  }


  // CONVERT JSON TO JAVASCRIPT OBJECT


  const data =
    JSON.parse(responseText);



  // GET GEMINI'S ACTUAL ANSWER


  return data
    .candidates[0]
    .content
    .parts[0]
    .text;

}


/**
 * ------------------------------------------------------------
 * PARSE GEMINI RESPONSE
 * ------------------------------------------------------------
 *
 * Gemini should return:
 *
 * SCORE: 82
 * MISSING_SKILLS: AWS, Docker
 * STATUS: YES
 *
 * This function separates those three pieces.
 */
function parseResult(text) {

  // Find the score.
  const score =
    text.match(/SCORE:\s*(\d+)/i);


  // Find missing skills.
  const missing =
    text.match(/MISSING_SKILLS:\s*(.*)/i);


  // Find YES or NO.
  const status =
    text.match(/STATUS:\s*(YES|NO)/i);


  // Return the organized results.
  return {

    score:
      score ? score[1] : "",
      

    missingSkills:
      missing ? missing[1].trim() : "",

    status:
      status ? status[1].toUpperCase() : ""

  };

}