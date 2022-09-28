const { emailNote } = require('../../../services/creditNote.service');

const sendProcess = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { noteId, body } = job.data;
    try {
      const res = await emailNote(noteId, body);

      if (res.code == 0) {
        return resolve({
          noteId,
          success: true,
        });
      }
      return reject(res.message);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = sendProcess;
