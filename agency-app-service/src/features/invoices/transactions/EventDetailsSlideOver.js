import React, { useEffect, useState } from 'react';
import SlideOver from 'components/SlideOver';
import { dateFormatter, strUnderscoreToSpace } from 'utils/formatters';
import axios from 'axios';
import Loading from 'components/Loading';

const EventDetailsSlideOver = ({ open, setOpen, zohoEvent }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (zohoEvent && open) {
      setLoading(true);
      axios
        .get(`/agency/invoicing/events/${zohoEvent.event_id}`)
        .then((res) => {
          setEventDetails(res.data.data.event);
          setLoading(false);
        });
    }
  }, [zohoEvent, open]);

  const formatJson = () => {
    let jsonString = JSON.parse(eventDetails.payload);
    return JSON.stringify(jsonString, null, 2);
  };

  return (
    zohoEvent && (
      <SlideOver
        open={open}
        setOpen={setOpen}
        title={strUnderscoreToSpace(zohoEvent.event_type)}
        titleClasses="capitalize"
        size="2xl"
      >
        <h1 className="text-md">{zohoEvent.event_id}</h1>
        <h3 className="text-md">
          {dateFormatter(zohoEvent.event_time, 'DD MMM YYYY HH:MM a')}
        </h3>
        <span className="uppercase text-gray-500 text-xs">
          {zohoEvent.event_source}
        </span>

        <div className="mt-6 mb-1">Event Data</div>
        {eventDetails && !loading ? (
          <pre className="bg-gray-100 p-1 text-xs text-gray-800 border border-8 border-dashed whitespace-pre-wrap">
            {eventDetails && formatJson()}
          </pre>
        ) : (
          <Loading />
        )}
      </SlideOver>
    )
  );
};
export default EventDetailsSlideOver;
