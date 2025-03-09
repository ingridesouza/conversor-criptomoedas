document.getElementById('converter-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const amount = document.getElementById('amount').value;

    fetch('/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, amount }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('result').innerText = data.error;
        } else {
            document.getElementById('result').innerText = 
                `${data.amount} ${data.from} = ${data.converted_amount} ${data.to} (Taxa: ${data.rate})`;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});