import axios from 'axios';
import { useState, useEffect } from 'react';

const SearchTermExandableRow = ({ accountId, marketplace, searchTerm }) => {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    setLoading(true);

    axios
      .get('/advertising/keywords', {
        params: {
          accountId,
          marketplace,
          campaignType: 'sponsoredProducts',
          keywordText: searchTerm.values.query,
          include: ['adGroup'],
        },
      })
      .then((response) => {
        let { rows } = response.data.data;

        rows = rows.filter((row) => {
          return searchTerm.values.AdvKeyword
            ? searchTerm.values.AdvKeyword.advKeywordId !== row.advKeywordId
            : true;
        });
        setKeywords(rows);
      })
      .then(() => setLoading(false));
  }, [accountId, marketplace, searchTerm]);

  if (loading) {
    return 'Loading';
  }

  return keywords.length ? (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-6"
            >
              Keyword Text
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
            >
              Match Type
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
            >
              Campaign
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
            >
              Ad Group
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {keywords.map((keyword) => (
            <tr key={keyword.advKeywordId}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6">
                {keyword.keywordText}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {keyword.matchType}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {keyword.AdvAdGroup.AdvCampaign.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {keyword.AdvAdGroup.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="w-full flex justify-center my-3 text-gray-700 font-medium text-sm">
      <span className="text-center">No Related Keywords</span>
    </div>
  );
};

export default SearchTermExandableRow;
