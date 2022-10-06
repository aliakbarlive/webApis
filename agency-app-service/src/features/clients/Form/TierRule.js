import Input from 'components/Forms/Input';
import { MinusIcon } from '@heroicons/react/outline';

const TierRule = ({ rule, index, onRuleChange, removeRule }) => {
  const onInputChange = (e) => {
    onRuleChange({ name: e.target.name, value: e.target.value, index });
  };

  return (
    <tr>
      <td>
        <Input
          name="min"
          type="number"
          value={rule.min}
          onChange={onInputChange}
        />
      </td>
      <td>
        <Input
          name="max"
          type="number"
          value={rule.max}
          onChange={onInputChange}
        />
      </td>
      <td>
        <Input
          name="rate"
          type="number"
          value={rule.rate}
          onChange={onInputChange}
        />
      </td>
      <td>
        <button
          type="button"
          className="inline bg-gray-500 rounded-full hover:bg-red-900 text-white mx-1"
          onClick={() => removeRule(index)}
        >
          <MinusIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
};
export default TierRule;
