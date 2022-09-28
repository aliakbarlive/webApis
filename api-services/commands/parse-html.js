const path = require('path');
const fs = require('fs');
const { replace, trim } = require('lodash');
const HTMLParser = require('node-html-parser');

/**
 * HTML PARSER
 *
 *
 */

const start = async () => {
  try {
    let filePath = path.join(__dirname, `../data/contacts.html`);

    let template = fs.readFileSync(
      filePath,
      { encoding: 'utf-8' },
      function (err) {
        console.log(err);
      }
    );

    const root = HTMLParser.parse(template);

    const persons = Array.from(root.querySelectorAll('.person-card'));

    let headers = [
      'name',
      'title@company',
      'interests 1',
      'interests 2',
      'interests 3',
    ];

    let writePath = path.join(__dirname, `../data/contacts.json`);

    // write headers
    fs.appendFile(writePath, headers.join(',') + '\r\n', function (err) {
      if (err) throw err;
      console.log('successfully saved file');
    });

    persons.forEach((person) => {
      const user = person.querySelector('.user-info-name');
      const job = person.querySelector('.user-info-job');
      const tags = person.querySelectorAll('.ant-tag');

      const row = [];

      row.push(trim(user.innerText));
      row.push(`"${trim(job?.innerText)}"`);

      tags.forEach((tag) => {
        row.push(`"${trim(replace(tag.innerText, '&amp;', '&'))}"`);
      });

      fs.appendFile(writePath, row.join(',') + '\r\n', function (err) {
        if (err) throw err;
        console.log('successfully saved file');
      });
    });

    res.status(200).json({
      success: true,
      code: 200,
      message: 'Successfully',
      //persons,
    });
  } catch (err) {
    console.log(err);
  }
};

start();
