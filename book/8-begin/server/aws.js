const aws = require('aws-sdk');

function sendEmail(options) {
  aws.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAUAIRNUPRWEQ6CP42',
    secretAccessKey: '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',
  });

  const ses = new aws.SES({ apiVersion: 'latest' });

  return new Promise((resolve, reject) => {
    ses.sendEmail(
      {
        Source: options.from,
        Destination: {
          CcAddresses: options.cc,
          ToAddresses: options.to,
        },
        Message: {
          Subject: {
            Data: options.subject,
          },
          Body: {
            Html: {
              Data: options.body,
            },
          },
        },
        ReplyToAddresses: options.replyTo,
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      },
    );
  });
}

module.exports = sendEmail;
