import React from 'react';

const ListingCategoriesChanged = ({ alert }) => {
  const { data } = alert.data.listingChanges;

  const CategoryList = ({ categories }) => {
    return (
      <ul className="">
        {categories.map((category) => {
          return (
            <li key={category.category_id}>
              <a
                target="_blank"
                rel="noreferrer"
                href={category.link}
                className="hover:text-red-500"
              >
                {category.name}
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div>
        <p className="text-sm text-gray-500">Previous Value</p>
        <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
          <CategoryList categories={data.oldVal} />
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500">Updated Value</p>
        <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
          <CategoryList categories={data.newVal} />
        </div>
      </div>
    </div>
  );
};

export default ListingCategoriesChanged;
