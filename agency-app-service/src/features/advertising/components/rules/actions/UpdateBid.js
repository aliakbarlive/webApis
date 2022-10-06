import { useTranslation } from 'react-i18next';
import dot from 'dot-object';
import {
  CHANGE_TO,
  DECREASE_BY,
  INCREASE_BY,
  PERCENTAGE,
  VALUE,
} from 'features/advertising/utils/constants';

const UpdateBid = ({ data, onChangeData, errors = {}, label }) => {
  const { t } = useTranslation();
  const onChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...data, [name]: value };
    if (name === 'type') {
      newData.value =
        value === INCREASE_BY || value === DECREASE_BY
          ? { type: VALUE, value: '' }
          : '';
    }
    onChangeData(dot.object(newData));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1">
          <select
            id="type"
            name="type"
            className="shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
            value={data.type}
            onChange={onChange}
          >
            <option value="">
              {t('Advertising.Rule.Action.UpdateBid.SelectType')}
            </option>
            <option value={CHANGE_TO}>
              {t('Advertising.Rule.Action.UpdateBid.ChangeTo')}
            </option>
            <option value={INCREASE_BY}>
              {t('Advertising.Rule.Action.UpdateBid.IncreaseBy')}
            </option>
            <option value={DECREASE_BY}>
              {t('Advertising.Rule.Action.UpdateBid.DecreaseBy')}
            </option>
          </select>
          {errors['actionData.type'] && (
            <p className="text-xs text-red-600">{errors['actionData.type']}</p>
          )}
        </div>
      </div>
      {data.type ? (
        data.type === CHANGE_TO ? (
          <div>
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700"
            >
              {t('Advertising.Rule.Action.UpdateBid.Value')}
            </label>
            <div className="mt-1 relative rounded-md">
              <input
                type="number"
                name="value"
                id="value"
                className="focus:outline-none focus:ring-0 focus:border-gray-300 block w-full px-3 sm:text-sm border-gray-300 rounded-md"
                value={data.value}
                onChange={onChange}
              />
              {errors['actionData.value'] && (
                <p className="text-xs text-red-600">
                  {errors['actionData.value']}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700"
            >
              {t('Advertising.Rule.Action.UpdateBid.Value')}
            </label>
            <div className="mt-1 relative rounded-md">
              <input
                type="number"
                name="value.value"
                id="value.value"
                className="focus:outline-none focus:ring-0 focus:border-gray-300 block w-full pr-16 sm:text-sm border-gray-300 rounded-md"
                value={data.value.value}
                onChange={onChange}
              />

              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  id="value.type"
                  name="value.type"
                  className="focus:outline-none focus:ring-0 focus:border-transparent h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                  value={data.value.type}
                  onChange={onChange}
                >
                  <option value={PERCENTAGE}>%</option>
                  <option value={VALUE}>$</option>
                </select>
              </div>
            </div>
            {errors['actionData.value.value'] && (
              <p className="text-xs text-red-600">
                {errors['actionData.value.value']}
              </p>
            )}
          </div>
        )
      ) : null}
    </div>
  );
};

export default UpdateBid;
