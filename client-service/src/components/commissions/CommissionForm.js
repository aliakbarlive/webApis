import {
  addCommission,
  updateCommission,
} from 'features/admin/agencyClients/commissionsSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  CustomInput,
  Input,
} from 'reactstrap';

const CommissionForm = ({
  toggle,
  operation,
  subscriptionId,
  commission = null,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    type: commission ? commission.type : 'gross',
    rate: commission ? commission.rate : 4,
    marketplaceId: commission ? commission.marketplaceId : 'ATVPDKIKX0DER',
    subscriptionId: commission ? commission.subscriptionId : subscriptionId,
    monthThreshold: commission ? commission.monthThreshold : 0,
    commence: commission ? (commission.commencedAt ? true : false) : false,
  });
  const [disableThreshold, setDisableThreshold] = useState(
    formData.type == 'gross' ? true : false
  );
  const [showBaseline, setShowBaseline] = useState(
    formData.type == 'benchmark' ? true : false
  );

  const onInputChange = (e) => {
    const { target } = e;
    if (target.name == 'commence') {
      setFormData({ ...formData, [target.name]: target.checked });
    } else {
      setFormData({ ...formData, [target.name]: target.value });

      if (target.name == 'type') {
        setDisableThreshold(target.value == 'gross' ? true : false);
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('submit', formData);
    if (commission) {
      dispatch(
        updateCommission({ commissionId: commission.commissionId, formData })
      ).then(() => {
        toggle();
      });
    } else {
      dispatch(addCommission(formData)).then(() => {
        toggle();
      });
    }
  };

  return (
    <Form method="POST" onSubmit={onSubmit}>
      <FormGroup row>
        <Label className="" for="plan" sm={4}>
          Type
        </Label>
        <Col sm={8}>
          <CustomInput
            type="select"
            id="type"
            name="type"
            value={formData.type}
            onChange={onInputChange}
            required
          >
            <option value="gross">Gross</option>
            <option value="benchmark">Benchmarked Average</option>
            <option value="rolling">Rolling Average</option>
          </CustomInput>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="plan" sm={4}>
          MarketplaceId
        </Label>
        <Col sm={8}>
          <CustomInput
            type="select"
            id="marketplaceId"
            name="marketplaceId"
            value={formData.marketplaceId}
            onChange={onInputChange}
            required
          >
            <option value="ATVPDKIKX0DER">US</option>
            <option value="A2EUQ1WTGCTBG2">CA</option>
          </CustomInput>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="plan" sm={4}>
          Rate
        </Label>
        <Col sm={8}>
          <Input
            type="text"
            name="rate"
            id="rate"
            placeholder="Commission Rate"
            value={formData.rate}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row className={disableThreshold ? 'd-none' : ''}>
        <Label className="" for="plan" sm={4} style={{ fontSize: '12.5px' }}>
          Month Threshold
        </Label>
        <Col sm={8}>
          <Input
            type="text"
            name="monthThreshold"
            id="monthThreshold"
            placeholder="No. of months needed to compute the average"
            value={formData.monthThreshold}
            onChange={onInputChange}
            disabled={disableThreshold}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="plan" sm={4}>
          Baseline
        </Label>
        <Col sm={8}>
          <Input
            type="text"
            name="preContractAvgBenchmark"
            id="preContractAvgBenchmark"
            placeholder="Baseline"
            value={formData.preContractAvgBenchmark}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="plan" sm={4}>
          Auto-add
        </Label>
        <Col sm={8}>
          <CustomInput
            type="switch"
            id="commence"
            onChange={onInputChange}
            checked={formData.commence}
            name="commence"
          />
          <sub className="text-primary">
            *Automatically add to a new pending invoice
          </sub>
        </Col>
      </FormGroup>
      <Row className="pb-3">
        <Col sm={12} className="text-right">
          <Button color="dark" onClick={toggle}>
            Cancel
          </Button>
          <Button className="ml-2" color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default CommissionForm;
