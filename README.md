# fancy-todo



## List of Routes:

| Route                                                        | HTTP   | Body                                                         | On Success                                  | On Error                                        | Description                                                  |
| ------------------------------------------------------------ | ------ | ------------------------------------------------------------ | ------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| <span style="color:#0000ff">/users</span>                    | GET    |                                                              | Status: 201<br />Body: all User             | Status: 500<br />Message: internal server error | Find all users info                                          |
| <span style="color:#0000ff">/users/:id</span>                | GET    |                                                              | Status: 200<br />Body: found User           | Status: 404<br />Message: not Found             | Find user by ID and get the user's info including todo list and project list of current user |
| <span style="color:#0000ff">/users</span>                    | POST   | name:String(required)<br /><br />email:String(required)<br />password:String(required) | Status:201<br />Body: new User              | Status: 500<br />Message: internal server error | Create a new user                                            |
| <span style="color:#0000ff">/users/login</span>              | POST   | email:String(required)<br />password:String(required)        | Status:200<br />Body: token, userId         | Status: 403<br />Message: email/passowrd wrong  | User Login                                                   |
| <span style="color:#0000ff">/users/:id</span>                | PUT    | name:String<br /><br />email:String                          | Status:200<br />Body: updated User          | Status: 404<br />Message: not Found             | Update a new user                                            |
| <span style="color:#0000ff">/users/:id</span>                | DELETE |                                                              | Status: 200<br />Body: Deleted User         | Status: 404<br />Message: not Found             | Delete a user                                                |
| <span style="color:#0000ff">/todos</span>                    | GET    |                                                              | Status: 200<br />Body: all Todos            | Status: 500<br />Message: internal server error | Find all todos info                                          |
| <span style="color:#0000ff">/todos/:id</span>                | GET    |                                                              | Status: 200<br />Body: found Todo           | Status: 404<br />Message: not Found             | Find todo by id                                              |
| <span style="color:#0000ff">/todos</span>                    | POST   | name:String(required)<br />userId:String(required)<br />due_date:Date(required)<br />description:String(required) | Status:201<br />Body: new Todo              | Status: 500<br />Message: internal server error | Create new todo by user                                      |
| <span style="color:#0000ff">/todos/byProject</span>          | POST   | name:String(required)<br /><br />projectId:String(required)<br />userId:String(required)<br />due_date:Date(required)<br />description:String(required) | Status:201<br />Body: new Todo              | Status: 500<br />Message: internal server error | Create new todo for project                                  |
| <span style="color:#0000ff">/todos/:id</span>                | PATCH  | name:String,<br />due_date:String<br />status:Bool           | Status: 200<br />Body: updated Todo         | Status: 404<br />Message: not Found             | Update a todo                                                |
| <span style="color:#0000ff">/todos/:id</span>                | DELETE |                                                              | Status: 200<br />Body: deleted Todo         | Status: 404<br />Message: not Found             | Delete a todo                                                |
| <span style="color:#0000ff">/projects</span>                 | GET    |                                                              | Status: 200<br />Body: all Projects         | Status: 500<br />Message: internal server error | Get all projects                                             |
| <span style="color:#0000ff">/projects</span>                 | POST   | ownerId:String(required)<br />name:String(required)          | Status: 201<br />Body: new Project          | Status: 500<br />Message: internal server error | Create a project                                             |
| <span style="color:#0000ff">/projects/:id</span>             | POST   | email:String(required)                                       | Status: 200<br />Body: current Project info | Status: 404<br />Message: not Found             | Invite a user to a project                                   |
| <span style="color:#0000ff">/projects/acceptInvite/:id</span> | PATCH  | userId:String(required)                                      | Status: 200<br />Body: current Project info | Status: 404<br />Message: not Found             | Accept invitation from a project invite                      |
| <span style="color:#0000ff">/projects/declineInvite/:id</span> | PATCH  | userId:String(required)                                      | Status: 200<br />Body: current Project info | Status: 404<br />Message: not Found             | Decline invitation from a project invite                     |

## Usage

Make sure you have Node.js and npm installed in your computer, and then run this commands in both client and server folders:

```
$npm install
```

```
$npm run dev
```

Access server side via http://localhost:3000/

Access client side via http://localhost:8080/

