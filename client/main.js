
if (!localStorage.getItem('token')) {
    showLoginForm()
} else {
    showTodos()
}


let project = {}

let invites = ''


function notif(type, message) {
    swal({
        icon: type,
        title: message,
    })
}

function showLoginForm() {
    // event.preventDefault()
    $('#app').empty()
    $('#app').append(
        `
        <div id="form" class="container center">
        <div class="row">
          <form class="col s6 offset-s3" onsubmit="submitLogin()">
            <h4 class>Login</h4>
            <div class="row">
              <div class="input-field col s12">
                <input id="input-e" type="email" class="validate" autocomplete="off">
                <label for="email_inline">Email</label>
                <span class="helper-text" data-error="wrong email format" data-success="right"></span>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input id="input-p" type="password" class="validate">
                <label for="password">Password</label>
              </div>
            </div>
            <div class="row">
              <button
                id="login-button"
                class="waves-effect waves-light white grey-text text-darken-2 btn"
                type="submit"
              >
                <span>Login</span>
              </button>
            </div>
            <div class="row">
              <a>
                <button
                  id="register-button"
                  class="waves-effect waves-light white grey-text text-darken-2 btn"
                  onclick="showRegiserForm()"
                >
                  <span>Register</span>
                </button>
              </a>
            </div>
            <div class="row center" id="or">
                or sign in with google? 
                <div class="g-signin2" id="gsign-button" data-onsuccess="onSignIn"></div>
            </div>  
          </form>
        </div>
      </div>
        `
    )
}

function showRegiserForm() {
    event.preventDefault()
    $('#app').empty()
    console.log('msok function')
    $('#app').append(`
    <div id="form" class="container center">
    <div class="row">
      <form class="col s6 offset-s3" onsubmit="submitRegister()">
        <h4 class>Register</h4>
       
        <div class="row">
        <div class="input-field col s12">
          <input id="input-n-r" type="text" class="validate" autocomplete="off">
          <label for="input-n-r">Fullname</label>
          <span class="helper-text" data-error="wrong email format" data-success="right"></span>
        </div>
      </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="input-e-r" type="email" class="validate" autocomplete="off">
            <label for="email_inline">Email</label>
            <span class="helper-text" data-error="wrong email format" data-success="right"></span>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="input-p-r" type="password" class="validate">
            <label for="password">Password</label>
          </div>
        </div>
        <div class="row">
          <button
            id="submit-button"
            class="waves-effect waves-light white grey-text text-darken-2 btn"
            type="submit"
          >
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  </div>
    `)
}

function submitRegister() {
    event.preventDefault()
    $.post({
        url: 'http://localhost:3000/users',
        data: {
            name: $('#input-n-r').val(),
            email: $('#input-e-r').val(),
            password: $('#input-p-r').val()
        }
    })
        .done(response => {
            showLoginForm()
        })
        .fail(err => {
            console.log(err)
        })
}

function loggedin() {
    $('#app').empty()
    showTodos()
}

function submitLogin() {
    event.preventDefault()
    $.post({
        url: `http://localhost:3000/users/login`,
        data: {
            email: $('#input-e').val(),
            password: $('#input-p').val()
        }
    })
        .done((response) => {
            console.log(response)
            localStorage.setItem('token', response.token)
            localStorage.setItem('userId', response.userId)
            localStorage.setItem('type', 'manual')
            notif('success', 'login success!')
            checkInvite()
            showTodos()
        })
        .fail((err) => {
            notif('error', 'password/email wrong')
            console.log(err)
        })
}

function checkInvite() {
    $.get({
        url: 'http://localhost:3000/users/checkInvited',
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .then(response => {
            invites = response
            localStorage.setItem('invites', invites.length)
            // console.log(response, 'ini check invite=========')
        })
        .catch(err => {
            console.log(err)
        })
}

function showInvites() {
    event.preventDefault()
    $('#todos').empty()
    $.get({
        url: 'http://localhost:3000/users/checkInvited',
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .then(response => {
            console.log(response, 'inininininin===')
            if(response.length === 0) {
                $('#todos').append(`
                    <h4>you currently has no invitation from anyone.</h4>
                `)
            } else {
            $('#todos').append(`
                <h4>Invitations<h4>
                <div id="invites" class="container">
                <table class="hightlight">
                    <tbody id="invite-list">
                    </tbody>
              </table>
                </div>
            `)
                response.map(e => {
                    $('#invite-list').append(`
                    <tr>
                    <td>
                    ${e.name}
                <td>
                <td>
                    by ${e.owner.name}
                </td>
                <td>
                <a href onclick="acceptInvite('${e._id}')">accept</a>
                </td>
                <td>
                <a href onclick="declineInvite('${e._id}')">decline</a>
                </td>

                </tr>
                `)
            })
        }

        })
        .catch(err => {
            console.log(err)
        })
}

function acceptInvite(id) {
    $.ajax({
        url: `http://localhost:3000/projects/acceptInvite/${id}`,
        method: 'patch',
        data: {
            userId: localStorage.getItem('userId')
        }
    })
        .then(response => {
            let updateInvite = Number(localStorage.getItem('invites')) - 1
            localStorage.setItem(`invites`, updateInvite)
            showProjects()
        })
        .catch(err => {
            console.log(err)
        })
}

function declineInvite(id) {
    $.ajax({
        method: 'patch',
        url: `http://localhost:3000/projects/declineInvite/${id}`,
        data: {
            userId: localStorage.getItem('userId')
        }
    })
        .then(response => {
            let updateInvite = Number(localStorage.getItem('invites')) - 1
            localStorage.setItem(`invites`, updateInvite)
            showProjects()
        })
        .catch(err => {
            console.log(err)
        })
}

function showTodos() {
    $('#app').empty()

    $.get({
        url: `http://localhost:3000/users/${localStorage.getItem('userId')}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .then((response) => {
            console.log('success get data')
            console.log(response)
            if (localStorage.getItem('invites') === "0") {
                $('#app').append(
                    `
                    <ul id="sidenav-1" class="sidenav sidenav-fixed">
                    <li><a id="header-a" class="subheader">Fancy Todo</a></li>
                    <li><a id="nav-todos" href onclick="showTodos()">My Todos</a></li>
                    <li><a class="nav-body" href onclick="showProjects()">My Projects</a></li>
                    <li><a class="nav-body" href onclick="showInvites()">Invitations</a></li>
                    <a href="#" onclick="signOut();" style="color: red;">Sign out</a>
                    </ul>
                    
                    <div id="todos" class="container center">
                    <table class="hightlight">
                    <tbody id="todo-list">
                    </tbody>
                    </table>
                    </div>
                    `
                )
            } else {
                $('#app').append(
                    `
                    <ul id="sidenav-1" class="sidenav sidenav-fixed">
                    <li><a id="header-a" class="subheader">Fancy Todo</a></li>
                    <li><a id="nav-todos" href onclick="showTodos()">My Todos</a></li>
                    <li><a class="nav-body" href onclick="showProjects()">My Projects</a></li>
                    <li><a class="nav-body" href onclick="showInvites()">Invitations(${localStorage.getItem('invites')})</a></li>
                    <a href="#" onclick="signOut();" style="color: red;">Sign out</a>
                    </ul>
                    
                    <div id="todos" class="container center">
                    <table class="hightlight">
                    <tbody id="todo-list">
                    </tbody>
                    </table>
                    </div>
                    `
                )
            }

            if (response.todolist.length === 0) {
                $('#todo-list').append(`
                   <h4> your todo list is empty</4>
                   <a href onclick="showAddTodo()">add todo</a>
                   `)

            } else {
                response.todolist.map(e => {
                    console.log(e.status)
                    if (e.status === false) {
                        $('#todo-list').append(`
                             <tr>
                             <td><p>
                             <label>
                             <input type="checkbox"  onclick="todoDone('${e._id}', '${e.status}')" />
                             <span></span>
                             </label>
                             </p></td>
                             <td>
                             <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                            ${e.name}
                            </a>
                            </td>
                            <td>
                            <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                            ${e.description}
                            </a>
                            </td>
                            <td>
                            <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                            ${e.due_date.slice(0, 10)}
                            </a>
                            </td>
                            <td><a style="color: black;" href onclick="deleteTodo('${e._id}')">x</a></td>
                            </tr>
                            `)
                    } else {
                        $('#todo-list').append(`
                            <tr>
                            <td><p>
                            <label>
                            <input type="checkbox"  checked onclick="todoDone('${e._id}', '${e.status}')" />
                            <span></span>
                            </label>
                            </p></td>
                            <td>
                            <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                            <strike>
                            ${e.name}
                            </strike>
                            </a>
                            </td>
                            <td>
                            <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                            ${e.description}
                            </a>
                            </td>
                            <td>
                            <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                            ${e.due_date.slice(0, 10)}
                            </a>
                            </td>
                            <td><a style="color: black;" href onclick="deleteTodo('${e._id}')">x</a></td>
                            </tr>
                            `)
                    }
                })
                $('#todo-list').append(`
                <tr>
                <td><p>
                <label>
                <span></span>
                </label>
                </p></td>
                <td>
                </td>
                <td></td>
                <td><a href style="color: black" onclick="showAddTodo()"> add todo </a></td>
                <td></td>
                </tr>

            `)
            }
        })
        .catch(err => {
            console.log(err)
        })
}

function showProjects(params) {
    let flag = false
    if (params) {
        flag = true
    } else {
        flag = false
    }

    if (flag === false) {
        event.preventDefault()
    }

    $('#todos').empty()
    $.get({
        url: `http://localhost:3000/users/${localStorage.getItem('userId')}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .then((response) => {
            console.log(response)
            if (response.projectlist.length === 0) {
                $('#todos').append(`
                <h4>you're currently not involved in any project.</4> <br>
                <a href onclick="showAddProject()">Create a project?</a>
                `)
            } else {
                $('#todos').append(`
                <div id="projects" class="container">
                <table class="hightlight">
                    <tbody id="project-list">
                    </tbody>
              </table>
                </div>
                `)
                response.projectlist.map(e => {
                    if (e.owner._id === localStorage.getItem('userId')) {
                        $('#project-list').append(`
                            <tr>
                                <td>
                                    <a href style="color: black;" id="${e._id}">
                                    ${e.name}
                                </a>
                                <td>
                                <td>
                                owner: you
                                </td>
                                <td>
                                total tasks: ${e.todolist.length}
                                </td>
                                <td>
                                pending user: ${e.pendinglist.length}
                                </td>
                                <td>
                                active user: ${e.users.length}
                                </td>
                                <td>
                                <a href onclick="addMember('${e._id}')">add member</a>
                                </td>
                            </tr>
                        `)

                        $(`#${e._id}`).click(function (event) {
                            event.preventDefault()
                            project = e
                            // console.log(e)
                            projectDetail()
                        })
                    } else {
                        $('#project-list').append(`
                            <tr>
                                <td>
                                ${e.name}
                                <td>
                                <td>
                                owner: ${e.owner.name}
                                </td>
                                <td>
                                total tasks: ${e.todolist.length}
                                </td>
                                <td>
                                pending user: ${e.pendinglist.length}
                                </td>
                                <td>
                                active user: ${e.users.length}
                                </td>
                                <td>
                                <a href onclick="addMember('${e._id}')">add member</a>
                                </td>
                            </tr>
                        `)
                    }
                })
                $('#project-list').append(`
                <tr>
                <td><p>
                <label>
                <span></span>
                </label>
                </p></td>
                <td>
                </td>
                <td></td>
                <td><a href style="color: black" onclick="showAddProject()"> create project </a></td>
                <td></td>
                <td></td>
                </tr>

            `)
            }
        })
        .catch(err => {
            console.log(err)
        })
}

function projectDetail() {
    $('#todos').empty('')
    $('#todos').append(`
    <table>
    <thead>
      <tr>
          <th>Project: ${project.name}</th>
          <th>Owner: ${ project.owner.name}</th>
          <th></th>
      </tr>
    </thead>

    <tbody id="project-details">
    </tbody>
  </table>
    `)

    if (project.todolist.length === 0) {
        $('#project-details').append(`
           <h4> current project todo list is empty</4> <br>
           <a href onclick="showAddTodo('project')">add todo to project</a>
           `)

    } else {
        project.todolist.map(e => {
            console.log(e.status)
            if (e.status === false) {
                $('#project-details').append(`
                     <tr>
                     <td><p>
                     <label>
                     <input type="checkbox"  onclick="todoDone('${e._id}', '${e.status}', 'project')" />
                     <span></span>
                     </label>
                     </p></td>
                     <td>
                     <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                    ${e.name}
                    </a>
                    </td>
                    <td>
                    <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                    ${e.description}
                    </a>
                    </td>
                    <td>
                    <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                    ${e.due_date.slice(0, 10)}
                    </a>
                    </td>
                    <td><a style="color: black;" href onclick="deleteTodo('${e._id}', 'project')">x</a></td>
                    </tr>
                    `)
            } else {
                $('#project-details').append(`
                    <tr>
                    <td><p>
                    <label>
                    <input type="checkbox"  checked onclick="todoDone('${e._id}', '${e.status}', 'project')" />
                    <span></span>
                    </label>
                    </p></td>
                    <td>
                    <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                    <strike>
                    ${e.name}
                    </strike>
                    </a>
                    </td>
                    <td>
                    <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                    ${e.description}
                    </a>
                    </td>
                    <td>
                    <a href style="color: black;" onclick="updateTodo('${e._id}')"> 
                    ${e.due_date.slice(0, 10)}
                    </a>
                    </td>
                    <td><a style="color: black;" href onclick="deleteTodo('${e._id}', 'project')">x</a></td>
                    </tr>
                    `)
            }
        })
        $('#project-details').append(`
        <tr>
        <td><p>
        <label>
        <span></span>
        </label>
        </p></td>
        <td>
        <a href style="color: black" onclick="showAddTodo()"> add todo </a>
        </td>
        <td></td>
        <td></td>
        <td></td>
        </tr>

    `)
    }
    console.log(project)
}

function addMember(id) {
    event.preventDefault()
    $('#projects').empty()
    $('#app').append(`
    <form id="form-add-member"class="col s12" onsubmit="inviteMemberServer('${id}')">
        <h6>add new member to project?</h6>
            <div class="row">
                <div class="row">
                    <div class="input-field col s6">
                        <input id="member-email" type="text" class="validate">
                        <label for="project-email">email</label>
                    </div>
                </div>
            </div>
            <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">invite</button>
        </form>
    `)
}

function inviteMemberServer(id) {
    event.preventDefault()
    $.post({
        url: `http://localhost:3000/projects/invite/${id}`,
        data: {
            email: $('#member-email').val()
        }
    })
        .then(response => {
            notif('success', 'success invited user!')
            $('#form-add-member').empty()
            showProjects('skip')
        })
        .catch(err => {
            console.log(err)
        })
}

function showAddProject() {
    event.preventDefault()
    $('#projects').empty()
    $('#app').append(`
    <form id="form-addTodo"class="col s12" onsubmit="addNewProject()">
        <h6>add new project with your friends?</h6>
            <div class="row">
                <div class="row">
                    <div class="input-field col s6">
                        <input id="project-name" type="text" class="validate"  placeholder="name">
                        <label for="project-name">name</label>
                    </div>
                </div>
            </div>
            <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">create</button>
        </form>
    `)
}

function addNewProject() {
    $.post({
        url: 'http://localhost:3000/projects',
        data: {
            name: $('#project-name').val(),
            ownerId: localStorage.getItem('userId')
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .then(response => {
            notif('success', 'success create project!')
            showProjects()
        })
        .catch(err => {
            console.log(err)
        })
}

function updateTodo(id) {
    event.preventDefault()
    $('#todos').empty()
    $.get({
        url: `http://localhost:3000/todos/${id}`
    })
        .done(response => {
            console.log(response)
            $('#todo-list').empty()
            $('#app').append(`
    <form id="form-addTodo"class="col s12" onsubmit="updateTodoServer('${id}')">
        <h6>edit todo</h6>
            <div class="row">
            
                <div class="row">
                    <div class="input-field col s6">
                        <input id="todo-name" type="text" class="validate"  placeholder="name" value="${response.name}">
                        <label class="active" for="name">name</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="row">
                    <div class="input-field col s6">
                        <input id="description" type="text" class="validate" placeholder="description" value="${response.description}">
                        <label class="active" for="description">description</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="row">
                    <div class="input-field col s6">
                        <input id="date" type="date" class="datepicker" value="${(response.due_date.slice(0, 10))}">
                    </div>
                </div>
            </div>

            
            <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">submit</button>
        </form>
    `)
        })
        .catch(err => {
            console.log(err)
        })
}

function updateTodoServer(id) {
    event.preventDefault()
    console.log(id)
    $.ajax({
        method: 'patch',
        url: `http://localhost:3000/todos/${id}`,
        data: {
            name: $('#todo-name').val(),
            description: $('#description').val(),
            date: $('#date').val()
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            showTodos()
        })
        .fail(err => {
            console.log(err)
        })
}

function todoDone(id, status, where) {
    console.log(status)
    console.log('masokkkkk')

    let change = ''
    if (status.toString() == "false") {
        change = true
        console.log('masok 1')
    } else {
        console.log('masok 2')
        change = false
    }

    $.ajax({
        method: 'patch',
        url: `http://localhost:3000/todos/${id}`,
        data: {
            status: change
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            if (where === 'project') {
                showProjects()
            } else {
                showTodos()
            }

        })
        .fail(err => {
            console.log(err)
        })
}

function deleteTodo(id, where) {
    event.preventDefault()
    $.ajax({
        method: 'delete',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            console.log('success delete')
            if (where === 'project') {
                showProjects()
            } else {
                showTodos()
            }
        })
        .catch(err => {
            console.log(err)
        })
}

function showAddTodo(type) {
    event.preventDefault()
    $('#todos').empty()

    if (type === 'project') {
        $('#app').append(`
        <form id="form-addTodo"class="col s12" onsubmit="addTodoProjectServer()">
            <h6>add new todo now?</h6>
                <div class="row">
                
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="todo-name" type="text" class="validate"  placeholder="name">
                            <label for="name">name</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="description" type="text" class="validate" placeholder="description">
                            <label for="description">description</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="date" type="date" class="datepicker">
                        </div>
                    </div>
                </div>
    
                
                <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">add</button>
            </form>
        `)
    } else {
        $('#app').append(`
        <form id="form-addTodo"class="col s12" onsubmit="addTodoServer()">
            <h6>add new todo now?</h6>
                <div class="row">
                
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="todo-name" type="text" class="validate"  placeholder="name">
                            <label for="name">name</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="description" type="text" class="validate" placeholder="description">
                            <label for="description">description</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="date" type="date" class="datepicker">
                        </div>
                    </div>
                </div>
    
                
                <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">add</button>
            </form>
        `)
    }
}

function addTodoProjectServer() {
    event.preventDefault()
    $.post({
        url: 'http://localhost:3000/todos/byProject',
        data: {
            name: $('#todo-name').val(),
            description: $('#description').val(),
            due_date: $('#date').val(),
            userId: localStorage.getItem('userId'),
            projectId: project._id
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(response => {
            console.log('sukses tambah')
            notif('success', 'success added todo!')
            $('#form-addTodo').empty()
            showProjects()
        })
        .catch(err => {
            console.log(err)
        })
}

function addTodoServer() {
    event.preventDefault()
    $.post({
        url: 'http://localhost:3000/todos/',
        data: {
            name: $('#todo-name').val(),
            description: $('#description').val(),
            due_date: $('#date').val(),
            userId: localStorage.getItem('userId')
        },
        headers: {
            token: localStorage.getItem('token')
        }

    })
        .done(response => {
            console.log('sukses tambah')
            notif('success', 'success added todo!')
            showTodos()
        })
        .catch(err => {
            console.log(err)
        })
}



function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;


    // if (!localStorage.getItem('token')) {
    $.post('http://localhost:3000/users/g-sign', {
        token: id_token
    })
        .done(signed => {
            console.log(signed, 'ini sign-====')
            localStorage.setItem('token', signed.token)
            localStorage.setItem('userId', signed.userId)
            loggedin()

        })
        .fail(err => {
            console.log(err)
        })
    // }
}

function signOut() {
    event.preventDefault()
    if (localStorage.getItem('type') !== 'manual') {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }
    notif('success', 'logout success!')
    localStorage.clear()
    showLoginForm()
}