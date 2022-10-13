'use strict';

const { v4: uuidv4 } = require('uuid');

const employees = [
  {
    firstName: 'Ailyn',
    lastName: 'Cabildo',
    email: 'ailyn.cabildo@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Aisne',
    lastName: 'Fortuno',
    email: 'aisne.fortuno@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Alice ',
    lastName: 'Ceriola',
    email: 'alice.ceriola@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Angelie ',
    lastName: 'Interone',
    email: 'angelie.interone@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Anne Micah ',
    lastName: 'Bael',
    email: 'anne.bael@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Antonette',
    lastName: 'Ho',
    email: 'antonette@sellerinteractive.com',
    roleId: 10,
  },
  {
    firstName: 'Augiedel',
    lastName: 'Jason',
    email: 'augiedel.jason@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Bell Riche ',
    lastName: 'Engco',
    email: 'bell.engco@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Calvin Klein ',
    lastName: 'Wage',
    email: 'calvin.wage@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Camille Joy',
    lastName: 'Repalda',
    email: 'camille.repalda@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Carmen',
    lastName: 'Romasanta',
    email: 'carmen.romasanta@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Charlyne Dianne ',
    lastName: 'Arado',
    email: 'charlyne.arado@seller-interactive.com',
    roleId: 16,
  },
  {
    firstName: 'Charmaine ',
    lastName: 'Labuguen',
    email: 'charmaine.labuguen@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Clarice ',
    lastName: 'Atienza',
    email: 'clarice.atienza@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Crisanto',
    lastName: 'Patulot Jr. ',
    email: 'crisanto.patulot@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Crislyn ',
    lastName: 'Ruales',
    email: 'crislyn.ruales@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Daisylyn',
    lastName: 'Austria',
    email: 'daisylyn@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Desiree',
    lastName: 'Torres',
    email: 'desiree.torres@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Edelyn ',
    lastName: 'Habal',
    email: 'edelyn.habal@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Elaine',
    lastName: 'Repalda',
    email: 'elaine.repalda@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Emman Aldwen',
    lastName: 'Imperial',
    email: 'emman.imperial@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Ferdie Don',
    lastName: 'Dacoco',
    email: 'ferdie.dacoco@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Floridel',
    lastName: 'Aliday',
    email: 'floridel@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Gina Carla',
    lastName: 'Romeo',
    email: 'gina.romeo@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Glyca Angel ',
    lastName: 'Mopada',
    email: 'glyca.mopada@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Grace ',
    lastName: 'Tagasa',
    email: 'grace.tagasa@sellerinteractive.com',
    roleId: 19,
  },
  {
    firstName: 'Hamza',
    lastName: 'Munir',
    email: 'hamza@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Hannah Almira',
    lastName: 'Villa',
    email: 'hannah.villa@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Happy Anne',
    lastName: 'Villanueva',
    email: 'happy.villanueva@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Herbert',
    lastName: 'Pamittan',
    email: 'herbert.pamittan@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: ' Irene',
    lastName: 'Ongcay',
    email: 'irene.ongcay@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Jake',
    lastName: 'Burlat',
    email: 'jake.burlat@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'James Benedict ',
    lastName: 'Perez',
    email: 'james.perez@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Jenette',
    lastName: 'Fong',
    email: 'jenette@sellerinteractive.com',
    roleId: 10,
  },
  {
    firstName: ' Jennilet ',
    lastName: 'Bulanadi',
    email: 'jennilet.bulanadi@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Jerico Renz ',
    lastName: 'Cruz',
    email: 'jerico.cruz@sellerinteractive.com',
    roleId: 19,
  },
  {
    firstName: 'Jerwin',
    lastName: 'San Juan',
    email: 'jerwin.sanjuan@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Jessa Kris ',
    lastName: 'Geolina',
    email: 'jessa.geolina@sellerinteractive.com',
    roleId: 19,
  },
  {
    firstName: 'Jessica',
    lastName: 'Albino',
    email: 'jessica.albino@sellerinteractive.com',
    roleId: 19,
  },
  {
    firstName: 'Joana',
    lastName: 'Tamayo',
    email: 'joana.tamayo@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Joanne',
    lastName: 'Po',
    email: 'joanne.po@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: ' Jocelyn ',
    lastName: 'Tenorio',
    email: 'jocelyn.tenorio@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Joey Ken ',
    lastName: 'Agbayani',
    email: 'joey.agbayani@sellerinteractive.com',
    roleId: 19,
  },
  {
    firstName: 'Joey',
    lastName: 'Dela Peña',
    email: 'joey.delapena@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'John Adolphus ',
    lastName: 'Andes',
    email: 'john.andes@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Jomark ',
    lastName: 'Tagalog',
    email: 'jomark.tagalog@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Jonathan',
    lastName: 'Gutierrez',
    email: 'jonathan.gutierrez@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Joshua',
    lastName: 'Flores',
    email: 'joshua@outgive.ca',
    roleId: 14,
  },
  {
    firstName: 'Joy Faith',
    lastName: 'Antonio',
    email: 'joy.antonio@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Joyce',
    lastName: 'Valencia',
    email: 'joyce.valencia@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Jullo ',
    lastName: 'Babagay',
    email: 'jullo.babagay@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Mark Justine',
    lastName: 'Cruz',
    email: 'justine.cruz@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Karen ',
    lastName: 'Chen',
    email: 'karen.chen@sellerinteractive.com',
    roleId: 10,
  },
  {
    firstName: 'Ken',
    lastName: 'Z',
    email: 'ken@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Kervin ',
    lastName: 'Viron',
    email: 'kervin.viron@sellerinteractive.com',
    roleId: 19,
  },
  {
    firstName: 'Kristal Lynn ',
    lastName: 'Irinco',
    email: 'kristal.irinco@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Kristian ',
    lastName: 'Cabiong',
    email: 'kristian.cabiong@sellerinteractive.com',
    roleId: 19,
  },
  {
    firstName: 'Kristine Mae',
    lastName: 'Saniel',
    email: 'kristine.saniel@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Krizelle Alexis Ponzei ',
    lastName: 'Austria',
    email: 'krizelle.austria@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: ' Krizia ',
    lastName: 'Fernandez',
    email: 'krizia.fernandez@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Lailani',
    lastName: 'Nazario',
    email: 'lailani.nazario@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Lilibeth',
    lastName: 'Farinas',
    email: 'lilibeth.farinas@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Liza',
    lastName: 'Bitonio',
    email: 'liza.bitonio@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Loisa',
    lastName: 'Amparado',
    email: 'loisa.amparado@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Louise',
    lastName: 'Condecido',
    email: 'louise.condecido@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Manilyn',
    lastName: 'Tan',
    email: 'manilyn.tan@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Maria Clarissa ',
    lastName: 'Domingo',
    email: 'maria.domingo@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Maria Luisa',
    lastName: 'Umali',
    email: 'maria.umali@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Maria Carla Ellaine',
    lastName: 'Villa',
    email: 'maria.villa@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Mariel ',
    lastName: 'Tuiza ',
    email: 'mariel.tuiza@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Marivic',
    lastName: 'Nuestro',
    email: 'marivic.nuestro@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Mark Francis',
    lastName: 'San Luis',
    email: 'mark.sanluis@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Mark',
    lastName: 'Teves',
    email: 'mark.teves@sellerinteractive.com',
    roleId: 17,
  },
  {
    firstName: 'Marvin ',
    lastName: 'Maningas',
    email: 'marvin.maningas@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Melanie Ella',
    lastName: 'Manansala',
    email: 'melanie.manansala@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Meredyl Jane',
    lastName: 'Del Rosario',
    email: 'meredyl.delrosario@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Mervin',
    lastName: 'Pangandian',
    email: 'mervin@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Michael',
    lastName: 'Del Rosario',
    email: 'michael.delrosario@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Michella',
    lastName: 'Lopez',
    email: 'michella.lopez@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Michelleah ',
    lastName: 'Lopez',
    email: 'michelleah.lopez@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Mohamed',
    lastName: 'Aden',
    email: 'mohamed@sellerinteractive.com',
    roleId: 10,
  },
  {
    firstName: 'Nikkicole ',
    lastName: 'Rabino',
    email: 'nikkicole.rabino@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Paul John',
    lastName: 'Apolinar',
    email: 'paul.apolinar@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Prences Joy ',
    lastName: 'Balcita',
    email: 'prences.balcita@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Raul',
    lastName: 'Bahoyan',
    email: 'raul.bahoyan@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Ritzlie',
    lastName: 'Cabales',
    email: 'ritzlie.cabales@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Ronalyn',
    lastName: 'Marquez',
    email: 'ronalyn.marquez@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Rosemarie Ann ',
    lastName: 'Dorimon',
    email: 'rosemarie.dorimon@sellerinteractive.com',
    roleId: 19,
  },
  {
    firstName: 'Roxanne ',
    lastName: 'Adaya',
    email: 'roxanne.adaya@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Royder',
    lastName: 'Asong',
    email: 'royder.asong@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Ruby Ann',
    lastName: 'Tuazon',
    email: 'rubyann.tuazon@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Runda',
    lastName: 'Shaher',
    email: 'runda@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Samuel Reu',
    lastName: 'Flores',
    email: 'samuel.flores@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Shaira Mae',
    lastName: 'Alcazar',
    email: 'shaira.alcazar@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Shary',
    lastName: 'Baluyot',
    email: 'shary.baluyot@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'Shem Enjerd ',
    lastName: 'Martos',
    email: 'shem.martos@sellerinteractive.com',
    roleId: 18,
  },
  {
    firstName: 'Shermaine ',
    lastName: 'Jimenez',
    email: 'shermaine.jimenez@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Shuokai',
    lastName: 'Wang',
    email: 'shuokai@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Victoria Mae',
    lastName: 'Cabello',
    email: 'victoria.cabello@sellerinteractive.com',
    roleId: 16,
  },
  {
    firstName: 'Edilberto',
    lastName: 'Nolasco',
    email: 'ed.nolasco@sellerinteractive.com',
    roleId: 11,
  },
  {
    firstName: 'Nisan Preet',
    lastName: 'Bal',
    email: 'nisan@sellerinteractive.com',
    roleId: 17,
  },
  {
    firstName: 'Katerine',
    lastName: 'Racsa',
    email: 'katerine.racsa@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Hannah Clementine',
    lastName: 'Parado',
    email: 'hannah.parado@sellerinteractive.com',
    roleId: 12,
  },
  {
    firstName: 'Princess Rebecca',
    lastName: 'Bautista',
    email: 'princess.bautista@sellerinteractive.com',
    roleId: 14,
  },
  {
    firstName: 'John Russel ',
    lastName: 'Romasanta',
    email: 'john.romasanta@sellerinteractive.com',
    roleId: 14,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT,
    });
    let emails = users.map((u) => u.email);

    return queryInterface.sequelize.transaction((transaction) => {
      let promises = [];
      for (let i = 0; i < employees.length; i++) {
        if (emails.includes(employees[i].email)) {
          promises.push(
            queryInterface.bulkUpdate(
              'users',
              {
                firstName: employees[i].firstName.trim(),
                lastName: employees[i].lastName.trim(),
                roleId: employees[i].roleId,
              },
              {
                email: employees[i].email.trim(),
              },
              { transaction }
            )
          );
        } else {
          promises.push(
            queryInterface.bulkInsert(
              'users',
              [
                {
                  firstName: employees[i].firstName.trim(),
                  lastName: employees[i].lastName.trim(),
                  email: employees[i].email.trim(),
                  roleId: employees[i].roleId,
                  userId: uuidv4(),
                  password:
                    '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
                  isEmailVerified: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
              { transaction }
            )
          );
        }
      }
      return Promise.all(promises);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'users',
      { email: { [Sequelize.Op.in]: employees.map((e) => e.email) } },
      {}
    );
  },
};
