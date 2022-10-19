import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardBody, Row, Col, Button, Form } from 'reactstrap';
import ClientDetailsForm from '../form/ClientDetailsForm';
import { Edit3 } from 'react-feather';
import { patchAgencyClient } from 'features/admin/agencyClients/agencyClientsSlice';

const Details = ({ agencyClient, history }) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    client: agencyClient.client,
    address: agencyClient.address,
    siEmail: agencyClient.siEmail,
    website: agencyClient.website,
    aboutUs: agencyClient.aboutUs,
    overview: agencyClient.overview,
    painPoints: agencyClient.painPoints,
    goals: agencyClient.goals,
    productCategories: agencyClient.productCategories,
    amazonPageUrl: agencyClient.amazonPageUrl,
    asinsToOptimize: agencyClient.asinsToOptimize,
    otherNotes: agencyClient.otherNotes,
  });

  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
  };

  function updateFormData(data) {
    setFormData({ ...formData, ...data });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(
      patchAgencyClient(agencyClient.agencyClientId, formData, history)
    ).then(() => {
      setModal(!modal);
    });
  };

  return (
    <Card>
      <CardBody className={'text-dark p-auto p-lg-5'}>
        <Row>
          {!modal ? (
            <Col className="mb-4">
              <a
                href="#"
                className="btn btn-sm btn-outline-primary"
                onClick={toggle}
              >
                <Edit3 size={14} />
                &nbsp;&nbsp;Edit
              </a>
            </Col>
          ) : (
            ''
          )}
        </Row>
        {!modal ? (
          <Row>
            <Col lg={10}>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  Address
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  {agencyClient.address}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  SI Email
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  {agencyClient.siEmail}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  Website
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  <a
                    href={agencyClient.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {agencyClient.website}
                  </a>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  About Us
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  <pre className={'profile-form-text'}>
                    {agencyClient.aboutUs}
                  </pre>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  Overview
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  <pre className={'profile-form-text'}>
                    {agencyClient.overview}
                  </pre>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  Pain Points
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  <pre className={'profile-form-text'}>
                    {agencyClient.painPoints}
                  </pre>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  Goals
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  <pre className={'profile-form-text'}>
                    {agencyClient.goals}
                  </pre>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  Categories
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  {agencyClient.productCategories}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  Amazon Page Url
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  <a
                    href={agencyClient.amazonPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {agencyClient.amazonPageUrl}
                  </a>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  ASINs to Optimize
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  <pre className={'profile-form-text'}>
                    {agencyClient.asinsToOptimize}
                  </pre>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={2} className={'profile-form-label'}>
                  Other Notes
                </Col>
                <Col lg={9} className={'pl-4 pl-lg-0'}>
                  <pre className={'profile-form-text'}>
                    {agencyClient.otherNotes}
                  </pre>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          <Form method="POST" onSubmit={onSubmit}>
            <Row>
              <Col lg={8}>
                <ClientDetailsForm
                  formData={formData}
                  onDataChange={updateFormData}
                  hideInitialFields={1}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={8} className="text-right">
                <Button color="dark" onClick={toggle}>
                  Cancel
                </Button>
                <Button className="ml-2" color="primary" onClick={onSubmit}>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};
export default Details;
