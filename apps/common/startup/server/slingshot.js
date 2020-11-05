/* eslint-disable no-param-reassign */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Slingshot } from 'meteor/edgee:slingshot';

import authorizer from '../../helpers/server/authorizer';

import getFileJSONdefs from '../../entities/File/api/utils/getFileJSONdefs';
import parseFIleName from '../../helpers/parseFIleName';
import createFile from '../../entities/File/api/server/processors/createFile';

// FIXME [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead
Slingshot.fileRestrictions('saveFileToS3', {
  allowedFileTypes: /.*/i,
  // allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited).
});

Slingshot.createDirective('saveFileToS3', Slingshot.S3Storage, {
  AWSAccessKeyId: Meteor.settings.private.s3.accessKey,
  AWSSecretAccessKey: Meteor.settings.private.s3.secretKey,
  bucket: Meteor.settings.private.s3.bucket,
  acl: 'public-read',
  region: Meteor.settings.private.s3.region,
  authorize(file, metaContext) {
    try {
      const options = {
        context: {
          headers: {
            origin: this.connection.httpHeaders.host,
          },
          user: Meteor.user(),
        },
      };

      const { party, host, tenant } = authorizer(options, 'saveFileToS3', getFileJSONdefs);

      const filename = `${Random.id()}.${file.name.substring(file.name.lastIndexOf('.') + 1)}`;
      const cloudUrl = `${host}/user/${filename}`;

      const docFile = {
        name: parseFIleName(file.name),
        cloudUrl: `${Meteor.settings.public.cloudUrl}/${cloudUrl}`,
        size: file.size,
        mimeType: file.type,
        type: file.type.includes('image') ? 'Image.Detail' : 'File',
        status: 'Active',
        refs: metaContext.refs,
      };

      const fileCreated = createFile(docFile, party, tenant);

      if (fileCreated && fileCreated._id) {
        metaContext._id = fileCreated._id;
        metaContext.cloudUrl = cloudUrl;
        return true;
      }

      return false;
    } catch (exception) {
      console.log(`EXCEPTION - saveFileToS3 - userId: ${this.userId}`, exception);
      return false;
    }
  },

  key(file, metaContext) {
    return metaContext.cloudUrl;
  },
});
