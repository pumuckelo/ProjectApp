const nodeSchedule = require("node-schedule");
const nodemailer = require("nodemailer");
const db = require("../models/index");

const corsEmailNotificationsaaaaaa = {
  todoItems: {
    schedules: [],

    addSchedule: function(date, recipents) {
      //recipents: [ {username: "name", email: "email"}, ...]

      //create email

      //need email template

      let scheduleObject = {
        date: Date
      };
      //node-schedule can take a js date object as date

      let newCorsObject = nodeSchedule.scheduleJob();
      this.schedules.push({
        nodeSched
      });
    },
    removeSchedule: function(scheduleId) {}
  },

  todoLists: [],

  projects: []

  //TODO Todolist notification should list all of the missing todos that need to be completed until date

  //TODO Project Notification should list all the todolists that  are unfinished and also list the todos of them that are unfinished and
  // write a nice html email with the infos about it
};

function corsEmailNotifications() {
  const todoItems = {
    schedules: [],
    addSchedule: () => {
      todoItems.schedules.push({ _id: "werr" + todoItems.schedules.length });
    },
    removeSchedule: () => {},
    getSchedules: () => todoItems.schedules,
    initialize: () => {
      //Find all todos that have a due date
      db.TodoItem.find({
        dueDate
      });
    }
  };
  const todoLists = {
    schedules: [],
    addSchedule: () => {},
    removeSchedule: () => {},
    getSchedules: () => todoLists.schedules
  };
  const projects = {
    schedules: [],
    addSchedule: () => {},
    removeSchedule: () => {},
    getSchedules: () => projects.schedules
  };

  const initializeAll = () => {};

  return {
    todoItems: {
      getSchedules: todoItems.getSchedules,
      addSchedule: todoItems.addSchedule,
      removeSchedule: todoItems.removeSchedule
    },
    todoLists: {
      getSchedules: todoLists.getSchedules,
      addSchedule: todoLists.addSchedule,
      removeSchedule: todoLists.removeSchedule
    },
    projects: {
      getSchedules: projects.getSchedules,
      addSchedule: projects.addSchedule,
      removeSchedule: projects.removeSchedule
    }
  };
}

// class corsEmailNotifications {

//     todoItems = {
//         #schedules: []
//     }
// }
