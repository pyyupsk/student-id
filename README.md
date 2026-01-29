# Student ID Lookup

A common pattern in Thai educational websites is fetching **all student records** to the browser and searching in-memory. This means every visitor can open DevTools and see every student's national ID and full name — and they have to wait for the entire dataset to download just to look up one record.

This project demonstrates a better approach using the same simple tech stack (Google Apps Script + Google Sheets + vanilla HTML/JS).

![Google Apps Script](https://img.shields.io/badge/Backend-Google%20Apps%20Script-4285F4?logo=google&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/Markup-HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/Styling-CSS3-1572B6?logo=css3&logoColor=white)

## What This Project Does

- **Server-side search** — only the matched record is returned, not the entire dataset
- **Name masking** — full names are masked before leaving the server (e.g. `สมชาย ใจดี` → `ส**** ใ****`)
- **Input validation** — 13-digit check on both client and server

The student's full name is **never sent to the client**.

> For real security, a proper backend with authentication, rate limiting, and encrypted storage would be more appropriate. This repo is intentionally limited to a simple tech stack to show that even minimal changes can significantly reduce data exposure.

<details>
<summary>Google Sheet structure</summary>

| Column | Content                      |
| ------ | ---------------------------- |
| A      | เลขบัตรประชาชน (National ID) |
| B      | ชื่อ-สกุล (Full name)        |
| C      | รหัสนักศึกษา (Student ID)    |

Row 1 is headers, data starts from row 2.

</details>

<details>
<summary>Mock-up data for testing</summary>

| เลขบัตรประชาชน | ชื่อ-สกุล      | รหัสนักศึกษา |
| -------------- | -------------- | ------------ |
| 1450200389123  | สมชาย ใจดี     | 660110001    |
| 1103700492851  | วรรณา รักเรียน | 660110002    |
| 3501234567890  | กิตติ พัฒนา    | 660110003    |
| 2345678901234  | มานี มีตา      | 660110004    |
| 5987654321012  | ปิติ ชูใจ      | 660110005    |
| 1999988887777  | Sarah Jones    | 660110006    |
| 1123456789012  | วีระพล กล้าหาญ | 660110007    |

</details>

## Project Structure

```
├── script/
│   └── api.gs            # Google Apps Script backend
├── www/
│   ├── index.html        # Main page
│   ├── css/style.css     # Styles
│   └── js/main.js        # Frontend logic
└── Makefile              # Dev commands
```

## Getting Started

### Prerequisites

- Python 3 (for local dev server)
- [Prettier](https://prettier.io/) (optional, for formatting)
- A Google Sheet with student data
- Google Apps Script deployment URL

### Setup

1. Clone the repo

   ```bash
   git clone git@github.com:pyyupsk/student-id.git
   cd student-id
   ```

2. Deploy `script/api.gs` as a Google Apps Script web app

3. Update the `API_URL` in `www/js/main.js` with your deployment URL

4. Start the dev server

   ```bash
   make serve
   ```

   Open `http://localhost:8000`

## Scripts

| Command       | Description                         |
| ------------- | ----------------------------------- |
| `make serve`  | Start local dev server on port 8000 |
| `make format` | Format HTML/CSS/JS with Prettier    |

## License

This project is licensed under the [MIT License](LICENSE).
