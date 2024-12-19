import { createServer } from 'http';
import guitars from './data.js';
import { createList, getForm, getGuitarContent, view } from "./content.js";

const server = createServer((request, response) => {
    // Split the URL to get route parts
    const parts = request.url.split('/');
    const url = new URL(request.url, 'http://localhost');
    const id = url.searchParams.get('id'); // Extract the `id` parameter from the URL

    // Handling the delete action
    if (parts.includes('delete')) {
        handleDelete(parseInt(parts[2], 10)); // Convert `id` to a number
        redirect(response, '/'); // Redirect to the main page
    } else if (parts.includes('add') && request.method === 'GET') {
        // Handle GET request to show the add form
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        const content = getForm(); // Show the form to add a new guitar
        response.end(view(content, guitars, id)); // Render the page with the form
    } else if (request.method === 'POST' && parts.includes('add')) {
        // Handle POST request to add a new guitar
        handleAdd(request, response);
    } else {
        // Default route to show the list of guitars or specific guitar details
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        let content = '';

        if (id) {
            const guitar = guitars.find(g => g.id === parseInt(id, 10)); // Find the guitar by id
            if (guitar) {
                content = getGuitarContent(guitars, parseInt(id, 10)); // Display guitar details
            } else {
                content = `<p>Guitar doesn't exist!</p>`;
            }
        } else {
            content = createList(guitars); // Show the list of guitars
        }

        response.end(view(content, guitars, id)); // Render the final view
    }
});

// Handle POST request to add a new guitar
function handleAdd(request, response) {
    let body = '';

    request.on('data', chunk => {
        body += chunk;
    });

    request.on('end', () => {
        const data = new URLSearchParams(body);
        const newGuitar = {
            id: guitars.length + 1, // Simple id assignment based on the current size
            make: data.get('guitar_make'),
            model: data.get('guitar_model'),
        };

        guitars.push(newGuitar); // Add the new guitar to the list
        redirect(response, '/'); // Redirect back to the main page after adding
    });
}

// Delete handler to remove a guitar by id
function handleDelete(id) {
    const index = guitars.findIndex((guitar) => guitar.id === id);
    if (index !== -1) {
        guitars.splice(index, 1); // Remove the guitar from the list
    }
}

// Function to redirect the response to another URL
function redirect(response, to) {
    response.writeHead(302, {
        'Location': to,
        'Content-Type': 'text/plain; charset=utf-8'
    });
    response.end('Redirecting...');
}

// Start the server
server.listen(80, () => {
    console.log(`Server is listening at http://localhost:${server.address().port}`);
});
