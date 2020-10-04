import { Meteor } from 'meteor/meteor';

process.env.FILES_PATH =
  (Meteor.settings.private && Meteor.settings.private.FILES_PATH) || `${process.env.PWD}/.files`;
