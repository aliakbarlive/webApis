const axios = require('axios');
const {
  KeywordRanking,
  Listing,
  KeywordRankingRecord,
  Marketplace,
} = require('../../models');
const requestProcess = async (job, done) => {
  try {
    const { accountId, keywords: passedKeywords } = job.data;
    const marketplace = await Marketplace.findAll();
    const domainNames = marketplace.map((rec) => {
      rec.domainName = rec.domainName.split('.');
      rec.domainName.shift();
      return {
        salesChannel: rec.domainName.join('.'),
        marketplaceId: rec.marketplaceId,
      };
    });

    const getAllKeywords = async (keywordsArray) => {
      let keywords = [];
      for (const keywordRecord of keywordsArray) {
        const { listingId } = await Listing.findOne({
          where: {
            asin: keywordRecord.asin,
            marketplaceId: keywordRecord.marketplaceId,
          },
        });
        const { keywordId } = await KeywordRanking.findOne({
          where: {
            keywordText: keywordRecord.keywordText,
            accountId,
            listingId,
            status: 'active',
          },
        });
        const keyword = {
          keywordText: keywordRecord.keywordText,
          listingId,
          keywordId,
          asin: keywordRecord.asin,
          amazon_domain: domainNames.find(
            (domain) => domain.marketplaceId == keywordRecord.marketplaceId
          ).salesChannel,
        };
        keywords.push(keyword);
      }
      return keywords;
    };

    const keywordList = await KeywordRanking.findAll({
      where: {
        accountId,
      },
      include: [
        {
          model: Listing,
          as: 'listing',
          attributes: ['asin', 'marketplaceId'],
        },
      ],
      attributes: ['keywordText', 'listingId', 'keywordId'],
    });

    const keywords = passedKeywords
      ? await getAllKeywords(passedKeywords)
      : keywordList.map((rec) => {
          return {
            keywordText: rec.keywordText,
            listingId: rec.listingId,
            keywordId: rec.keywordId,
            asin: rec.listing.asin,
            amazon_domain: domainNames.find(
              (domain) => domain.marketplaceId == rec.listing.marketplaceId
            ).salesChannel,
          };
        });
    for (const keyword of keywords) {
      const { keywordText, keywordId, amazon_domain, asin, listingId } =
        keyword;

      const params = {
        api_key: process.env.RAINFOREST_API_KEY,
        type: 'search',
        amazon_domain,
        search_term: keywordText,
      };

      // request function for keyword search to rainforestApi
      const getSearchResult = async (params) => {
        let response = await axios.get(
          'https://api.rainforestapi.com/request',
          { params }
        );
        const { search_results } = response.data;
        // const { amazon_domain } = request_parameters
        const { current_page } = response.data.pagination
          ? response.data.pagination
          : { current_page: 1 };
        const { total_pages } =
          response.data.pagination && response.data.pagination.total_pages
            ? response.data.pagination
            : { total_pages: 1 };
        return search_results.map((rec) => {
          return {
            current_page,
            total_pages,
            position: rec.position,
            title: rec.title,
            asin: rec.asin,
          };
        });
      };

      // Save ProductKeywordRecord Function
      const saveProductKeywordRecord = async (allSearchResults) => {
        let totalRecords = allSearchResults.length;

        for (let [index, result] of allSearchResults.entries()) {
          if (asin == result.asin) {
            await KeywordRankingRecord.create({
              currentPage: result.current_page ? result.current_page : 1,
              totalPages: result.total_pages ? result.total_pages : 1,
              listingId,
              position: result.position,
              totalRecords,
              rankings: index + 1,
              keywordId,
              asin: result.asin,
            });

            console.log(
              `Created keywordRanking record for keyword: ${keywordText}`
            );
            break;
          }
        }
      };

      const firstPage = await axios.get(
        'https://api.rainforestapi.com/request',
        { params }
      );

      let { pagination } = firstPage.data;
      let { search_results: firstPageSearchResults } = firstPage.data;
      firstPageSearchResults.map((rec) => {
        rec.total_pages =
          firstPage.data.pagination && firstPage.data.pagination.total_pages
            ? firstPage.data.pagination.total_pages
            : 1;
      });

      // check if there are multiple page available, get all searched results in page 2 to page 5 or pagination total pages
      if (pagination) {
        let promises = [];
        let page = 2;
        while (page <= 5 && page <= pagination.total_pages) {
          params.page = page;
          promises.push(getSearchResult(params));
          page++;
        }
        await Promise.all(promises).then(async (values) => {
          // Combined firstPage and 2-5 page result
          let allSearchResults = [...firstPageSearchResults, ...values.flat()];
          let filteredSearchResults = allSearchResults.filter((rec) => {
            return !rec.sponsored;
          });

          await saveProductKeywordRecord(filteredSearchResults);
        });
      } else {
        // If no pagination available, settle with firstPage result
        await saveProductKeywordRecord(firstPageSearchResults);
      }
    }

    console.log(
      `Saved keywordRankings for all keywords in accountId: ${accountId} `
    );

    done(null, {});
  } catch (err) {
    console.log(err);
    done(new Error(err.message));
  }
};

module.exports = requestProcess;
