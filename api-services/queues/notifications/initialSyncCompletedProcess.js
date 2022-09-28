const { sendEmail } = require('../../utils/ses');
const { Account, User } = require('../../models');

const initialSyncCompletedProcess = async (job, done) => {
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
      subject: 'Initial Sync Status Completed',
      message: `Initial Status of the account ${account.name} with Selling Partner Id: ${account.accountId} has been completed.`,
    });

    done(null, { message: 'Email Sent', count: recipients.length });
  } catch (error) {
    done(error);
  }
};
module.exports = initialSyncCompletedProcess;
