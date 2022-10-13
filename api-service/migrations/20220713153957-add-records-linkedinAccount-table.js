'use strict';

const { v4: uuidv4 } = require('uuid');

const linkedInAccounts = [
  {
    name: 'Jayce',
    email: 'jaycebro@gmail.com',
  },
  {
    name: 'Emma Landry',
    email: 'landryemmaa@gmail.com',
  },
  {
    name: 'Vernita Compton',
    email: 'vernitacompton2@gmail.com',
  },
  {
    name: 'Louise Solomon',
    email: 'ls.solomon221@gmail.com',
  },
  {
    name: 'Hailey Anderson',
    email: 'andersonhailey582@gmail.com',
  },
  {
    name: 'Anne Parmakhtiar',
    email: 'ap.parmakhtiar002@gmail.com',
  },
  {
    name: 'Sadie McCrae',
    email: 'mccraesadie@gmail.com',
  },
  {
    name: 'Emily Robertson',
    email: 'emirobertson992@gmail.com',
  },
  {
    name: 'Martha Warner',
    email: 'marthawarner968@gmail.com',
  },
  {
    name: 'Maya Olson',
    email: 'mayaolson520@gmail.com',
  },
  {
    name: 'Everly Bell',
    email: 'eb.bell70@gmail.com',
  },
  {
    name: 'Jenna Bernardo',
    email: 'jenna.bernardo@sellerinteractive.com',
  },
  {
    name: 'Molly Taylor',
    email: 'mollytaylor156@gmail.com',
  },
  {
    name: 'Kylie Dawson',
    email: 'kkyliedawson@gmail.com',
  },
  {
    name: 'Allison Beckman',
    email: 'allibeckman32@gmail.com',
  },
  {
    name: 'Mindy Ward',
    email: 'mindyward088@gmail.com',
  },
  {
    name: 'Mike Jones',
    email: 'jonessmike.s.22@gmail.com',
  },
  {
    name: 'Rich Frey',
    email: 'rf.frey651@gmail.com',
  },
  {
    name: 'Adalyn Doyle',
    email: 'ad.doyle124@gmail.com',
  },
  {
    name: 'Isabel Robinson',
    email: 'isrrobinson97@gmail.com',
  },
  {
    name: 'Elena David',
    email: 'ed.david458@gmail.com',
  },
  {
    name: 'Nic',
    email: 'nicasioiii@gmail.com',
  },
  {
    name: 'Charlotte Arbour',
    email: 'ccharlottearbour@gmail.com',
  },
  {
    name: 'Sidney Smith',
    email: 'smithsidneys005@gmail.com',
  },
  {
    name: 'Noemi Ramos',
    email: 'noemiramos750@gmail.com',
  },
  {
    name: 'Anna Perez',
    email: 'ap.perez154@gmail.com',
  },
  {
    name: 'Lena Hoffman',
    email: 'hoffmanlena5@gmail.com',
  },
  {
    name: 'Ana Karla Ramirez',
    email: 'ana.ramirez@sellerinteractive.com',
  },
  {
    name: 'Mildred Parker',
    email: 'mildredparker007@gmail.com',
  },
  {
    name: 'Edraine Bernardo',
    email: 'edraine@sellerinteractive.com',
  },
  {
    name: 'Janice Baker',
    email: 'janicebaker010@gmail.com',
  },
  {
    name: 'Joyce Wright',
    email: 'joyce.wright.002@gmail.com',
  },
  {
    name: 'Zach Rouse',
    email: 'zr.rouse36@gmail.com',
  },
  {
    name: 'Luca Morin',
    email: 'lm.morin75@gmail.com',
  },
  {
    name: 'Aria Trembley',
    email: 'at.trembley85@gmail.com',
  },
  {
    name: 'Amelia Payne',
    email: 'ap.payne71@gmail.com',
  },
  {
    name: 'Vienna Buck',
    email: 'vb.buck610@gmail.com',
  },
  {
    name: 'Rosalie Barry',
    email: 'rrosaliebarry@gmail.com',
  },
  {
    name: 'Mia Allan',
    email: 'miaallan83@gmail.com',
  },
  {
    name: 'Kayle Millera',
    email: 'kayle.millera@sellerinteractive.com',
  },
  {
    name: 'Jason J-Rock',
    email: 'jasonjrock08@gmail.com',
  },
  {
    name: 'Betty Haynes',
    email: 'betty.haynes.21@gmail.com',
  },
  {
    name: 'Larry Frantz',
    email: 'lf.frantz85@gmail.com',
  },
  {
    name: 'Romariz Capinpin',
    email: 'romariz.capinpin@sellerinteractive.com',
  },
  {
    name: 'Leah Fortin',
    email: 'lf.fortin75@gmail.com',
  },
  {
    name: 'Ava Leclerc',
    email: 'al.leclerc71@gmail.com',
  },
  {
    name: 'Ella Fraser',
    email: 'ef.fraser685@gmail.com',
  },
  {
    name: 'Jessica Oliver',
    email: 'jeoliver023@gmail.com',
  },
  {
    name: 'Norah Webster',
    email: 'norahwebster16@gmail.com',
  },
  {
    name: 'Zoe Young',
    email: 'zoeyoung006@gmail.com',
  },
  {
    name: 'Chloe Peters',
    email: 'cp.peters253@gmail.com',
  },
  {
    name: 'Jade Gesner',
    email: 'jadegesner@gmail.com',
  },
  {
    name: 'Ken',
    email: 'ken@seller-interactive.com',
  },
  {
    name: 'Addison Lehmann',
    email: 'addlehmann@gmail.com',
  },
  {
    name: 'Anderson Rose',
    email: 'rosanderson1902@gmail.com',
  },
  {
    name: 'Eliza Gallant',
    email: 'elizgallant388@gmail.com',
  },
  {
    name: 'Zoe Bear',
    email: 'zoebear316@gmail.com',
  },
  {
    name: 'Helena Mayer',
    email: 'helmayer9@gmail.com',
  },
  {
    name: 'Martha Ross',
    email: 'marthaross055@gmail.com',
  },
  {
    name: 'Kara Stewart',
    email: 'stewartkara84@gmail.com',
  },
  {
    name: 'Alivia Gallant',
    email: 'alivgallant@gmail.com',
  },
  {
    name: 'Claire Murray',
    email: 'claimurray@gmail.com',
  },
  {
    name: 'Walter Irving',
    email: 'walterirving531@gmail.com',
  },
  {
    name: 'Melody Foster',
    email: 'melofoster9@gmail.com',
  },
  {
    name: 'Amelia Kelly',
    email: 'amelkelly52@gmail.com',
  },
  {
    name: 'Alice Fisher',
    email: 'fisheralice26@gmail.com',
  },
  {
    name: 'Charlotte Bondar',
    email: 'charlbondar@gmail.com',
  },
  {
    name: 'Heidi Tanner',
    email: 'heiditanner09@gmail.com',
  },
  {
    name: 'Kylie March',
    email: 'kyliemarch7@gmail.com',
  },
  {
    name: 'Blakely Miller',
    email: 'millerblakely7@gmail.com',
  },
  {
    name: 'Stella Evans',
    email: 'stellevans31@gmail.com',
  },
  {
    name: 'Roman Douglas',
    email: 'douglasroman424@gmail.com',
  },
  {
    name: 'Zane Parker',
    email: 'parkerzane05@gmail.com',
  },
  {
    name: 'Hadley Wood',
    email: 'hadleywood62@gmail.com',
  },
  {
    name: 'Jeremy Hamilton',
    email: 'jerhamilton85@gmail.com',
  },
  {
    name: 'Sierra Lake',
    email: 'sierrlake@gmail.com',
  },
  {
    name: 'Christian Davidson',
    email: 'cdavidson4231@gmail.com',
  },
  {
    name: 'Kinsley Altman',
    email: 'altmankinsley@gmail.com',
  },
  {
    name: 'Rachel Wilson',
    email: 'rrachelwilson16@gmail.com',
  },
  {
    name: 'Alexa Taylor',
    email: 'aalexataylor@gmail.com',
  },
  {
    name: 'Rose Cohen',
    email: 'rrosecohen@gmail.com',
  },
  {
    name: 'Ayla Byrne',
    email: 'aaylabyrne@gmail.com',
  },
  {
    name: 'Dorothy Ward/ Rory Ward',
    email: 'roryward646@gmail.com',
  },
  {
    name: 'Erin Fuller',
    email: 'erinfuller35@gmail.com',
  },
  {
    name: 'Benjamin Shields',
    email: 'benjaminshields08@gmail.com',
  },
  {
    name: 'Caroline Fletcher',
    email: 'fletchercaroline649@gmail.com',
  },
  {
    name: 'Aliyah Barry',
    email: 'aliyahbarry897@gmail.com',
  },
  {
    name: 'Katie McLaughlin',
    email: 'mclaughlinkatie83@gmail.com',
  },
  {
    name: 'Sloan Clark',
    email: 'sloanclark984@gmail.com',
  },
  {
    name: 'Brielle Robertson',
    email: 'briellerobertson460@gmail.com',
  },
  {
    name: 'Hayley Philips',
    email: 'hayleyphilips373@gmail.com',
  },
  {
    name: 'Lucia Brockhouse',
    email: 'brockhouselucia58@gmail.com',
  },
  {
    name: 'Lauren Thatcher',
    email: 'laurenthatcher645@gmail.com',
  },
  {
    name: 'Margaret Markle',
    email: 'margaretmarkle092@gmail.com',
  },
  {
    name: 'Kate Tyrell',
    email: 'tyrellkate296@gmail.com',
  },
  {
    name: 'Hannah Adam',
    email: 'hannahadams004@yahoo.com',
  },
  {
    name: 'Holly Brown',
    email: 'hollybrown002@yahoo.com',
  },
].map((el) => {
  return {
    linkedInAccountId: uuidv4(),
    ...el,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('linkedInAccounts', linkedInAccounts, {
          transaction,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete('linkedInAccounts', {
          name: {
            [Sequelize.Op.in]: linkedInAccounts.map((el) => el.name),
          },
        }),
      ]);
    });
  },
};
