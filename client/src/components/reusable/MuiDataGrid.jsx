import { memo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { PAGE_SIZE } from "../../utils/constants";

/**
 * Standardized DataGrid wrapper with fixed page size and shared toolbar defaults.
 *
 * @param {import("@mui/x-data-grid").DataGridProps} props - DataGrid props.
 * @returns {JSX.Element} Configured DataGrid.
 * @throws {never} This component does not throw.
 */
const MuiDataGrid = ({
  pageSizeOptions = [PAGE_SIZE],
  slots,
  sx,
  initialState,
  ...props
}) => {
  return (
    <DataGrid
      disableRowSelectionOnClick
      pageSizeOptions={pageSizeOptions}
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize: PAGE_SIZE,
          },
        },
        ...initialState,
      }}
      slots={{
        toolbar: GridToolbar,
        ...slots,
      }}
      sx={{
        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
          outline: "none",
        },
        ...(sx || {}),
      }}
      {...props}
    />
  );
};

export default memo(MuiDataGrid);
