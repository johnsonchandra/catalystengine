import $ from 'jquery';

export default (form, options) => {
  import('jquery-validation')
    .then(() => {
      $.validator.addMethod(
        'mobilephoneID',
        function mobilephoneID(phoneNumber, element) {
          // eslint-disable-next-line no-param-reassign
          phoneNumber = phoneNumber.replace(/\s+/g, '');
          return (
            this.optional(element) ||
            (phoneNumber.length > 9 && phoneNumber.match(/^((?:\+62)|0)(8)[1-9][1-9][0-9]+$/))
          );
        },
        'Please specify a valid indonesian mobile phone number',
      );
      $(form).validate(options);
    })
    .catch(() => {});
};
