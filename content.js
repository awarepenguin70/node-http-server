export const createList = (guitars) => `
<h2>My Guitars <a href="/add">Add new guitar</a></h2>
<ul>${guitars.map(createListItem).join('')}</ul>`;

const createListItem = ({ id, make, model }) =>
    `<li><a href="?id=${id}">${make} ${model}</a></li>`;

export const getForm = () => `
<form method="post" action="/add">
    <div>
        Make: <input type="text" name="guitar_make" required>
    </div>
    <div>
        Model: <input type="text" name="guitar_model" required>
    </div>
    <div>
        <button type="submit">Save</button>
    </div>
</form>`;

export function getGuitarContent(guitars, id) {
    const guitar = guitars.find((g) => g.id === id); // Find the guitar by `id`
    if (guitar) {
        return `
        <h1>${guitar.make} ${guitar.model}</h1>
        <p><a href="/delete/${guitar.id}">Delete</a></p>`;
    } else {
        return `<p>Guitar doesn't exist!</p>`;
    }
}

export const view = (content, guitars, id) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guitars</title>
</head>
<body style="font-size: 2rem">
    ${content}
</body>
</html>`;
