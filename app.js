/* Apply Courier New font to all elements */
* {
    font-family: 'Righteous', sans-serif;
}

body {
    background-color: #5de8d5;
    margin: 0;
    padding: 0;
}

header {
    text-align: center;
    padding: 10px 0;
}

header img {
    width: 200px;
    transition: width 0.3s;
}

header.shrink img {
    width: 100px;
}

.container {
    max-width: 1200px; /* Increase the width of the container */
    margin: 50px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 300px #007bff; /* Add slight shadow to the container */
}

form {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input, select, button {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

button {
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.find-rides-container {
    text-align: center;
}

#result-container {
    display: none;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Add gap between cards */
}

.park-card {
    width: calc(25% - 20px); /* Set the width of each card */
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Add bigger shadow to each card */
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Ensure the More Information button is at the bottom */
    border: 1px solid #C023D2; /* Add a slight shadow color */
}

.park-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.park-info {
    margin-bottom: 10px;
}

.more-info-btn {
    margin-top: auto; /* Push the button to the bottom of the card */
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    color: #007bff;
}

.buy-tickets-btn {
    margin-top: 10px;
    padding: 10px;
    text-align: center;
    display: inline-block;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 18px; /* Increase text size */
}

.view-toggle {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    display: none; /* Hide view toggle buttons initially */
}

.view-toggle button {
    width: 45%;
}

#map {
    height: 400px;
    display: none;
}

/* Modal styles */
.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fff;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

/* Media queries for responsive design */
@media (max-width: 768px) {
    header img {
        width: 150px;
    }

    header.shrink img {
        width: 80px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-field {
        width: 100%;
    }

    .park-card {
        width: calc(100% - 20px); /* Full width on smaller screens */
    }
}
