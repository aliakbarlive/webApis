import React from 'react';
import Input from 'components/Forms/Input';
import Textarea from 'components/Forms/Textarea';
import Label from 'components/Forms/Label';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';

const DetailsForm = ({ formData, onDataChange, editProfile = 0 }) => {
  const onInputChange = (e) => {
    onDataChange({ [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {!editProfile && (
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Client Details
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Detailed information about the client
                </p>
              </div>
            </div>
          )}
          <div
            className={`mt-5 md:mt-0 ${
              editProfile ? 'md:col-span-3' : 'md:col-span-2'
            } `}
          >
            <div className="shadow overflow-hidden sm:rounded-t-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="client">
                      Client <RequiredAsterisk />
                    </Label>
                    <Input
                      id="client"
                      type="text"
                      value={formData.client}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  {!editProfile && (
                    <div>
                      <Label htmlFor="email">
                        Email <RequiredAsterisk />
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={onInputChange}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="serviceAgreementLink">
                      Service Agreement Link
                    </Label>
                    <Input
                      id="serviceAgreementLink"
                      type="text"
                      label="Service Agreement Link"
                      value={formData.serviceAgreementLink}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={onInputChange}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="siEmail">SI Email</Label>
                    <Input
                      id="siEmail"
                      type="email"
                      label="SI Email"
                      value={formData.siEmail}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="text"
                      value={formData.website}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutUs">About Us</Label>
                    <Textarea
                      id="aboutUs"
                      value={formData.aboutUs}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      value={formData.overview}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="painPoints">Pain Points</Label>
                    <Textarea
                      id="painPoints"
                      value={formData.painPoints}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals">Goals</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="productCategories">
                      Product Categories
                    </Label>
                    <Input
                      id="productCategories"
                      type="text"
                      value={formData.productCategories}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="productCategories">Amazon Page URL</Label>
                    <Input
                      id="amazonPageUrl"
                      type="text"
                      value={formData.amazonPageUrl}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="asinsToOptimize">ASINs to Optimize</Label>
                    <Textarea
                      id="asinsToOptimize"
                      value={formData.asinsToOptimize}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="otherNotes">Other Notes</Label>
                    <Textarea
                      id="otherNotes"
                      value={formData.otherNotes}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DetailsForm;
