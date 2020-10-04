import sendEmail from '../../../../helpers/server/sendEmail';
import parseHost from '../../../../helpers/parseHost';

import Tenant from '../../../Tenant/api';

const getEmailOptions = (user, tenant) => {
  try {
    const { fullname } = user.profile;
    const productName = tenant.name;

    return {
      to: user.emails[0].address,
      from: tenant.email,
      subject: `[${productName}] Welcome, ${fullname}!`,
      template: 'welcome',
      templateVars: {
        title: `Welcome, ${fullname}!`,
        logoUrl: tenant.logoUrl,
        productName,
        fullname,
      },
    };
  } catch (exception) {
    throw new Error(`[sendWelcomeEmail.getEmailOptions] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  if (!options) throw new Error('[sendWelcomeEmail.validateOptions] options object is required.');
  if (!options.user)
    throw new Error('[sendWelcomeEmail.validateOptions] options.user is required.');
};

export default (options) => {
  try {
    validateOptions(options);

    const host = parseHost(options.context.headers.origin);
    const tenant = Tenant.findOne({ host });

    const user = {
      _id: options.user._id,
      emails: options.user.emails,
      profile: {
        fullname: options.user.profile.fullname,
        shortname: options.user.profile.shortname,
        phone: options.user.profile.phone,
      },
    };

    const emailOptions = getEmailOptions(user, tenant);

    sendEmail(emailOptions).catch((error) => {
      throw new Error(error);
    });
  } catch (exception) {
    throw new Error(`[sendWelcomeEmail] ${exception.message}`);
  }
};
