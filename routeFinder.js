const apiKey = 'API_KEY';

async function findRoute() {
    const startPoint = document.getElementById('startPoint').value;
    const destinationPoint = document.getElementById('destinationPoint').value;

    // Convert addresses to coordinates
    const startCoords = await convertAddressToCoordinates(startPoint);
    const destinationCoords = await convertAddressToCoordinates(destinationPoint);

    if (startCoords && destinationCoords) {
        const routeDetails = await getRouteDetails(startCoords, destinationCoords);
        displayRouteDetails(routeDetails);
    } else {
        alert('Failed to find coordinates for the given addresses.');
    }
}

async function convertAddressToCoordinates(address) {
    const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
        return data.items[0].position;
    }
    return null;
}

async function getRouteDetails(startCoords, destinationCoords) {
    const response = await fetch(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${startCoords.lat},${startCoords.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&return=polyline,actions,instructions&apikey=${apiKey}`);
    const data = await response.json();
    return data.routes[0].sections[0];
}

function displayRouteDetails(details) {
    const routeDetailsEl = document.getElementById('routeDetails');
    routeDetailsEl.style.display = 'block'; // Ensure the result box is displayed
    routeDetailsEl.innerHTML = `<p><strong>Instructions:</strong></p><ul>${details.actions.map(action => `<li>${action.instruction}</li>`).join('')}</ul>`;
}
