import axios from 'axios';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import Button from 'components/Button';
import { PlusIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import AddOn from 'features/clients/Form/AddOn';

const AddAddonModal = ({
  subscription,
  open,
  setOpen,
  onAddOneTimeAddon,
  loading,
}) => {
  const [addonOptions, setAddonOptions] = useState([]);
  const [addons, setAddons] = useState([
    {
      addon_description: '',
      addon_code: '',
      price: 0,
      quantity: 1,
      type: 'one_time',
    },
  ]);

  useEffect(() => {
    if (open) {
      axios
        .get(
          `/agency/invoicing/list?operation=addons&filter=${subscription.plan.plan_code}&status=ONETIME`
        )
        .then((res) => {
          setAddonOptions(res.data.data);
        });
    }
  }, [subscription.plan.plan_code, open]);

  useEffect(() => {
    if (open) {
      setAddons([
        {
          addon_description: '',
          addon_code: '',
          price: 0,
          quantity: 1,
          type: 'one_time',
        },
      ]);
    }
  }, [open]);

  const addAddon = (e) => {
    e.preventDefault();

    setAddons([
      ...addons,
      {
        addon_description: '',
        addon_code: '',
        price: 0,
        quantity: 1,
        type: 'one_time',
      },
    ]);
  };

  const onAddonChange = (data, index) => {
    const { name, value, label } = data;
    let myAddons = addons.slice();

    if (name === 'addon_code') {
      if (value !== '') {
        let myAddon = addonOptions.find((a) => a.addon_code === value);
        if (myAddon) {
          myAddons[index] = {
            name: myAddon.name,
            addon_code: value,
            addon_description: myAddon.description,
            price: myAddon.price_brackets[0].price,
            type: myAddon.type,
            quantity: myAddon.quantity ? myAddon.quantity : 1,
          };
        } else {
          // create
          myAddons[index] = {
            name: label,
            addon_code: value,
            addon_description: '',
            price: 0,
            type: 'one_time',
            quantity: 1,
          };
        }
      } else {
        //reset
        myAddons[index] = {
          name: '',
          addon_code: '',
          addon_description: '',
          price: 0,
          type: 'one_time',
          quantity: 1,
        };
      }
    } else {
      myAddons[index] = { ...myAddons[index], [name]: value };
    }
    setAddons(myAddons);
  };

  const onAddonRemove = (index) => {
    let myAddons = [...addons]; // make a separate copy of the array
    myAddons.splice(index, 1);
    setAddons(myAddons);
  };

  const saveChanges = () => {
    //console.log(addons);
    onAddOneTimeAddon(addons);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      align="top"
      as={'div'}
      noOverlayClick={true}
    >
      <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader title="Add One Time Addon" setOpen={setOpen} />
        <div className="py-4 px-6">
          {addons.length > 0 && (
            <div className="mt-2 mb-4 text-sm">
              {addons.map((a, index) => (
                <AddOn
                  key={index}
                  addons={addonOptions}
                  formData={a}
                  currencyCode={subscription.currency_code}
                  onChange={(e) => onAddonChange(e, index)}
                  onRemove={(e) => onAddonRemove(index)}
                  oneTimeOnly={true}
                />
              ))}
            </div>
          )}
          <button
            id="add-adddon"
            onClick={addAddon}
            className="text-sm py-1 text-left text-red-500 hover:text-red-800"
          >
            <PlusIcon className="w-6 h-6 inline" /> Associate another addon
          </button>
        </div>
        <div className="text-right mt-4 p-4 border-t">
          <Button
            color="gray"
            onClick={() => setOpen(false)}
            classes="mr-2"
            loading={loading}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={saveChanges}
            loading={loading}
            showLoading={true}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default AddAddonModal;
