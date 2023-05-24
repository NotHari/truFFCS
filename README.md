<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a>
    <img src="https://github.com/dyte-submissions/vit-hiring-2023-phase-1-NotHari/blob/master/images/logo.png" alt="Logo" width="200" height="200">
  </a>

  <h1 align="center">truFFCS</h1>

  <p align="center">
    README for truFFCS 
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->

### truFFCS

Fully Flexible Credit System commonly referred to as FFCS is a way in which students of VIT have complete freedom in tailoring their ideal timetable by picking their courses of interest under the faculties they want to take.

truFFCS is a backend repository designed to work for the conduction of FFCS allowing them to register for courses, viewing faculties that teach various courses and managing clashes while registering for these courses.

Additionally, truFFCS also contains admin routes to perform administrative actions like populating the database, creating student logins, etc.

### Problem Statement

You are the tech coordinator for VIT and you have to conduct FFCS for the current batch of
students. Let’s choose this example for our problem statement.

1. There are specific slots spread across the week. The timings and IDs of these slots
   can be configured by the administrator.
2. There are a number of faculties, the information regarding these faculties can also be
   added by the administrator.
3. Courses are allocated at specific slots, the IDs of which were configured before (in
   step 1). The administrator can specify the courses that are offered, including the IDs
   of the slots at which they’re offered and the IDs of the faculties that can take the
   courses.
4. Students can register for courses by specifying the course ID, slot ID(s), and faculty
   ID.
5. Only 1 course can be selected at a specific time slot. The selected faculty must be
   teaching the course at that slot as well.

### Built With

This section contains the major tools and languages made use of to build and test truFFCS.

[![My Skills](https://skills.thijs.gg/icons?i=nodejs,express,typescript,postgres,postman,vscode,&theme=dark)](https://skills.thijs.gg)

#### Packages Used

- Bcrypt: password hashing library to hash and store the password of admin and students in the database and password match.
- env: npm library to load the environment variables from the .env file.
- Express: Web framework for NodeJS
- jsonwebtoken: Used to create Bearer tokens to authenticate the users.
- moment: Package to parse date and time for slot clash handling
- moment-range: Package to manage date ranges for moment.js
- pg: PostgreSQL client for Node.js

<!-- GETTING STARTED -->

## Getting Started

This section contains instructions on how to set up truFFCS locally.
This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Before cloning this repository ensure that an LTS version of NodeJS is installed in your local machine.

### Installation

_This section contains the instructions to clone the repository and have truFFCS up and running on your machine._

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Go to .env and setup environment variables like shown below.
   ```js
   PORT = 5000
   ```

<!-- USAGE EXAMPLES -->

## Usage

This section of the README shows examples of how truFFCS can be used. The following link contains the Postman documentation to make use of the various routes present in truFFCS.

The Postman documentation has example responses to verify if truFFCS has been setup correctly.

Link to Postman documentation : [Postman](https://documenter.getpostman.com/view/25397475/2s93JnVSLP)

### Tokens

For testing student routes, a sample valid token for the authorization of the student is as follows:

```
STUDENT_JWT_TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwQkNFMDAwMCIsIm5hbWUiOiJBQkNERSIsImlhdCI6MTY3ODAyNDI0Nn0.KA1rWZwiKKCTFQXR-qJQHqlE_xdXOnFRmEYsGKBHsIo
```

For testing admin routes, a sample valid token for the authorization of the admin is as follows:

```
ADMIN_JWT_TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTY3NzkzOTI1OX0.0LF9BvApCtZZG4-wnSBj3R9vCS5e7KhTRaLKRLWK2g4
```

### Schema

The below image shows the ER Diagram describing the various entities and the relations between these entities.
![image](https://github.com/dyte-submissions/vit-hiring-2023-phase-1-NotHari/blob/master/images/ER.jpg)

- Admin: Holds the admin information namely id, name and password.
- Faculty: Holds the id and name.
- Student: Contains the id, name and password of a student.
- Slots: Holds the id of a slot and the timings of the slots.
- Course: Contains id of the course, name of the course, course type, ids of faculties teaching the course and id of all the slots that the course is being offered in.
- Registered Courses: Contains the student id, slot ids of all the registered courses, the course id of registered courses and the faculty id under whom the student registered for a course.

<!-- LICENSE -->

## License

Distributed under the MIT License.

<!-- CONTACT -->

## Contact

Harikrishnan Nair - [LinkedIn](https://www.linkedin.com/in/harikrishnan-nair-04a4b219b/)

<p align="center">Made with ❤ by Harikrishnan Nair</p>
