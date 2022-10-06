import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { TrashIcon } from '@heroicons/react/outline';
import Label from 'components/Forms/Label';
import InputPrice from 'components/Forms/InputPrice';
import Input from 'components/Forms/Input';
import Select from 'components/Forms/Select';
import Textarea from 'components/Forms/Textarea';
import Error from 'components/Forms/Error';

const AddOn = ({
  addons,
  formData,
  currencyCode,
  onChange,
  onRemove,
  oneTimeOnly,
  disableCreateNew = false,
  errors = null,
}) => {
  const [addonExists, setAddonExists] = useState(true);
  const [zIndex, setZIndex] = useState(1);

  const options =
    addons &&
    addons.map((a) => {
      return { label: a.name, value: a.addon_code };
    });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      '*': {
        boxShadow: 'none !important',
      },
    }),
  };

  const onInputChange = (e) => {
    onChange({ name: e.target.name, value: e.target.value });
  };

  const handleChange = (e) => {
    const value = e ? e.value.replace(/\s/g, '-') : '';
    const label = e ? e.label : '';

    const addonExisting = addons.find((a) => a.addon_code === value);

    setAddonExists(addonExisting);

    onChange({
      name: 'addon_code',
      value,
      label,
    });
  };

  const removeAddon = (e) => {
    e.preventDefault();
    onRemove();
  };

  return (
    <div>
      <div
        className="flex bg-gray-50 p-3 rounded-lg mt-4"
        style={{ zIndex: zIndex }}
      >
        <div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 lg:col-span-5 text-sm">
              <Label htmlFor="addon_code">Addon</Label>
              <CreatableSelect
                isClearable
                name="addon_code"
                placeholder="Addon"
                onChange={handleChange}
                onFocus={(e) => setZIndex(5)}
                onBlur={(e) => setZIndex(1)}
                value={{
                  label: formData.name,
                  value: formData.addon_code,
                }}
                required
                options={options}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: 'rgba(239,68,68,0.5)',
                    primary: 'rgb(239,68,68)',
                  },
                })}
                styles={customStyles}
                {...(disableCreateNew && { isValidNewOption: () => false })}
              />
              <Error>{errors?.addon_code}</Error>
            </div>
            <div className="col-span-6 lg:col-span-2 text-sm">
              <Label htmlFor="type">Type</Label>
              <Select
                name="type"
                onChange={onInputChange}
                disabled={addonExists || oneTimeOnly}
                value={formData.type}
                required
              >
                <option value="one_time">One Time</option>
                <option value="recurring">Recurring</option>
              </Select>
            </div>
            <div className="col-span-6 lg:col-span-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                name="quantity"
                min={1}
                value={formData.quantity}
                onChange={onInputChange}
              />
              <Error>{errors?.quantity}</Error>
            </div>
            <div className="col-span-6 lg:col-span-2">
              <Label htmlFor="price">Price</Label>
              <InputPrice
                name="price"
                value={formData.price}
                onChange={onInputChange}
                currencyCode={currencyCode}
              />
              <Error>{errors?.price}</Error>
            </div>
            <div className="col-span-6 lg:col-span-2">
              <Label classes="block text-right">Total</Label>
              <div className="text-right flex justify-between items-center py-2">
                <span>=</span>
                <span className="ml-2 text-green-500">
                  {(formData.price * formData.quantity).toFixed(2)}&nbsp;
                  {currencyCode}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <Label htmlFor="addon_description">Description</Label>
            <Textarea
              name="addon_description"
              value={formData.addon_description}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        <div className="flex items-end">
          <button onClick={removeAddon} className="text-red-800 ml-3">
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddOn;
