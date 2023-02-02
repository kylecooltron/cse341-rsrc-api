

//////////////////////  CONSTRUCT DOM ELEMENTS
const construct_resource_element = (body) => {
    /**
     * Constructs html elements to display a resource
     */
    // construct lesson numbers list
    lesson_numbers = '<ul>';
    body.lesson_numbers.forEach((lesson) => {
        lesson_numbers += `
            <li>
            Lesson ${lesson}
            </li>
        `
    })
    lesson_numbers += '</ul>';
    // construct links list
    links = '<ul>';
    body.links.forEach((link) => {
        links += `
            <li>
                <a href='${link}'>
                    ${link}
                </a>
            </li>
        `
    })
    links += '</ul>';
    // construct tags list
    tags = '';
    body.search_tags.forEach((tag) => {
        tags += `
            <a href='#'>
                ${tag}
            </a>
        `
    })
    /* TODO: need to construct contributing authors list
        which will have to run queries to get the authors name based on their id's
        stored in this resource

        TODO: same thing with technologies/tags
    */
    return `
    <div class="resource">
        <h3>${body.title}</h3>
        <h4>Subject</h4>
        <div>${body.subject}</div>
        <h4>Description</h4>
        <p>${body.description}</p>
        <h4>Details</h4>
        <dl>
            <dt>Date Created</dt>
            <dd>${body.date_created}</dd>

            <dt>Last Modified</dt>
            <dd>${body.last_modified}</dd>

            <dt>Related Lessons</dt>
            <dd>${lesson_numbers}</dd>

            <dt>Helpful Links</dt>
            <dd>${links}</dd>
        </dl>

        <div class='tags-box'>
            ${tags}
        </div>
    
    </div>
    `;
}



//////////////////////  QUERIES
const construct_example_container = (container) => {
    try {
        fetch(`https://cse341-rsrc-api.onrender.com/resources/`)
            .then(response => response.json())
            .then(response => {
                container.innerHTML = construct_resource_element(
                    response[0]
                )
            })
    } catch {
        container.innerHTML = "some error";
    }
}

const get_authentication_status = async () => {
    /**
     * This method will also save the users data to the database
     */
    try {
        fetch(`https://cse341-rsrc-api.onrender.com/auth`)
            .then(response => response.json())
            .then(response => {
                if (response.authorized) {
                    return true;
                } else {
                    return false;
                }
            })
    } catch (err) {
        console.log(err);
        return false;
    }
}



//////////////////////  DOM CONTROL
const set_auth_bar_style = (authenticated) => {
    const bar = document.querySelector("#auth-bar");
    if (authenticated) {
        bar.style.borderColor = "lime";
        bar.innerHTML = "Authentication Succesful";
    } else {
        bar.style.borderColor = "pink";
        bar.innerHTML = "Not Authenticated - Please log in"
    }
}
const set_login_button = (authenticated) => {
    const login = document.querySelector("#login-or-out");
    if (authenticated) {
        login.innerHTML = "Log Out";
        login.href = "https://cse341-rsrc-api.onrender.com/logout";
    } else {
        login.innerHTML = "Login";
        login.href = "https://cse341-rsrc-api.onrender.com/login";
    }
}



window.onload = async () => {

    // set up example container on home page
    const example_container = document.querySelector("#resource-example-container");
    if (example_container) {
        construct_example_container(
            example_container
        );
    }

    // check if user is authenticated
    const authenticated = await get_authentication_status();
    set_auth_bar_style(authenticated);
    set_login_button(authenticated);





}