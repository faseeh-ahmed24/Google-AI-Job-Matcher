# AI Job Matcher

An AI-powered job application assistant built with **Google Apps Script** that compares a user's resume against a job description and evaluates how well they match.

## Features

* **Job Match Score** — Generates a score out of 100 based on the compatibility between the resume and job description.
* **Missing Skills** — Identifies important skills and qualifications from the job posting that are not clearly present in the resume.
* **Application Recommendation** — Provides a **Yes/No recommendation** on whether the user should consider applying.
* **AI-Powered Analysis** — Uses an AI API to analyze the job description and resume.
* **Google Workspace Integration** — Built using Google Apps Script and can interact with Google Workspace services.

## How It Works

1. The user enters or pastes their **resume**.
2. The user pastes a **job description**.
3. The application sends the information to an AI model for analysis.
4. The AI evaluates the candidate's experience, skills, and qualifications against the job requirements.
5. The application returns:

   * A match score out of 100
   * Matching skills
   * Missing skills
   * A recommendation on whether to apply

## Screenshots

### Main Interface

<img width="836" height="687" alt="image" src="https://github.com/user-attachments/assets/c60993b0-3353-4cfd-b2c7-6201c9e263ab" />


### Candidate Profile Section

<img width="861" height="696" alt="image" src="https://github.com/user-attachments/assets/ba1b7af4-52e3-42fc-a1d2-14353ee7cf10" />



### Google Apps Script

<img width="1180" height="923" alt="image" src="https://github.com/user-attachments/assets/1c9ac849-3e73-4380-a22c-998272f98804" />


## Technologies Used

* **Google Apps Script**
* **JavaScript**
* **Google Workspace**
* **Google Sheets / Forms** (if applicable)
* **AI API**

## Example Use Case

A user finds a Software Developer internship and wants to quickly determine whether their current resume is a good fit.

They paste their resume and the job description into the application. The AI analyzes both and might return:

```text
Match Score: 82/100

Recommendation: YES

Strong Matches:
- JavaScript
- Python
- Git/GitHub
- REST APIs
- Automation

Missing Skills:
- React
- Docker
- AWS
```

This allows the user to quickly identify gaps in their qualifications and decide whether to apply.

## Setup

1. Open the project in **Google Apps Script**.
2. Add your AI API credentials using **Script Properties**.
3. Configure the API settings in the script.
4. Run the application through the configured Google Apps Script interface.

> **Security:** Never upload API keys or other credentials directly to GitHub. Store sensitive credentials using Google Apps Script's `PropertiesService`.

## Future Improvements

* Add job description URL importing.
* Support multiple AI models.
* Save previous job analyses.
* Add resume improvement suggestions.
* Provide more detailed explanations for match scores.
* Add keyword and ATS optimization analysis.

## Author

**Faseeh Ahmed**

Built as a personal project to explore **AI API integration, automation, JavaScript, and Google Apps Script**.
