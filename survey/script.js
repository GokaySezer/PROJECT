// Example function to send data to a server
function sendDataToServer(data) {
    fetch('/submit-survey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Thank you for your feedback!');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
