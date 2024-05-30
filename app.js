document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country');
    const themeParkSelect = document.getElementById('theme-park');
    const resultContainer = document.getElementById('result-container');
    const modal = document.getElementById('modal');
    const rideInfoContainer = document.getElementById('ride-info');
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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Handle country change event
    countrySelect.addEventListener('change', () => {
        const selectedCountry = countrySelect.value;
        themeParkSelect.innerHTML = '';
        const anyOption = document.createElement('option');
        anyOption.value = '';
        anyOption.textContent = 'Any';
        themeParkSelect.appendChild(anyOption);

        if (selectedCountry === '') {
            themeParkSelect.style.display = 'none'; // Hide theme park dropdown
        } else {
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    const filteredData = selectedCountry === '' ? data : data.filter(item => item.Country === selectedCountry);
                    const themeParks = [...new Set(filteredData.map(item => item['Theme Park'] || 'Unknown'))];
                    themeParks.forEach(themePark => {
                        const option = document.createElement('option');
                        option.value = themePark;
                        option.textContent = themePark;
                        themeParkSelect.appendChild(option);
                    });
                    themeParkSelect.style.display = 'block'; // Show theme park dropdown
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
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

                filteredRides.sort((a, b) => {
                    const aTotalRidesInPark = data.filter(ride => ride['Theme Park'] === a['Theme Park']).length;
                    const aAvailableRidesInPark = filteredRides.filter(ride => ride['Theme Park'] === a['Theme Park']).length;
                    const aPercentage = (aAvailableRidesInPark / aTotalRidesInPark) * 100;

                    const bTotalRidesInPark = data.filter(ride => ride['Theme Park'] === b['Theme Park']).length;
                    const bAvailableRidesInPark = filteredRides.filter(ride => ride['Theme Park'] === b['Theme Park']).length;
                    const bPercentage = (bAvailableRidesInPark / bTotalRidesInPark) * 100;

                    if (bPercentage === aPercentage) {
                        return a['Theme Park'].localeCompare(b['Theme Park']);
                    }

                    return bPercentage - aPercentage;
                });

                resultContainer.innerHTML = '';

                if (filteredRides.length > 0) {
                    const themeParks = [...new Set(filteredRides.map(item => item['Theme Park']))];

                    themeParks.forEach(park => {
                        const parkURL = filteredRides.find(ride => ride['Theme Park'] === park).URL;
                        const totalRidesInPark = data.filter(ride => ride['Theme Park'] === park).length;
                        const availableRidesInPark = filteredRides.filter(ride => ride['Theme Park'] === park).length;
                        const percentage = ((available
                        const percentage = ((availableRidesInPark / totalRidesInPark) * 100).toFixed(0);

                        const parkCard = document.createElement('div');
                        parkCard.classList.add('park-card');

                        const parkHeader = document.createElement('h3');
                        parkHeader.classList.add('park-header');
                        parkHeader.innerHTML = `${park}`;
                        parkCard.appendChild(parkHeader);

                        const parkInfo = document.createElement('p');
                        parkInfo.classList.add('park-info');
                        parkInfo.innerHTML = `${percentage}% of available rides<br>${parkURL ? `<a href="${parkURL}" target="_blank">Buy Tickets</a>` : ''}`;
                        parkCard.appendChild(parkInfo);

                        const moreInfoButton = document.createElement('button');
                        moreInfoButton.textContent = 'More Information';
                        moreInfoButton.addEventListener('click', () => {
                            showRideInfoModal(park, filteredRides.filter(ride => ride['Theme Park'] === park));
                        });
                        parkCard.appendChild(moreInfoButton);

                        resultContainer.appendChild(parkCard);
                    });

                    resultContainer.style.display = 'flex';
                } else {
                    resultContainer.textContent = 'No rides available for your height in this theme park.';
                    resultContainer.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    // Show ride info modal
    function showRideInfoModal(themePark, rides) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = `${themePark} Ride Information`;
        modalBody.innerHTML = '';

        rides.forEach(ride => {
            const rideHeader = document.createElement('h4');
            rideHeader.textContent = `${ride.Ride}`;

            const minHeight = document.createElement('p');
            minHeight.textContent = `Minimum Height: ${ride['Minimum Height']} cm`;

            modalBody.appendChild(rideHeader);
            modalBody.appendChild(minHeight);
        });

        modal.style.display = 'block';
    }

    // Hide ride info modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Initialize map
    function initMap() {
        map = new google.maps.Map(mapElement, {
            center: { lat: 0, lng: 0 },
            zoom: 2
        });
    }

    // Switch to list view
    listViewBtn.addEventListener('click', () => {
        resultContainer.style.display = 'flex';
        mapElement.style.display = 'none';
    });

    // Switch to map view
    mapViewBtn.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        mapElement.style.display = 'block';
        if (!map) {
            initMap();
        }

        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const filteredRides = data.filter(item => {
                    return (country === '' || item.Country === country) &&
                        (themePark === '' || item['Theme Park'] === themePark) &&
                        item['Minimum Height'] <= height &&
                        item['Maximum Height'] >= height;
                });

                markers.forEach(marker => marker.setMap(null));
                markers = [];

                filteredRides.forEach(ride => {
                    const marker = new google.maps.Marker({
                        position: { lat: parseFloat(ride.Latitude), lng: parseFloat(ride.Longitude) },
                        map: map,
                        title: ride['Theme Park']
                    });
                    markers.push(marker);
                });

                if (markers.length > 0) {
                    const bounds = new google.maps.LatLngBounds();
                    markers.forEach(marker => bounds.extend(marker.getPosition()));
                    map.fitBounds(bounds);
                }
            });
    });
});
