import Checkbox from 'components/Forms/Checkbox';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectReport } from '../../optimizationSlice';

const ConvertAsNegativeKeyword = ({
  accountId,
  marketplace,
  option,
  onUpdate,
  checked,
}) => {
  const report = useSelector(selectReport);

  const { matchType, level } = option.rule.actionData;

  const onChangeChecked = async (e) => {
    const reportId = report.advOptimizationReportId;
    const optionId = option.advOptimizationReportItemOptionId;
    const itemId = option.advOptimizationReportItemId;

    const { checked } = e.target;

    await axios.put(
      `/ppc/optimizations/reports/${reportId}/items/${itemId}/options/${optionId}`,
      {
        accountId,
        marketplace,
        selected: checked,
        data: {},
      }
    );

    onUpdate(optionId, checked);
  };

  return (
    <div className="flex items-center mb-2">
      <Checkbox checked={checked} onChange={onChangeChecked} />

      <div className="ml-3">
        <p className="font-medium">{option.rule.name}</p>
        <p>{`Convert as ${matchType} keyword in ${level} level`}</p>
      </div>
    </div>
  );
};

export default ConvertAsNegativeKeyword;
