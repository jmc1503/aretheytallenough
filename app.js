document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country');
    const themeParkSelect = document.getElementById('theme-park');
    const resultContainer = document.getElementById('result-container');
    const listViewBtn = document.getElementById('list-view-btn');
    const mapViewBtn = document.getElementById('map-view-btn');
    const mapElement = document.getElementById('map');
    let map;
    let markers = [];

    // Fetch data from JSON file
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate country dropdown
            const anyOption = document.createElement('option');
            anyOption.value = '';
            anyOption.textContent = 'Any';
            countrySelect.appendChild(anyOption);
            const countries = [...new Set(data.map(item => item.Country))];
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });

            // Populate theme park dropdown
            updateThemeParkDropdown();

            // Add change event listener to country select
            countrySelect.addEventListener('change', updateThemeParkDropdown);

            function updateThemeParkDropdown() {
                const selectedCountry = countrySelect.value;
                themeParkSelect.innerHTML = '';
                const anyOption = document.createElement('option');
                anyOption.value = '';
                anyOption.textContent = 'Any';
                themeParkSelect.appendChild(anyOption);

                if (selectedCountry === '') {
                    themeParkSelect.style.display = 'none';
                } else {
                    const themeParks = [...new Set(data.filter(item => item.Country === selectedCountry).map(item => item['Theme Park']))];
                    themeParks.forEach(themePark => {
                        const option = document.createElement('option');
                        option.value = themePark;
                        option.textContent = themePark;
                        themeParkSelect.appendChild(option);
                    });
                    themeParkSelect.style.display = 'block';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Handle form submission
    document.getElementById('park-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const height = parseInt(document.getElementById('height').value);
        const country = countrySelect.value;
        const themePark = themeParkSelect.value;
        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let filteredRides = data.filter(item => {
                    return (country === '' || item.Country === country) &&
                        (themePark === '' || item['Theme Park'] === themePark) &&
                        item['Minimum Height'] <= height &&
                        item['Maximum Height'] >= height;
                });
                filteredRides.sort((a, b) => a.Ride.localeCompare(b.Ride));
                resultContainer.innerHTML = '';
                if (filteredRides.length > 0) {
                    const themeParks = [...new Set(filteredRides.map(item => item['Theme Park']))];
                    themeParks.forEach(park => {
                        const parkURL = filteredRides.find(ride => ride['Theme Park'] === park).URL;
                        const totalRidesInPark = data.filter(ride => ride['Theme Park'] === park).length;
                        const availableRidesInPark = filteredRides.filter(ride => ride['Theme Park'] === park).length;
                        const percentage = ((availableRidesInPark / totalRidesInPark) * 100).toFixed(0);
                        const parkContainer = document.createElement('div');
                        parkContainer.classList.add('park-container');
                        const parkHeader = document.createElement('h3');
                        parkHeader.innerHTML = `${park} - ${percentage}% of available rides<br><a href="${parkURL}" target="_blank">Buy Tickets</a>`;
                        parkContainer.appendChild(parkHeader);
                        const heights = [...new Set(filteredRides.filter(ride => ride['Theme Park'] === park).map(ride => ride['Minimum Height']))];
                        heights.sort((a, b) => a - b);
                        heights.forEach(height => {
                            const heightHeader = document.createElement('h4');
                            heightHeader.textContent = `Minimum Height: ${height} cm`;
                            parkContainer.appendChild(heightHeader);
                            const parkList = document.createElement('ul');
                            filteredRides.filter(ride => ride['Theme Park'] === park && ride['Minimum Height'] === height).forEach(ride => {
                                const listItem = document.createElement('li');
                                listItem.textContent = ride.Ride;
                                parkList.appendChild(listItem);
                            });
                            parkContainer.appendChild(parkList);
                        });
                        resultContainer.appendChild(parkContainer);
                    });
                    resultContainer.style.display = 'block';
                } else {
                    resultContainer.textContent = 'No rides available for your height in this theme park.';
                    resultContainer.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    // Handle view toggling
    listViewBtn.addEventListener('click', () => {
        resultContainer.style.display = 'block';
        mapElement.style.display = 'none';
    });
    mapViewBtn.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        mapElement.style.display = 'block';
        if (!map) {
            map = L.map('map').setView([51.505, -0.09], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);
        }
        markers.forEach(marker => {
            map.removeLayer(marker);
        });
        markers = [];
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const height = parseInt(document.getElementById('height').value);
                const country = countrySelect.value;
                const themePark = themePark
