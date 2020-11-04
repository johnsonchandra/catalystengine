/* eslint-disable no-param-reassign */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import fs from 'fs';
import path from 'path';

import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import rateLimit from '../../../../../helpers/rateLimit';
import createFile from '../processors/createFile';

Meteor.methods({
  // FIXME right now no user right check, only login user
  saveFileToFS: function saveFileToFS(blob, filenameInput, mimeType, size) {
    check(blob, Match.Any);
    check(filenameInput, String);
    check(mimeType, String);
    check(size, Number);

    const user = Meteor.user();

    const host = parseHost(this.connection.httpHeaders.host);
    const tenant = getTenant(host);
    const party = {
      _id: user._id,
      type: 'Member',
      name: user.profile.fullname,
    };

    const now = new Date();

    const filename = `${now.getTime()}_${filenameInput
      .replace(/ /g, '_')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9_.]/g, '')}`;

    const basePath = Meteor.userId();
    const filePath = path.normalize(path.join(`${process.env.FILES_PATH}/${basePath}`, filename));
    console.log(`[ saveFileToFS ] [ ${new Date()} ] filePath: ${filePath}`);

    fs.promises.mkdir(path.dirname(filePath), { recursive: true }).then(() =>
      fs.writeFile(
        filePath,
        blob,
        'binary',
        Meteor.bindEnvironment((err) => {
          if (err) {
            console.error(`************ Error: ${err}`);
            throw new Error(err.message);
          }
          const docFile = {
            name: filename,
            fsUrl: filePath,
            localUrl: `files/${basePath}/${filename}`,
            size,
            mimeType,
            type: 'File',
            status: 'Draft',
          };
          createFile(docFile, party, tenant);
        }),
      ),
    );
  },
});

rateLimit({
  methods: ['saveFileToFS'],
  limit: 10,
  timeRange: 100,
});
