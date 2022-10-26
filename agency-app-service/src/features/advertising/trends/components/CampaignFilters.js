import axios from 'axios';
import { useState, useEffect } from 'react';
import { isObject, startCase } from 'lodash';
import Select from 'react-select';

import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import Checkbox from 'components/Forms/Checkbox';
import Button from 'components/Button';

const CampaignFilters = ({
  open,
  setOpen,
  accountId,
  marketplace,
  params,
  setParams,
}) => {
  const [paramsCopy, setParamsCopy] = useState(params);
  const [portfolios, setPortfolios] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const filters = {
    states: ['enabled', 'paused', 'archived'],
    targetingTypes: [
      { key: 'manual', display: 'Manual Targeting' },
      { key: 'auto', display: 'Auto Targeting' },
    ],
    campaignTypes: ['sponsoredProducts', 'sponsoredBrands', 'sponsoredDisplay'],
  };

  useEffect(() => {
    axios
      .get('/advertising/campaigns', {
        params: {
          pageSize: 100000,
          marketplace,
          accountId,
          attributes:
            'advPortfolioId,advCampaignId,targetingType,campaignType,state,name',
        },
      })
      .then((response) =>
        setCampaigns(
          response.data.data.rows.map((row) => {
            return { ...row, value: row.advCampaignId, label: row.name };
          })
        )
      );

    axios
      .get('/ppc/portfolios', {
        params: {
          pageSize: 100000,
          marketplace,
          accountId,
        },
      })
      .then((response) =>
        setPortfolios(
          response.data.data.rows.map((row) => {
            return { ...row, value: row.advPortfolioId, label: row.name };
          })
        )
      );
  }, [accountId, marketplace]);

  const onChangeFilter = (filterKey, key, checked) => {
    let newParams = { ...paramsCopy };

    newParams[filterKey] = checked
      ? [...newParams[filterKey], key]
      : newParams[filterKey].filter((v) => v !== key);

    setParamsCopy(newParams);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      as={'div'}
      align="top"
      noOverlayClick={true}
      persistent={true}
    >
      <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader
          title="Select Your Campaigns"
          titleClasses="text-sm font-normal"
          setOpen={setOpen}
          showCloseButton={false}
        />
        <div className="mx-4">
          <div>
            <p className="text-sm my-4 font-medium text-gray-700">
              Campaign Filters
            </p>

            <ul>
              {Object.keys(filters).map((filterKey) => {
                return filters[filterKey].map((f) => {
                  const key = isObject(f) ? f.key : f;
                  const value = isObject(f) ? f.display : startCase(f);
                  return (
                    <li key={key}>
                      <Checkbox
                        id={key}
                        classes="my-2 mx-3"
                        checked={paramsCopy[filterKey].includes(key)}
                        onChange={(e) =>
                          onChangeFilter(filterKey, key, e.target.checked)
                        }
                      />
                      <label className="text-xs font-medium text-gray-700 ml-3 w-full mt-2 cursor-pointer">
                        {value}
                      </label>
                    </li>
                  );
                });
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm my-4 font-medium text-gray-700">
                Portfolio Search
              </p>

              <Select
                options={portfolios}
                isMulti
                maxMenuHeight={200}
                defaultValue={portfolios.filter((p) =>
                  params.advPortfolioIds.includes(p.advPortfolioId)
                )}
                onChange={(values) =>
                  setParamsCopy({
                    ...params,
                    advPortfolioIds: values.map((a) => a.advPortfolioId),
                  })
                }
              />
            </div>

            <div>
              <p className="text-sm my-4 font-medium text-gray-700">
                Campaign Search
              </p>

              <Select
                options={campaigns}
                isMulti
                maxMenuHeight={200}
                defaultValue={campaigns.filter((c) =>
                  params.advCampaignIds.includes(c.advCampaignId)
                )}
                onChange={(values) =>
                  setParamsCopy({
                    ...params,
                    advCampaignIds: values.map((c) => c.advCampaignId),
                  })
                }
              />
            </div>
          </div>

          <hr />
          <div className="my-4">
            <Button
              onClick={() => {
                setParams(paramsCopy);
                setOpen(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CampaignFilters;
