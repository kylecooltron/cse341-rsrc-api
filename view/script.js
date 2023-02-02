

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
        await fetch(`https://cse341-rsrc-api.onrender.com/auth`)
            .then(response => response.json())
            .then(response => {
                if (response.authorized) {
                    return {
                        name: response.name,
                        profile_id: response.profile_id
                    };
                } else {
                    return false;
                }
            })
    } catch (err) {
        console.log(err);
        return false;
    }
}

const search_submitted = () => {
    /**
     * Here's an example of how to give a fetch request a body
     */

    const search_string = document.querySelector("#search-text-input").value;
    // get other filter values and search by options here from elements
    try {
        fetch(`https://cse341-rsrc-api.onrender.com/resources`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "search_string": search_string,
                    // send filter/search by values here in body to process in the controller
                }
            )
        })
            .then(response => {
                console.log(response);
                if (Array.isArray(response)) {

                    new_constructed_resources = '';
                    response.forEach((resource) => {
                        // something like this to loop through all the resources and turn them into html elements
                        new_constructed_resources += construct_resource_element(resource);
                    })

                    // apply the new_constructed_resources to the innerHTML of search results element

                } else {
                    console.log("Unexpected result.");
                }

            })
    } catch (err) {
        console.log(err);
        return false;
    }

}


//////////////////////  DOM CONTROL
const set_auth_bar_style = (authenticated_user) => {
    const bar = document.querySelector("#auth-bar");
    if (authenticated_user) {
        bar.style.borderColor = "lime";
        bar.innerHTML = `Authentication Succesful - Welcome ${authenticated_user.name}`;
    } else {
        bar.style.borderColor = "pink";
        bar.innerHTML = "Not Authenticated - Please log in"
    }
}
const set_login_button = (authenticated_user) => {
    const login = document.querySelector("#login-or-out");
    if (authenticated_user) {
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
    const authenticated_user = await get_authentication_status();
    set_auth_bar_style(authenticated_user);
    set_login_button(authenticated_user);


    // set up listeners on search page
    const search_button = document.querySelector("#search-submit");
    if (search_button) {
        search_button.addEventListener("click", () => {
            search_submitted();
        })
    }

    // set up listeners on create resource page
    const create_button = document.querySelector("#create-submit");
    if (create_button) {
        create_button.addEventListener("click", () => {

            // call method that organizes data from form and then passes a json object to the 
            // /resources route via POST
            console.log("create button clicked");
        })
    }


}