const proceedOptimizationQueue = require('@queues/advOptimizations/proceed');
const OptimizationBatchRepository = require('./optimizationBatch.repository');

const Response = require('@utils/response');

const processBatchOptimization = async (batchId, optimizationIds = []) => {
  const batch = await OptimizationBatchRepository.findById(batchId, {
    include: ['optimizations'],
  });

  const { campaignType } = batch;

  await batch.update({ processedAt: new Date() });

  await Promise.all(
    batch.optimizations
      .filter((optimization) =>
        optimizationIds.length
          ? optimizationIds.includes(optimization.advOptimizationId)
          : true
      )
      .map(async (optimization, index) => {
        const { advOptimizationId, rule } = optimization;
        let { code } = rule.action;

        if (code === 'SP:SEARCH_TERMS:CONVERT_AS_NEGATIVE_KEYWORD') {
          code =
            rule.actionData.level === 'adGroups'
              ? 'SP:SEARCH_TERMS:CONVERT_AS_NEGATIVE_KEYWORD'
              : 'SP:SEARCH_TERMS:CONVERT_AS_CAMPAIGN_NEGATIVE_KEYWORD';
        }

        const data = { advOptimizationId, campaignType };
        const options = { delay: index * 2000 };

        await proceedOptimizationQueue.add(code, data, options);
      })
  );

  return new Response()
    .withCode(200)
    .withData(batch)
    .withMessage('Optimization items successfully added to queue.');
};

module.exports = { processBatchOptimization };
