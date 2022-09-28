'use strict';
const { Model, Op } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Job.init(
    {
      jobId: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['initialSync', 'cron'],
        defaultValue: 'initialSync',
      },
      queue: {
        type: DataTypes.STRING,
        required: true,
      },
      data: {
        type: DataTypes.JSONB,
      },
      options: {
        type: DataTypes.JSONB,
        get() {
          const options = this.getDataValue('options');
          const jobId = this.getDataValue('jobId');

          return jobId ? { ...options, jobId } : options;
        },
      },
      returnValue: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          'created',
          'onQueue',
          'waiting',
          'active',
          'completed',
          'failed',
          'error',
        ],
        defaultValue: 'created',
      },
      message: {
        type: DataTypes.TEXT,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      completedAt: {
        type: DataTypes.DATE,
      },
      name: {
        type: DataTypes.VIRTUAL,
        get() {
          const option = this.getDataValue('options');

          return option.name;
        },
      },
    },
    {
      sequelize,
      modelName: 'Job',
      tableName: 'jobs',
      scopes: {
        onGoing: {
          where: {
            status: {
              [Op.in]: ['created', 'onQueue', 'waiting', 'active'],
            },
          },
        },
        completed: {
          where: {
            status: 'completed',
          },
        },
      },
    }
  );

  Job.prototype.markAs = async function (
    status,
    msg = null,
    returnValue = null
  ) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    this.status = status;

    if (msg) {
      this.message = msg;
    }

    if (status == 'active') {
      this.startDate = now;
    }

    if (status == 'completed') {
      this.completedAt = now;
      this.returnValue = returnValue;
    }

    console.log(`${now} ${this.queue}: ${this.jobId} ${status}`);

    return await this.save();
  };

  Job.afterCreate(async (job, options) => {
    try {
      let queue = require(`../queues/${job.queue}`);

      queue = typeof queue == 'object' ? queue : new queue().getQueue();

      await queue.add(job.name, job.data, job.options);

      await job.markAs('onQueue');
    } catch (error) {
      console.log(error);
      await job.markAs('failed');
    }
  });

  Job.afterBulkCreate(async (jobs, options) => {
    let status = 'onQueue';
    try {
      let queue = require(`../queues/${jobs[0].queue}`);

      queue = typeof queue == 'object' ? queue : new queue().getQueue();

      const bulkJobs = jobs.map((job) => {
        return {
          name: job.name,
          data: job.data,
          opts: job.options,
        };
      });

      await queue.addBulk(bulkJobs);
    } catch (error) {
      status = 'failed';
      console.log(error.message);
    }

    await Promise.all(
      jobs.map(async (job) => {
        await job.markAs(status);
      })
    );
  });

  return Job;
};
