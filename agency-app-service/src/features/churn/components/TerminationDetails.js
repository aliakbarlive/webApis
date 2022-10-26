import React from 'react';
import Label from 'components/Forms/Label';
import { dateFormatterUTC, nameFormatter } from 'utils/formatters';
import Badge from 'components/Badge';
import classnames from 'classnames';
import Button from 'components/Button';
import { Link } from 'react-router-dom';

const TerminationDetails = ({ termination, client, setOpen }) => {
  return (
    <>
      <div className="flex flex-col">
        <Label>Client</Label>
        <Link
          className="text-red-500 "
          to={`/clients/profile/${client.agencyClientId}`}
        >
          {client.client}
        </Link>
      </div>
      <div className="sm:flex flex-row mt-3">
        <div className="w-1/2 sm:flex flex-col">
          <Label>Termination Date</Label>
          <span className="text-sm">
            {dateFormatterUTC(termination?.terminationDate)}
          </span>
        </div>
        <div className="w-1/2 sm:flex flex-col">
          <Label>Status</Label>
          <span>
            <Badge
              color={classnames({
                green: termination?.status === 'approved',
                red: termination?.status === 'cancelled',
                yellow: termination?.status === 'pending',
              })}
              classes="uppercase"
              rounded="md"
            >
              {termination?.status}
            </Badge>
          </span>
        </div>
      </div>
      <div className="sm:flex flex-row mt-3">
        <div className="w-1/2 sm:flex flex-col">
          <Label>Account Manager</Label>
          <span className="text-sm">
            {nameFormatter(termination?.accountManager)}
            <br />
            <a
              href={`mailto:${termination?.accountManager.email}`}
              className="text-red-500"
            >
              {termination?.accountManager.email}
            </a>
          </span>
        </div>
        <div className="w-1/2 sm:flex flex-col">
          <Label>Senior Account Manager</Label>

          <span className="text-sm">
            {nameFormatter(termination?.seniorAccountManager)}
            <br />
            <a
              href={`mailto:${termination?.seniorAccountManager.email}`}
              className="text-red-500"
            >
              {termination?.seniorAccountManager.email}
            </a>
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-3">
        <Label>Reason</Label>
        <span className=" p-1 text-sm rounded-lg">{termination?.reason}</span>
      </div>
      <div className="flex flex-col mt-3">
        <Label>More Information</Label>
        <span className="whitespace-pre-wrap p-3 text-sm rounded-lg overflow-y-auto max-h-96">
          {termination?.moreInformation}
        </span>
      </div>
      <div className="flex justify-end  mt-5">
        <div className="text-right">
          <Button
            classes="mt-2 mr-2"
            color="gray"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
};

export default TerminationDetails;
