import ActivityTracker from './activity_tracker.js';
import Person from './person.js';
import Validator from './validator.js';

const form = document.querySelector('form');
const activitiesTable = document.querySelector("section.activities table tbody");
const activityHeader = document.querySelector('.activity-header');
const formValidator = new Validator(form);
const activityTracker = new ActivityTracker(new Person("John", 86, 190, 40));

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