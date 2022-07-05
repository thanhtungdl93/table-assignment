import React, { useEffect, useMemo, useState }  from "react";
import axios from "axios";
import { useTable, usePagination, useSortBy } from 'react-table';
import './table.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const BasicTable = () => {

  var [lstdata, setLstdatas] = useState([]);

  const fetchUsers = async () => {
    const newArr = [];
    var response = await axios.get('https://randomuser.me/api/?results=100').catch(e => console.log(e));

    if (response){
      const users = response.data.results;
      users.forEach(element => {
        const dataobj = {
          "gender": "male",
          "name": {
            "title": "mr",
            "first": "brad",
            "last": "gibson"
          },
          "location": {
            "street": "9278 new road",
            "city": "kilcoole",
            "state": "waterford",
            "postcode": "93027",
            "coordinates": {
              "latitude": "20.9267",
              "longitude": "-7.9310"
            },
            "timezone": {
              "offset": "-3:30",
              "description": "Newfoundland"
            }
          },
          "email": "brad.gibson@example.com",
          "login": {
            "uuid": "155e77ee-ba6d-486f-95ce-0e0c0fb4b919",
            "username": "silverswan131",
            "password": "firewall",
            "salt": "TQA1Gz7x",
            "md5": "dc523cb313b63dfe5be2140b0c05b3bc",
            "sha1": "7a4aa07d1bedcc6bcf4b7f8856643492c191540d",
            "sha256": "74364e96174afa7d17ee52dd2c9c7a4651fe1254f471a78bda0190135dcd3480"
          },
          "dob": {
            "date": "1993-07-20T09:44:18.674Z",
            "age": 26
          },
          "registered": {
            "date": "2002-05-21T10:59:49.966Z",
            "age": 17
          },
          "phone": "011-962-7516",
          "cell": "081-454-0666",
          "id": {
            "name": "PPS",
            "value": "0390511T"
          },
          "picture": {
            "large": "https://randomuser.me/api/portraits/men/75.jpg",
            "medium": "https://randomuser.me/api/portraits/med/men/75.jpg",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/men/75.jpg"
          },
          "nat": "IE"
        }
        dataobj.name.last = element.name.title + " "+ element.name.first + " " + element.name.last;
        dataobj.login.username = element.login.username;
        dataobj.picture.thumbnail = element.picture.thumbnail;
        newArr.push(dataobj);
      });
    }
    setLstdatas(newArr);
  };

  const data = lstdata;

  const columns = useMemo(() => [
    {
        Header: 'Full Name',
        accessor: 'name.last'
    },
    {
        Header: 'Username',
        accessor: 'login.username'
    },
    {
        Header: 'Thumbnail Icon',
        accessor: 'picture.thumbnail',
        Cell: tableProps => (
          <img
            src={tableProps.row.original.picture.thumbnail}
            width={60}
            alt='thumbnail'
          />
        )
    }
  ], []);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  )
  return (
    <div>
      <table className="table" {...getTableProps()}>
        <thead style={{backgroundColor: "#04AA6D"}}>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                              : ''}
                          </span>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                )
            })}
        </tbody>
      </table>
    
      <ul className="pagination">
        <li className="page-item" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <a className="page-link">First</a>
        </li>
        <li className="page-item" onClick={() => previousPage()} disabled={!canPreviousPage}>
            <a className="page-link">{'<'}</a>
        </li>
        <li className="page-item" onClick={() => nextPage()} disabled={!canNextPage}>
            <a className="page-link">{'>'}</a>
        </li>
        <li className="page-item" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            <a className="page-link">Last</a>
        </li>
        <li>
            <a className="page-link">
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
            </a>
        </li>
      </ul>
    </div >
  )
}