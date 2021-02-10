import Activity from './activity.js';
import { createOrUpdateChart, formatTime } from './helpers.js'

export default class ActivityTracker {
  static getAllActivities() {
    const activitiesJSON = JSON.parse(localStorage.getItem('activities')) || []; 

    const activities = activitiesJSON.map((activity) => {
      return new Activity(
        activity.description,
        activity.time,
        activity.intensity,
        activity.person,
        new Date(activity.date),
        activity.id,
      );
    });   

    return activities
  }

  constructor(person) {
    this.person = person;
    this.activities = ActivityTracker.getAllActivities();
    this.updateDOM();
  }

  addActivity(description, time, intensity) {
    const activity = Activity.create(description, time, intensity, this.person)
    this.activities.push(activity);
    this.afterUpdate();
  }

  removeActivity(id) {
    const activityIndex = this.activities.findIndex((activity) => id == activity.id);
    this.activities.splice(activityIndex, 1);
    this.afterUpdate();
  }

  afterUpdate() {
    this.sortBy('date', 'desc');
    localStorage.setItem('activities', JSON.stringify([...this.activities]));
    this.updateDOM();
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

  updateDOM() {
    createOrUpdateChart(this.activities.slice(0, 5));
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
    console.log(this.activities);
    this.activities.sort((a, b) => {
      if (a[field] !== '' && b[field] !== '' && !isNaN(a[field]) && !isNaN(b[field])) {
        return direction === 'asc' ? a[field] - b[field] :  b[field] - a[field];
      } else {
        return direction === 'asc' ? a[field].toString().localeCompare(b[field]) : b[field].toString().localeCompare(a[field]);
      }
    });

    return this.activities;
  }

  redrawTable() {
    const activitiesTable = document.querySelector("section.activities table tbody");

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
