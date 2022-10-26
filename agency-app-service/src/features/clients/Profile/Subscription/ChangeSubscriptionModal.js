import React, { useDispatch, useSelector } from 'react-redux';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import Button from 'components/Button';
import {
  ExclamationIcon,
  PlusIcon,
  AnnotationIcon,
} from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import AddOn from 'features/clients/Form/AddOn';
import { fetchAddons } from 'features/clients/clientsSlice';
import Label from 'components/Forms/Label';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';
import { fetchPlans } from 'features/clients/clientsSlice';
import Input from 'components/Forms/Input';
import Textarea from 'components/Forms/Textarea';
import useSubscription from 'hooks/useSubscription';
import { CANCELLED, EXPIRED } from 'utils/subscriptions';

const ChangeSubscriptionModal = ({
  subscription,
  scheduledChanges,
  open,
  setOpen,
  onChange,
  loading,
}) => {
  const { plans, addons: addonOptions } = useSelector((state) => state.clients);
  const status = useSubscription(subscription);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    plan_code: '',
    plan_description: '',
    price: 0,
    addons: [],
    apply_changes: status.hasAny([EXPIRED, CANCELLED])
      ? 'immediately'
      : 'end_of_this_term',
    auto_collect: true,
    card_id: '',
  });

  useEffect(() => {
    if (open) {
      if (plans.length <= 0) {
        dispatch(fetchPlans());
      }
    }
  }, [open, plans]);

  useEffect(() => {
    if (open) {
      if (addonOptions.length <= 0) {
        dispatch(fetchAddons());
      }
    }
  }, [open, addonOptions]);

  useEffect(() => {
    if (open && addonOptions.length > 0) {
      setFormData({
        ...formData,
        plan_code: subscription.plan.plan_code,
        plan_description: subscription.plan.description,
        price: subscription.plan.price,
        addons: subscription.addons.map((a) => {
          return {
            addon_description: a.description,
            addon_code: a.addon_code,
            price: a.price,
            quantity: a.quantity,
            type: addonOptions.find((ao) => ao.addon_code === a.addon_code)
              .type,
          };
        }),
        auto_collect: subscription.auto_collect,
        card_id: subscription.card ? subscription.card.card_id : '',
      });
    }
  }, [open, addonOptions]);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const onPlanChange = (e) => {
  //   const value = e.target.value;
  //   if (value !== '') {
  //     const plan = plans.find((p) => p.plan_code == value);
  //     let { recurring_price: price, description: plan_description } = plan;
  //     if (value == subscription.plan.plan_code) {
  //       price = subscription.plan.price;
  //       plan_description = subscription.plan.description;
  //     }
  //     setFormData({ ...formData, plan_code: value, price, plan_description });
  //   }
  // };

  const addAddon = (e) => {
    e.preventDefault();

    setFormData({
      ...formData,
      addons: [
        ...formData.addons,
        {
          addon_description: '',
          addon_code: '',
          price: 0,
          quantity: 1,
          type: 'one_time',
        },
      ],
    });
  };

  const onAddonChange = (data, index) => {
    const { name, value, label } = data;
    let myAddons = formData.addons.slice();

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
    setFormData({ ...formData, addons: myAddons });
  };

  const onAddonRemove = (index) => {
    let myAddons = [...formData.addons]; // make a separate copy of the array
    myAddons.splice(index, 1);
    setFormData({ ...formData, addons: myAddons });
  };

  const onSaveSubscription = () => {
    onChange(formData);
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
        <ModalHeader
          title={
            status.hasAny([EXPIRED, CANCELLED])
              ? 'Reactivate Subscription'
              : 'Change Subscription'
          }
          setOpen={setOpen}
        />
        <div className="py-4 px-6 sm:grid sm:grid-cols-3 sm:gap-3">
          {status.hasAny([EXPIRED, CANCELLED]) ? (
            <p className="col-span-3 bg-red-50 text-red-900 text-sm p-3">
              <AnnotationIcon className="w-6 h-6 inline text-red-600 mr-2" />
              Changes will be applied immediately
            </p>
          ) : (
            <p className="col-span-3 bg-gray-50 text-gray-900 text-sm p-3">
              <AnnotationIcon className="w-6 h-6 inline text-blue-600 mr-2" />
              Changes will be applied starting on the next billing
            </p>
          )}

          {scheduledChanges.code === 0 && (
            <p className="col-span-3 bg-yellow-50 text-gray-900 text-sm p-3">
              <ExclamationIcon className="w-6 h-6 inline text-yellow-600 mr-2" />
              This subscription has some scheduled changes. Those changes will
              be discarded if you update the subscription
            </p>
          )}

          {/* <div className="col-span-1">
            <Label htmlFor="plan">
              Plan <RequiredAsterisk />
            </Label>
            <Select
              id="plan"
              label="plan"
              value={formData.plan_code}
              onChange={onPlanChange}
            >
              {plans.map((plan) => (
                <option key={plan.plan_code} value={plan.plan_code}>
                  {plan.plan_code}
                </option>
              ))}
            </Select>
          </div> */}
          <div className="col-span-1">
            <Label htmlFor="price">
              Price <RequiredAsterisk />
            </Label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                type="text"
                id="price"
                value={formData.price}
                onChange={onInputChange}
                classes="pl-7 r-12"
                placeholder="0.00"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <span className="py-0 pl-2 pr-4">
                  {subscription.currency_code}
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <Label htmlFor="plan_description">Description</Label>
            <Textarea
              id="plan_description"
              value={formData.plan_description}
              onChange={onInputChange}
              rows={3}
            />
          </div>
          <div className="col-span-3">
            <Label htmlFor="add-addon">Addons</Label>
            {formData.addons.length > 0 && (
              <div className="mt-2 mb-4 text-sm">
                {formData.addons.map((a, index) => (
                  <AddOn
                    key={index}
                    addons={addonOptions}
                    formData={a}
                    currencyCode={subscription.currency_code}
                    onChange={(e) => onAddonChange(e, index)}
                    onRemove={(e) => onAddonRemove(index)}
                    disableCreateNew={true}
                  />
                ))}
              </div>
            )}
            <div>
              <button
                id="add-adddon"
                onClick={addAddon}
                className="text-sm py-1 text-left text-red-500 hover:text-red-800"
              >
                <PlusIcon className="w-6 h-6 inline" /> Associate another addon
              </button>
            </div>
          </div>
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
            onClick={onSaveSubscription}
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

export default ChangeSubscriptionModal;
