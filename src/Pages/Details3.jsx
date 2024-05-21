import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import dayjs from "dayjs";
import Loader from "../Components/Loader";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { MenuItem } from "@mui/material";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useRef } from "react";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
const columns = [
  { id: "srNo" },
  { id: "assemblyLineName" },
  { id: "loading" },
  { id: "unloading" },
  { id: "painting" },
  { id: "FGqty" },
  { id: "Shift" },
  { id: "Assemblywipqty" },
  { id: "Testingwipqty" },
  { id: "Paintingwipqty" },
];

export default function Detail3() {
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [toDate, setToDate] = React.useState(dayjs());
  const [fromDate, setFromDate] = React.useState(dayjs());
  // const [currentPage, setCurrentPage] = useState(0);
  // const [perPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [lineId, setLineId] = React.useState([]);
  const tableRef = useRef(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setData([]);
      setLoading(true);

      const response = await axios.post(
        "http://35.154.234.143:9090/report/report-1/v2",
        {
          fromDate: fromDate.add(5, "hour").add(30, "minute"),
          toDate: toDate.add(5, "hour").add(30, "minute"),
          lineId: lineId.length > 0 ? lineId : null,
          // currentPage: currentPage + 1,
          // perPage: perPage,
        }
      );
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const handelSearch = () => {
    fetchData();
  };
  const reset = async () => {
    try {
      setFromDate(dayjs());
      setToDate(dayjs());
      setLineId([]);
      setLoading(true);

      const response = await axios.post(
        "http://35.154.234.143:9090/report/report-1/v2",
        {
          fromDate: dayjs(),
          toDate: dayjs(),
          lineId: null,
        }
      );
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleLineTypeChange = (event) => {
    const { value } = event.target;
    setLineId(value);
    console.log(event.target.value);
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Report1`,
    sheet: "Users",
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Report</h1>
      {loading && <Loader />}
      <div className="m-5">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            <DateTimePicker
              label="From"
              size="small"
              value={fromDate}
              onChange={(newValue) => {
                setFromDate(newValue);
              }}
            />
            <DateTimePicker
              label="To"
              size="small"
              value={toDate}
              onChange={(newValue) => {
                setToDate(newValue);
              }}
            />
            <Box sx={{ minWidth: 170, display: "flex", gap: "20px" }}>
              <FormControl fullWidth>
                <InputLabel id="Line">Lines</InputLabel>
                <Select
                  label="Line"
                  id="Line"
                  value={lineId}
                  onChange={handleLineTypeChange}
                  defaultChecked={1}
                  multiple
                  renderValue={(selected) => (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} style={{ margin: 2 }} />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem value="" selected>
                    All Lines
                  </MenuItem>
                  <MenuItem value="1">R1040 Assembly</MenuItem>
                  <MenuItem value="2">DV Assembly</MenuItem>
                  <MenuItem value="3">R550 Assembly</MenuItem>
                  <MenuItem value="4">E Series Assembly</MenuItem>
                  <MenuItem value="5">R810 Assembly</MenuItem>
                  <MenuItem value="6">HA Assembly</MenuItem>
                  <MenuItem value="7">6R Assembly</MenuItem>
                  <MenuItem value="8">SL90 Assembly</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <div className="flex items-center gap-5 mt-5 mb-5 justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white h-[55px] w-24 p-2 rounded  text-xs "
                onClick={handelSearch}
              >
                Search
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white h-[55px] w-24 p-2 rounded  text-xs "
                onClick={reset}
              >
                Reset
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white h-[55px] w-24 p-2 rounded  text-xs "
                onClick={onDownload}
              >
                Download
              </button>
            </div>
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" ref={tableRef}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Sr. No.</TableCell>
                <TableCell align="center">Assembly Line Name</TableCell>
                <TableCell align="center">Assembly Quantity Loaded</TableCell>
                <TableCell align="center">Assembly Quantity Unloaded</TableCell>
                <TableCell align="center">Painting Quantity Loaded</TableCell>
                <TableCell align="center">FG Quantity</TableCell>
                <TableCell align="center">Shift</TableCell>
                <TableCell align="center">Assembly WIP Quantity</TableCell>
                <TableCell align="center">Testing WIP Quantity</TableCell>
                <TableCell align="center">Painting WIP Quantity</TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.sr_no}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id} align="center">
                          {column.format
                            ? column.format(row[column.id])
                            : row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          // rowsPerPage={rowsPerPage}
          // page={page}
          // onPageChange={handleChangePage}
          // onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
