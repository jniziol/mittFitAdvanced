let myChart;

function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hrs > 0) {
    return `${hrs}hrs. ${mins}mins.`;
  } else if (mins > 0) {
    return `${mins}mins.`; 
  } else {
    return 0;
  }  
}

function createOrUpdateChart(activities) {
  if (myChart !== undefined) {
    myChart.data.labels = activities.map(activity => activity.description);
    myChart.data.datasets[0].data = activities.map(activity => Math.round(activity.calories));

    myChart.update();
  } else {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: activities.map(activity => activity.description),
          datasets: [{    
              data: activities.map(activity =>  Math.round(activity.calories)),
              label: "Calories Burned",
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 2
          }]
      },
      options: {
        title: {
          display: true,
          fontSize: 20,
          text: "Most Recent Activities"
        },       
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        maintainAspectRatio: false,
      }
    });
  }
}

export { createOrUpdateChart, formatTime }