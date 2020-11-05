/* eslint-disable no-param-reassign */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check, Match } from 'meteor/check';

import fs from 'fs';
import path from 'path';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

import rateLimit from '../../../../../helpers/rateLimit';
import authorizer from '../../../../../helpers/server/authorizer';

import createFile from '../processors/createFile';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';
import parseFIleName from '../../../../../helpers/parseFIleName';

Meteor.methods({
  saveFileToFS: function saveFileToFS(blob, filenameInput, mimeType, size) {
    check(blob, Match.Any);
    check(filenameInput, String);
    check(mimeType, String);
    check(size, Number);

    const options = {
      context: {
        headers: {
          origin: this.connection.httpHeaders.host,
        },
        user: Meteor.user(),
      },
    };

    const { party, host, tenant } = authorizer(options, 'saveFileToFS', getFileJSONdefs);

    const filename = `${Random.id()}.${filenameInput.substring(
      filenameInput.lastIndexOf('.') + 1,
    )}`;
    const basePath = `${parseDotToUnderscore(host)}/user/${Meteor.userId()}`;
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
            name: parseFIleName(filenameInput),
            fsUrl: filePath,
            localUrl: `files/${basePath}/${filename}`,
            size,
            mimeType,
            type: mimeType.includes('image') ? 'Image.Detail' : 'File',
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
