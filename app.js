const form = document.querySelector('form');
const activitiesTable = document.querySelector("section.activities table tbody");
const activityHeader = document.querySelector('.activity-header');
const formValidator = new Validator(form);

form.onsubmit = function(e) {
  if (formValidator.validate()) {
    const descriptionInput = document.querySelector("#description-input");
    const timeInput = document.querySelector("#time-input");
    const intensityInput = document.querySelector("#intensity-input");
    activityTracker.addActivity(descriptionInput.value, parseInt(timeInput.value), parseInt(intensityInput.value));
    
    descriptionInput.value = "";
    timeInput.value = "";
    intensityInput.value = "";
  }

  e.preventDefault();
}

activitiesTable.onclick = function(e) {
  if (e.target.classList.contains('la-times')) {
    const activityID = e.target.closest(".activity").dataset.id;
    activityTracker.removeActivity(activityID);
  }
}

activityHeader.onclick = function(e) {
  const closestTH = e.target.closest('th');
  if (closestTH.nodeName === "TH") {
    const icon = activityHeader.querySelector('i');
    if (icon) icon.remove();
    activityTracker.sortBy(closestTH.dataset.sortCategory, closestTH.dataset.sortOrder);
    const arrow =  "asc" === closestTH.dataset.sortOrder ? `<i class="las la-angle-up"></i>` : `<i class="las la-angle-down"></i>`
    closestTH.insertAdjacentHTML('beforeend', arrow);
    closestTH.dataset.sortOrder = "asc" === closestTH.dataset.sortOrder ? "desc" : "asc"
    activityTracker.redrawTable();
  }
}

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

class Activity {
  constructor(description, time, intensity, person, id, date) {
    this.description = description;
    this.time = time;
    this.intensity = intensity;
    this.id = id;
    this.person = person;
    this.date = date;
    this.calories = ((this.intensity * this.person.weight) / 60) * this.time;
  }

  formattedTime() {
    return formatTime(this.time);
  }

  formattedDate() {
    return `${this.date.toLocaleDateString('en-us', {month: "long", day: "numeric", year: "numeric"})}`
  }
}

class ActivityTracker {
  constructor(person) {
    this.person = person;
    this.activities = [];
    this.id = 0;

    for(const activity of data) {
      this.activities.push(
        new Activity(
          activity.description,
          activity.time,
          activity.intensity,
          this.person,
          this.id++,
          activity.date,
        )
      );
    };

    this.redraw();
    
  }

  addActivity(description, time, intensity, date = new Date()) {
    this.activities.push(
      new Activity(
        description,
        time,
        intensity,
        this.person,
        this.id++,
        date,
      )
    );

    this.sortBy('date', 'desc');
    updateChartData();
    this.redraw();
  }

  removeActivity(id) {
    const activityIndex = this.activities.findIndex((activity) => id == activity.id);
    this.activities.splice(activityIndex, 1);
    this.redraw();
  }

  averageCalories() {
    return Math.floor(this.totalCalories() / this.activities.length) || 0;
  }

  totalFormattedTime() {
    const totalTime = this.activities.reduce((acc, activity) => {
      return acc += activity.time;
    }, 0);

    return formatTime(totalTime);
  }

  totalCalories() {
    return Math.floor(this.activities.reduce((acc, activity) => {
      return (acc += activity.calories);
    }, 0));
  }

  redraw() {
    this.updateheader();
    this.redrawTable();
  }

  updateheader() {
    const activitiesTotal = document.querySelector("#activities-total h3");
    const timeTotal = document.querySelector("#time-total h3");
    const averageCaloriesTotal = document.querySelector("#average-calories-total h3");
    const caloriesTotal = document.querySelector("#calories-total h3");

    activitiesTotal.textContent = this.activities.length;
    timeTotal.textContent = this.totalFormattedTime();
    averageCaloriesTotal.textContent = this.averageCalories();
    caloriesTotal.textContent = this.totalCalories();
  }

  sortBy(field, direction = 'asc') {
    this.activities.sort((a, b) => {
      if (a[field] !== '' && b[field] !== '' && !isNaN(a[field]) && !isNaN(b[field])) {
        return direction === 'asc' ? a[field] - b[field] :  b[field] - a[field];
      } else {
        return direction === 'asc' ? a[field].toString().localeCompare(b[field]) : b[field].toString().localeCompare(a[field]);
      }
    });

    return this;
  }

  redrawTable() {
    activitiesTable.textContent = "";

    for(const activity of this.activities) {
      activitiesTable.insertAdjacentHTML("beforeEnd",`
        <tr class="activity" data-id="${activity.id}">
          <td class="description">${activity.description}</td>
          <td class="calories">${Math.round(activity.calories)}</td>
          <td class="time">${activity.formattedTime()}</td>
          <td class="date">${activity.formattedDate()}</td>
          <td class="close"><i class="las la-times"></i></i></td>
        </tr>
      `);
    }
  }
}

class Person {
  constructor(name, weight, height, age) {
    this.weight = weight;
    this.height = height;
    this.age = age;
    this.name = name;
  }
}

const john = new Person("John", 86, 190, 40);
const activityTracker = new ActivityTracker(john);




const recentActivities = activityTracker.sortBy('date', 'asc').activities.slice(activityTracker.activities.length - 5, activityTracker.activities.length)

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: recentActivities.map(activity => activity.description),
        datasets: [{    
            data: recentActivities.map(activity =>  Math.round(activity.calories)),
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

function updateChartData() {
  const recentActivities = activityTracker.activities.slice(0, 5);

  myChart.data.labels = recentActivities.map(activity => activity.description);
  myChart.data.datasets.data = recentActivities.map(activity => Math.round(activity.calories));

  myChart.update();
}