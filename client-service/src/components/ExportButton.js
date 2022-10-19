import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { DownloadCloud } from 'react-feather';

const ExportButton = ({ method = 'GET', url, params }) => {
  const [exporting, setExporting] = useState(false);

  const onExport = () => {
    setExporting(true);
    axios({
      method,
      url,
      params,
      responseType: 'arraybuffer',
    })
      .then((response) => {
        const type = response.headers['content-type'];

        const fileName = response.headers['content-disposition']
          .replace('attachment; filename="', '')
          .replace('"', '');
        const blob = new Blob([response.data], {
          type: type,
          encoding: 'UTF-8',
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      })
      .finally(() => setExporting(false));
  };

  return (
    <Button
      className="btn-block"
      color="primary"
      onClick={onExport}
      disabled={exporting}
    >
      <DownloadCloud size="20" className="mr-2" />
      {exporting ? 'Exporting' : 'Export'}
    </Button>
  );
};

export default ExportButton;
