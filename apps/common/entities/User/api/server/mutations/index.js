import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import detailUser from '../queries/detailUser';
import updateUser from './updateUser';
import updateUserRoles from './updateUserRoles';

import setUserSettingsByHostToTrue from './setUserSettingsByHostToTrue';
import parseHost from '../../../../../helpers/parseHost';
import getPrivateFile from '../../../../../helpers/server/getPrivateFile';
import handlebarsEmailToHtml from '../../../../../helpers/server/handlebarsEmailToHtml';
import handlebarsEmailToText from '../../../../../helpers/server/handlebarsEmailToText';

import sendWelcomeEmail from '../../utils/sendWelcomeEmail';

import Tenant from '../../../../Tenant/api';

export default {
  updateUser: async (parent, args, context) => {
    await updateUser({
      context,
      args,
    });

    return detailUser({ userIdToQuery: args.user._id || context.user._id, context });
  },

  updateUserRoles: async (parent, args, context) => {
    await updateUserRoles({
      context,
      args,
    });

    return detailUser({ userIdToQuery: args.party._id || context.user._id, context });
  },

  setUserSettingsByHostToTrue: (root, args, context) =>
    setUserSettingsByHostToTrue({
      context,
      args,
    }),

  sendVerificationEmail: (parent, args, context) => {
    const { emailTemplates } = Accounts;

    const host = parseHost(context.headers.origin);
    const tenant = Tenant.findOne({ host });

    emailTemplates.siteName = tenant.name;
    emailTemplates.from = tenant.email;

    emailTemplates.verifyEmail = {
      subject() {
        return `[${tenant.name}] Verify Your Email Address`;
      },
      html(user, url) {
        const urlHost = parseHost(url);
        const urlWithoutHash = url.replace(urlHost, host).replace('#/', '');
        return handlebarsEmailToHtml(getPrivateFile('email-templates/verify-email.html'), {
          title: "Let's Verify Your Email",
          subtitle: `Verify your email to start using ${tenant.name}`,
          logoUrl: tenant.logoUrl,
          productName: host,
          fullname: user.profile.fullname,
          verifyUrl: urlWithoutHash,
        });
      },
      text(user, url) {
        const urlHost = parseHost(url);
        const urlWithoutHash = url.replace(urlHost, host).replace('#/', '');

        if (Meteor.isDevelopment) console.info(`[ Common ] Verify Email Link: ${urlWithoutHash}`);

        return handlebarsEmailToText(getPrivateFile('email-templates/verify-email.txt'), {
          productName: host,
          fullname: user.profile.fullname,
          verifyUrl: urlWithoutHash,
        });
      },
    };

    Accounts.sendVerificationEmail(context.user._id);

    return {
      _id: context.user._id,
    };
  },

  forgotPassword: (parent, args, context) => {
    const { emailTemplates } = Accounts;

    const host = parseHost(context.headers.origin);
    const tenant = Tenant.findOne({ host });

    emailTemplates.siteName = tenant.name;
    emailTemplates.from = tenant.email;

    emailTemplates.resetPassword = {
      subject() {
        return `[${tenant.name}] Reset Your Password`;
      },
      html(user, url) {
        const urlHost = parseHost(url);
        const urlWithoutHash = url.replace(urlHost, host).replace('#/', '');

        return handlebarsEmailToHtml(getPrivateFile('email-templates/reset-password.html'), {
          title: "Let's Reset Your Password",
          subtitle: 'A password reset was requested for this email address.',
          logoUrl: tenant.logoUrl,
          fullname: user.profile.fullname,
          productName: host,
          emailAddress: user.emails[0].address,
          resetUrl: urlWithoutHash,
        });
      },
      text(user, url) {
        const urlHost = parseHost(url);
        const urlWithoutHash = url.replace(urlHost, host).replace('#/', '');

        if (Meteor.isDevelopment) console.info(`Reset Password Link: ${urlWithoutHash}`); // eslint-disable-line

        return handlebarsEmailToText(getPrivateFile('email-templates/reset-password.txt'), {
          fullname: user.profile.fullname,
          productName: host,
          emailAddress: user.emails[0].address,
          resetUrl: urlWithoutHash,
        });
      },
    };

    const user = Meteor.users.findOne({ 'emails.address': args.user.email });

    Accounts.sendResetPasswordEmail(user._id);

    return {
      _id: user._id,
    };
  },

  sendWelcomeEmail: async (parent, args, context) => {
    await sendWelcomeEmail({ user: Meteor.users.findOne(context.user._id), parent, context });

    return {
      _id: context.user._id,
    };
  },
};
