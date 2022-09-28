const { sendEmail } = require('../../utils/ses');
const { Account, User, Member } = require('../../models');

const initialSyncStartedProcess = async (job, done) => {
  const { accountId } = job.data;

  try {
    const account = await Account.findByPk(accountId, {
      include: {
        model: Member,
        as: 'members',
        include: {
          model: User,
          as: 'user',
          attributes: ['email'],
        },
      },
    });

    const recipients = account.members.map(({ user }) => user.email);

    await sendEmail({
      email: recipients,
      subject: 'Initial Sync Status Started',
      message: `Initial Sync of the account ${account.name} with Selling Partner Id: ${account.accountId} has been started. It will take up to 24hrs to be completed.`,
    });

    done(null, { message: 'Email Sent', count: recipients.length });
  } catch (error) {
    done(error);
  }
};
module.exports = initialSyncStartedProcess;
