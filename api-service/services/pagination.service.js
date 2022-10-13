/**
 * Pagination
 *
 * @param array rows
 * @param int count
 * @param int page
 * @param int offset
 * @param int limit
 * @returns object
 */
const paginate = (rows, count, page, offset, pageSize) => {
  const to = offset + pageSize > count ? count : offset + pageSize;
  const from = count ? offset + 1 : count;
  const nextPage = count / pageSize > page ? page + 1 : null;
  const prevPage = page === 1 ? null : page - 1;

  return { to, from, pageSize, count, nextPage, prevPage, rows };
};

module.exports = {
  paginate,
};
