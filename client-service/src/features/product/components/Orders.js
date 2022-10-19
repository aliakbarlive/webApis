import React from 'react';

import ReactTooltip from 'react-tooltip';

import OrdersMap from './OrdersMap';
import OrdersTable from './OrdersTable';

const Orders = () => {
  return (
    <>
      <Card>
        <CardBody>
          <div className="w-50 mx-auto">
            <OrdersMap
              setTooltipContent={setContent}
              states={states}
              totalOrders={totalOrders}
            />
            <ReactTooltip html={true}>{content}</ReactTooltip>
          </div>
        </CardBody>
      </Card>

      {product.Orders && (
        <Card>
          <CardBody>
            <OrdersTable orders={product.Orders} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default Orders;
