# Test It! Rubric
### Reflections

In our project we wanted to create a Test scoring app which autogrades students test cases for a particular function that the instructor provides in an assignment in a particular class. What we quickly realized was that this was harder than expected! As such we pivoted our idea to not autograding but still providing scores/coverages using a similarity tool/equation.

### Points Breakdown

|**Pages**|Points Received|Possible Points|Description|
| :- | :- | :- | :- |
|**Signup Page**||| Email field should be validated for UMass email. Password field should validate basic security requirements (upper case, length, numbers). Signup form data on sign up page should be collected and sent to server for user creation. Ticking the checkbox for the instructor should create two different types of accounts which reflects the type of user created. This should be indicated on the login page.|
|Can create new account.||5||
|Credentials & form validation  ||5||
|**Login Page**|||Login form email field should be preliminarily validated for UMass email. Password field should be preliminarily validated for basic requirements in the signup process. Password field visibility button should work according to the toggle. Successful login should redirect user to the dashboard home. Unsuccessful authentication should yield an error message while remaining on the same page.|
|Can login to existing acc.||5||
|Credentials & form validation  ||5||
|**Dashboard**|||Should show user details, classes, and assignments. Class and Assignment buttons should open up a modal for users to put info in. Assignments grid should be dynamic, so if the user enrolls in a new class, new  assignments should be appended to the grid. Classes grid should be dynamic, so if a user enrolls or creates a class, classes grid should reflect the new changes. Creating a class should provide the instructors with an enroll code.|
|All UI elements functional||5||
|Can create classes and Assignments (if instructor) , Can enroll in classes ( if student)||10||
|Sorting Assignments and UI Styling||10||
|**Profile**|||Should show user details, stats, and test-cases if student, assignments if instructor. Edit profile button should open up a modal where users update their information.|
|Profile is editable and UI Styling||10||
|User stats are correct, Assignments are shown for instructors and Tests are shown for students||15||
|**Assignment**|||Shows a leaderboard, displaying user and other student’s coverage for that assignment. Displays user defined tests, with coverage shown for each test.|
|Leaderboard shows accurate coverages||10||
|User test cases are given an accurate score when compared to instructor’s function||10||
|**Authentication**|||Users can signout whenever they want. After a period of inactivity, Users will automatically be logged out and will be prompted to sign in again.|
|Users can signout||5||
|Authentication||5||
|**Total**||100||