const dotenv = require('dotenv');
const { sequelize } = require('./models');
// const { Op, col, where } = require('sequelize');
const { computeMonthlyCommission } = require('./services/commission.services');
const computeCommissionCron = require('./queues/compute/cron');

const start = async () => {
  dotenv.config({ path: 'config/config.env' });
  await sequelize.authenticate();
  console.log('Database Connected!');

  const [results, metadata] = await sequelize.query(
    `select distinct "accountId" from (
        select * from (
            select ac.client, ac."accountId" as "acId" , (select c2.service from credentials c2 where c2."accountId"= a."accountId" and c2.service = 'spApi') as "spApi", s."status", s."activatedAt", s."cancelledAt",  c.*
            from "agencyClients" ac 
            left join accounts a  on ac."accountId" = a."accountId"
            left join commissions c   on ac."accountId" = c."accountId"
            left join subscriptions s on s."accountId" = a."accountId" 
            order by ac.client  asc
        ) as x
        where x."accountId" not in (
            select distinct "accountId" from (
                select * from (
                    select  client,"accountId", "invoiceId", "invoiceNumber","invoiceDate", "status" from (
                        select ac.client, a."accountId" , (select c2.service from credentials c2 where c2."accountId"= a."accountId" and c2.service = 'spApi') as "spApi", "zohoId",i."invoiceId",  i."invoiceDate" , i."invoiceNumber" , i.total, i.status 
                        from "agencyClients" ac 
                        left join accounts a  on ac."accountId" = a."accountId"
                        left join invoices i on i."customerId" = ac."zohoId"
                        where i."invoiceDate" >= '2022-04-01' and i."invoiceDate" < '2022-05-01'
                        order by ac.client  asc
                    ) as a
                    where a."spApi" is not null
                ) as b
                left join "invoiceItems" ii on ii."invoiceId" = b."invoiceId"
                where ii."name" like '%Ongoing Sales Comm%' or ii.code = 'Ongoing Sales Commissions'
            ) as c
        )
        and "spApi" is not null
        and "activatedAt" < '2022-04-01'
        and ("cancelledAt" is null or "cancelledAt" > '2022-04-01')
        order by "activatedAt"
    ) as d
    `
  );

  results.forEach(async (r) => {
    const { accountId } = r;
    const invoiceDate = '2022-04';

    await computeCommissionCron.add({ accountId, invoiceDate });
  });
};

start();
