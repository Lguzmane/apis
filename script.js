let chartInstance = null;

document.getElementById('convert-btn').addEventListener('click', async function () {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;

    if (!amount || !currency) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();

        let conversionRate = 0;
        let historicalDataKey = ''; 
        if (currency === 'dolar') {
            conversionRate = data.dolar.valor;
            historicalDataKey = 'dolar';
        } else if (currency === 'euro') {
            conversionRate = data.euro.valor;
            historicalDataKey = 'euro';
        }

        const result = (amount / conversionRate).toFixed(2);
        document.getElementById('result').textContent = `Resultado: $${result}`;

   
        const historicalResponse = await fetch(`https://mindicador.cl/api/${historicalDataKey}`);
        const historicalData = await historicalResponse.json();

        const last10Days = historicalData.serie.slice(0, 10).reverse();
        const labels = last10Days.map(item => new Date(item.fecha).toLocaleDateString());
        const values = last10Days.map(item => item.valor);


        displayChart({ labels, values });

    } catch (error) {
        document.getElementById('result').textContent = "Error al obtener los datos. Inténtalo más tarde.";
        console.error("Error fetching data:", error);
    }
});

function displayChart(historicalData) {
    const ctx = document.getElementById('historicalChart').getContext('2d');


    if (chartInstance) {
        chartInstance.destroy();
    }


    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.labels,
            datasets: [{
                label: 'Historial últimos 10 días',
                data: historicalData.values,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.3  
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}
