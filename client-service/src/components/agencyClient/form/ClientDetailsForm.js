import React from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';

const ClientDetailsForm = ({
  formData,
  onDataChange,
  hideInitialFields = 0,
}) => {
  const onInputChange = (e) => {
    onDataChange({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <FormGroup row>
        <Label className="" for="client" sm={2}>
          Client *
        </Label>
        <Col sm={10}>
          <Input
            type="text"
            name="client"
            id="client"
            placeholder="Client Name"
            value={formData.client}
            required
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>

      {!hideInitialFields ? (
        <FormGroup row>
          <Label className="" for="email" sm={2}>
            Email *
          </Label>
          <Col sm={10}>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              required
              onChange={onInputChange}
            />
          </Col>
        </FormGroup>
      ) : (
        ''
      )}
      <FormGroup row>
        <Label className="" for="address" sm={2}>
          Address
        </Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="address"
            id="address"
            placeholder="Client Address"
            value={formData.address}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="siEmail" sm={2}>
          SI Email
        </Label>
        <Col sm={10}>
          <Input
            type="email"
            name="siEmail"
            id="siEemail"
            placeholder="Seller Interactive Email"
            value={formData.siEmail}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="website" sm={2}>
          Website
        </Label>
        <Col sm={10}>
          <Input
            type="text"
            name="website"
            id="website"
            placeholder="Website"
            value={formData.website}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="aboutUs" sm={2}>
          About Us
        </Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="aboutUs"
            id="aboutUs"
            placeholder="About Us"
            rows="3"
            value={formData.aboutUs}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="overview" sm={2}>
          Overview
        </Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="overview"
            id="overview"
            placeholder="Overview"
            rows="3"
            value={formData.overview}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="painPoints" sm={2}>
          Pain Points
        </Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="painPoints"
            id="painPoints"
            placeholder="Pain Points"
            rows="3"
            value={formData.painPoints}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="goals" sm={2}>
          Goals
        </Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="goals"
            id="goals"
            placeholder="Goals"
            rows="3"
            value={formData.goals}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="productCategories" sm={2}>
          Categories
        </Label>
        <Col sm={10}>
          <Input
            type="text"
            name="productCategories"
            id="productCategories"
            placeholder="Product Categories"
            value={formData.productCategories}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="amazonPageUrl" sm={2}>
          Amazon URL
        </Label>
        <Col sm={10}>
          <Input
            type="text"
            name="amazonPageUrl"
            id="amazonPageUrl"
            placeholder="Amazon Page URL"
            value={formData.amazonPageUrl}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="asinsToOptimize" sm={2}>
          ASINs to Optimize
        </Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="asinsToOptimize"
            id="asinsToOptimize"
            placeholder="ASINs to optimize"
            rows="3"
            value={formData.asinsToOptimize}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="otherNotes" sm={2}>
          Other Notes
        </Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="otherNotes"
            id="otherNotes"
            placeholder="Other Notes"
            rows="3"
            value={formData.otherNotes}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>
    </div>
  );
};
export default ClientDetailsForm;
