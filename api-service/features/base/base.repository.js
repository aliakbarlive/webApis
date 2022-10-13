const { keys } = require('lodash');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Get model attributes.
   *
   * @returns [] attributes
   */
  getAttributes() {
    const attributes = keys(this.model.rawAttributes);

    return attributes;
  }

  /**
   * Find record by id.
   *
   * @param {string|bigint|int|uuid} id
   * @param {object} options
   * @returns {object} record
   */
  async findById(id, options = {}) {
    const record = await this.model.findByPk(id, options);

    return record;
  }

  /**
   * Find one record.
   *
   * @param {object} options
   * @returns {object} record
   */
  async findOne(options) {
    const record = await this.model.findOne(options);

    return record;
  }

  /**
   * Find all records.
   *
   * @param {object} options
   * @returns {object} record
   */
  async findAll(options) {
    const records = await this.model.findAll(options);

    return records;
  }

  /**
   * Find and count all records.
   *
   * @param {object} options
   * @returns {object} record
   */
  async findAndCountAll(options) {
    const { rows, count } = await this.model.findAndCountAll(options);

    return { rows, count };
  }

  /**
   * Create record.
   *
   * @param {object} data
   * @param {object} options
   * @returns {object} record
   */
  async create(data, options = {}) {
    const record = await this.model.create(data, options);

    return record;
  }

  /**
   * Check if record exists.
   *
   * @param {object} options
   * @returns {boolean} exists
   */
  async exists(options) {
    const count = await this.model.count(options);

    return !!count;
  }

  /**
   * Count records.
   *
   * @param {object} options
   * @returns {int} count
   */
  async count(options) {
    const count = await this.model.count(options);

    return count;
  }

  /**
   * Bulk create records.
   *
   * @param {array} data
   * @param {object} options
   * @returns {array} records
   */
  async bulkCreate(data, options = {}) {
    const records = await this.model.bulkCreate(data, options);

    return records;
  }

  async update(data, condition = {}) {
    const count = await this.model.update(data, condition);

    return count;
  }

  /**
   *
   * @param {object} options
   * @returns object
   */
  async delete(condition = {}) {
    const result = await this.model.destroy(condition);

    return result;
  }
}

module.exports = BaseRepository;
