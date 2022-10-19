import React from 'react';

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
} from 'reactstrap';

const NoteModal = ({ isOpen, toggle, order }) => {
  const { Notes } = order;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
      <ModalHeader toggle={toggle}>
        <h6 class="text-uppercase text-muted mb-2">Product Notes</h6>
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="exampleText">Add Note here</Label>
            <Input type="textarea" name="text" id="exampleText" />
          </FormGroup>
          <Button className="mb-2" color="primary" block>
            Add Note
          </Button>
        </Form>
        <div className="mt-2">
          {Notes &&
            Notes.map((note) => {
              return (
                <Card>
                  <h5>{note.createdAt}</h5>
                  <p>{note.body}</p>
                </Card>
              );
            })}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default NoteModal;
