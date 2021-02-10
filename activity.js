import { formatTime } from './helpers.js'

export default class Activity {
  static id = 0;

  static create(description, time, intensity, person) {
    const activity = new Activity(
      description,
      time,
      intensity,
      person,
      new Date(),
      Activity.id++,
    );
    
    return activity;
  }
  
  constructor(description, time, intensity, person, date, id) {
    this.description = description;
    this.time = time;
    this.intensity = intensity;
    this.person = person;
    this.date = date;
    this.id = id;
    this.calories = ((this.intensity * person.weight) / 60) * this.time;
  }

  formattedTime() {
    return formatTime(this.time);
  }

  formattedDate() {
    return `${this.date.toLocaleDateString('en-us', {month: "long", day: "numeric", year: "numeric"})}`
  }
}