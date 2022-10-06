import SlideOver from 'components/SlideOver';
import LeadForm from './components/LeadForm';

const LeadSlideOver = ({ open, setOpen, getData, selectedLeads }) => {
  return (
    <SlideOver
      open={open}
      setOpen={setOpen}
      title={selectedLeads.leadId ? 'Update Lead' : 'Add Lead'}
      titleClasses="capitalize"
      size="3xl"
    >
      <div className="flow-root">
        <LeadForm
          action={selectedLeads.leadId ? 'update' : 'add'}
          setOpen={setOpen}
          getData={getData}
          selectedLeads={selectedLeads}
        />
      </div>
    </SlideOver>
  );
};

export default LeadSlideOver;
